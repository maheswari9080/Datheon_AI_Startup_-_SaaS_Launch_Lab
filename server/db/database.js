/**
 * DealForge AI — Persistent Storage Engine
 * Implements thread-safe atomic writes to a local JSON database with indexed lookup helpers.
 */

const fs = require('fs');
const path = require('path');

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'dealforge.json');

// Initial clean schema state
const DEFAULT_STATE = {
  waitlist: [],
  users: [],
  proposals: [],
  transactions: [],
  processedWebhooks: [],
  analyticsEvents: []
};

class Database {
  constructor() {
    this.filePath = DB_FILE;
    this._ensureDir();
    this._load();
  }

  _ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this._save();
      }
    } catch (err) {
      console.warn('Database load warning, initializing defaults:', err.message);
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this._save();
    }
  }

  _save() {
    this._ensureDir();
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
    fs.renameSync(tempPath, this.filePath);
  }

  /* ================= Waitlist Operations ================= */
  getWaitlist() {
    return this.data.waitlist;
  }

  findWaitlistByEmail(email) {
    if (!email) return null;
    return this.data.waitlist.find(w => w.email.toLowerCase() === email.toLowerCase()) || null;
  }

  addToWaitlist(entry) {
    const existing = this.findWaitlistByEmail(entry.email);
    if (existing) {
      return { entry: existing, isDuplicate: true };
    }

    const newEntry = {
      id: `wl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: entry.name,
      email: entry.email.toLowerCase(),
      teamSize: entry.teamSize || '2-5',
      preferredTier: entry.preferredTier || 'lifetime',
      utmSource: entry.utmSource || 'direct',
      utmMedium: entry.utmMedium || 'web',
      utmCampaign: entry.utmCampaign || 'launch',
      variant: entry.variant || 'variant_a',
      referralCode: `DF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      queuePosition: this.data.waitlist.length + 185, // calibrated with founder alpha list
      createdAt: new Date().toISOString()
    };

    this.data.waitlist.push(newEntry);
    this._save();
    return { entry: newEntry, isDuplicate: false };
  }

  /* ================= User Operations ================= */
  getUsers() {
    return this.data.users;
  }

  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  createUser(user) {
    this.data.users.push(user);
    this._save();
    return user;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this._save();
    return this.data.users[idx];
  }

  /* ================= Proposal Operations ================= */
  getProposals(userId) {
    if (!userId) return this.data.proposals;
    return this.data.proposals.filter(p => p.userId === userId);
  }

  findProposalById(id) {
    return this.data.proposals.find(p => p.id === id) || null;
  }

  createProposal(proposal) {
    this.data.proposals.push(proposal);
    this._save();
    return proposal;
  }

  updateProposal(id, updates) {
    const idx = this.data.proposals.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.proposals[idx] = { ...this.data.proposals[idx], ...updates, updatedAt: new Date().toISOString() };
    this._save();
    return this.data.proposals[idx];
  }

  /* ================= Transaction Operations ================= */
  createTransaction(tx) {
    this.data.transactions.push(tx);
    this._save();
    return tx;
  }

  findTransactionById(id) {
    return this.data.transactions.find(t => t.id === id) || null;
  }

  updateTransaction(id, updates) {
    const idx = this.data.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.transactions[idx] = { ...this.data.transactions[idx], ...updates, updatedAt: new Date().toISOString() };
    this._save();
    return this.data.transactions[idx];
  }

  /* ================= Webhook Idempotency ================= */
  isWebhookProcessed(eventId) {
    return this.data.processedWebhooks.some(w => w.eventId === eventId);
  }

  logWebhookEvent(event) {
    this.data.processedWebhooks.push({
      eventId: event.id || `evt_${Date.now()}`,
      eventType: event.type,
      processedAt: new Date().toISOString()
    });
    this._save();
  }

  /* ================= Analytics Events ================= */
  logAnalyticsEvent(event) {
    this.data.analyticsEvents.push({
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ...event,
      timestamp: new Date().toISOString()
    });
    this._save();
  }
}

// Singleton database instance
const db = new Database();
module.exports = db;
