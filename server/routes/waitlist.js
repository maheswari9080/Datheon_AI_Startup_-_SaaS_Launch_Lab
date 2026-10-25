/**
 * DealForge AI — Waitlist Router
 * Endpoints for email capture, deduplication, spam filtering, and queue status
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Rate limit: Max 10 waitlist signups per 15 minutes per IP
const waitlistRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many signup attempts. Please wait a few minutes before trying again.'
});

// Common disposable email domains to filter spam
const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
  'sharklasers.com',
  'yopmail.com'
];

/**
 * POST /api/waitlist
 * Register an early adopter on the waitlist
 */
router.post('/', waitlistRateLimiter, (req, res) => {
  try {
    const { name, email, teamSize, preferredTier, utmSource, utmMedium, utmCampaign, variant } = req.body;

    // 1. Mandatory Fields Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_NAME',
        message: 'Please provide a valid name of at least 2 characters.'
      });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'A valid email address is required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'MALFORMED_EMAIL',
        message: 'Please enter a properly formatted email address.'
      });
    }

    // 2. Disposable Email Filter
    const domain = cleanEmail.split('@')[1];
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return res.status(400).json({
        success: false,
        error: 'DISPOSABLE_EMAIL_REJECTED',
        message: 'Please use your primary work or studio email to secure VIP priority status.'
      });
    }

    // 3. Store in persistent database
    const { entry, isDuplicate } = db.addToWaitlist({
      name: name.trim(),
      email: cleanEmail,
      teamSize,
      preferredTier,
      utmSource,
      utmMedium,
      utmCampaign,
      variant
    });

    const referralLink = `https://dealforge.ai/?ref=${entry.referralCode}`;

    if (isDuplicate) {
      return res.status(200).json({
        success: true,
        message: 'Welcome back! Your VIP reservation is already confirmed.',
        data: {
          queuePosition: entry.queuePosition,
          referralCode: entry.referralCode,
          referralLink,
          preferredTier: entry.preferredTier,
          alreadyRegistered: true
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'VIP reservation secured! Welcome to DealForge AI.',
      data: {
        id: entry.id,
        queuePosition: entry.queuePosition,
        referralCode: entry.referralCode,
        referralLink,
        preferredTier: entry.preferredTier
      }
    });

  } catch (err) {
    console.error('Waitlist submission error:', err);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to process waitlist signup. Please try again.'
    });
  }
});

/**
 * GET /api/waitlist/stats
 * Public counter for live landing page social proof
 */
router.get('/stats', (req, res) => {
  const waitlist = db.getWaitlist();
  const count = waitlist.length + 184; // Initial calibrated founder cohort
  const remainingLifetime = Math.max(7, 100 - Math.floor(count * 0.35));

  res.json({
    success: true,
    data: {
      totalFoundersWaiting: count,
      lifetimePassesRemaining: remainingLifetime
    }
  });
});

module.exports = router;
