/**
 * DealForge AI — Authentication Service
 * Handles password hashing via bcrypt (10 salt rounds) and JWT session generation.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'dealforge_dev_jwt_secret_super_secure_key_change_in_production_9080';
const JWT_EXPIRES_IN = '7d';

class AuthService {
  /**
   * Hash a plain text password with 10 salt rounds
   * @param {string} password 
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compare plain text password against stored hash
   * @param {string} password 
   * @param {string} hash 
   */
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate signed JWT session token
   * @param {Object} user 
   */
  generateToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        tier: user.tier || 'free'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify and decode a JWT session token
   * @param {string} token 
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }

  /**
   * Register a new agency user
   */
  async register({ name, email, password, agencyName }) {
    const cleanEmail = email.trim().toLowerCase();
    const existing = db.findUserByEmail(cleanEmail);

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await this.hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      agencyName: agencyName ? agencyName.trim() : 'Digital Agency',
      tier: 'free',
      proposalsCount: 0,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        agencyName: newUser.agencyName,
        tier: newUser.tier
      },
      token
    };
  }

  /**
   * Authenticate existing user
   */
  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await this.comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        agencyName: user.agencyName,
        tier: user.tier
      },
      token
    };
  }
}

module.exports = new AuthService();
