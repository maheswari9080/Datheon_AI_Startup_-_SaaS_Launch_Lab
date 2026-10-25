/**
 * DealForge AI — Authentication Router
 * Registration, login, session inspection, and token verification
 */

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { createRateLimiter } = require('../middleware/rateLimiter');
const db = require('../db/database');

const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again shortly.'
});

/**
 * POST /api/auth/register
 */
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { name, email, password, agencyName } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const result = await authService.register({ name, email, password, agencyName });
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await authService.login({ email, password });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/auth/me
 * Returns authenticated user profile
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }

  const user = db.findUserById(decoded.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      agencyName: user.agencyName,
      tier: user.tier,
      proposalsCount: db.getProposals(user.id).length
    }
  });
});

module.exports = router;
