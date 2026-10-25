# Stage 3.1 — MVP Technical Architecture, Database Schema & Security Model

## 1. System Architecture Overview

DealForge AI is engineered as a high-performance, modular fullstack application. It couples a responsive client interface with a secure Node.js service layer, protected by JWT session authentication, strict tenant isolation, and cryptographic webhook verification:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                               │
│                                                                        │
│  [ Waitlist Landing Page ]       [ Agency Proposal Studio ]            │
│  (index.html + tokens.css)       (app.html + dashboard.js)             │
│                                                                        │
│                      [ Client Interactive Proposal ]                   │
│                      (view.html + proposalView.js)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                             API GATEWAY                                │
│                                                                        │
│  [ Rate Limiter ] ──▶ [ CORS / Helmet ] ──▶ [ JWT Auth Middleware ]   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│ AUTH SERVICE │             │ PROPOSAL & AI│             │ STRIPE TEST  │
│              │             │ RISK ENGINE  │             │ CHECKOUT     │
│ • Bcrypt 10x │             │ • Ambiguity  │             │ • Server-side│
│ • Stateless  │             │   Heuristics │             │   price lock │
│   JWT tokens │             │ • Buffer calc│             │ • HMAC sigs  │
└──────┬───────┘             └──────┬───────┘             └──────┬───────┘
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        PERSISTENCE & DATA LAYER                        │
│                                                                        │
│  [ DealForge Data Store ] (ACID atomic file-backed JSON / SQLite)      │
│  • Users Table        • Proposals Table       • Transactions Table     │
│  • Waitlist Table     • WebhookEvents Table   • AnalyticsEvents Table  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Relational Entity Schema

### 2.1 Users Entity
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    agency_name TEXT,
    tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'pro' | 'lifetime'
    stripe_customer_id TEXT,
    proposals_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Proposals Entity
```sql
CREATE TABLE proposals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    project_title TEXT NOT NULL,
    project_value NUMERIC(10, 2) NOT NULL,
    deposit_percentage INTEGER DEFAULT 30,
    deposit_amount NUMERIC(10, 2) NOT NULL,
    timeline_weeks INTEGER NOT NULL,
    scope_notes TEXT NOT NULL,
    deliverables JSON NOT NULL,
    milestones JSON NOT NULL,
    risk_score INTEGER NOT NULL,          -- 1 to 100
    risk_level TEXT NOT NULL,             -- 'low' | 'medium' | 'high'
    risk_factors JSON NOT NULL,
    contingency_buffer_pct INTEGER NOT NULL,
    protective_clauses JSON NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published' | 'viewed' | 'signed' | 'paid'
    client_access_token TEXT UNIQUE NOT NULL,
    signed_at TIMESTAMP,
    signer_name TEXT,
    paid_at TIMESTAMP,
    stripe_session_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Transactions Entity
```sql
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    proposal_id TEXT REFERENCES proposals(id),
    type TEXT NOT NULL,                   -- 'proposal_deposit' | 'subscription_pro' | 'lifetime_license'
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'completed' | 'failed' | 'refunded'
    stripe_session_id TEXT UNIQUE NOT NULL,
    stripe_payment_intent_id TEXT,
    customer_email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Webhook Events (Idempotency Audit)
```sql
CREATE TABLE webhook_events (
    event_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSON NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Threat Model & Security Posture

| Threat Vector | Potential Impact | DealForge Architectural Defense |
|:---|:---|:---|
| **Insecure Direct Object Reference (IDOR)** | Tenant B viewing or editing Tenant A's private proposals | Strict ownership enforcement: All proposal mutation routes verify `req.user.id === proposal.userId`. |
| **Price Tampering on Checkout** | Adversary altering client deposit amount or lifetime plan price | Zero client-side price trust. Payment amount is calculated strictly on the backend from verified server state. |
| **Webhook Forgery / Replay** | Attacker submitting fake checkout success events to unlock licenses | Stripe HMAC SHA-256 signature verification (`stripe.webhooks.constructEvent`) + Idempotency audit table. |
| **Credential stuffing / Brute force** | Unauthorized access to agency accounts | Bcrypt with 10 salt rounds + Sliding window IP rate limiting on login/register endpoints. |
| **XSS & Content Injection** | Malicious script payload in proposal deliverables | Input sanitization, strict HTML entity encoding in client views, and Content Security Policy headers. |
