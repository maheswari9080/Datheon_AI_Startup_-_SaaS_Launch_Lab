/**
 * DealForge AI — Payments Router
 * Endpoints for initiating Stripe test checkout sessions for deposits and software plans
 */

const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { requireAuth } = require('../middleware/auth');
const db = require('../db/database');

/**
 * POST /api/payments/create-deposit-session
 * Public client endpoint: Initiates proposal deposit checkout
 */
router.post('/create-deposit-session', async (req, res) => {
  try {
    const { proposalId, signerName, signerEmail } = req.body;

    if (!proposalId || !signerName || !signerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID, signer name, and signer email are required.'
      });
    }

    const sessionData = await paymentService.createDepositSession({
      proposalId,
      signerName,
      signerEmail
    });

    res.status(200).json({ success: true, data: sessionData });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/payments/create-subscription-session
 * Agency founder endpoint: Initiates Pro or Lifetime plan checkout
 */
router.post('/create-subscription-session', requireAuth, async (req, res) => {
  try {
    const { planType } = req.body;

    if (!planType || !['pro', 'lifetime'].includes(planType)) {
      return res.status(400).json({
        success: false,
        message: 'Plan type must be either "pro" or "lifetime".'
      });
    }

    const sessionData = await paymentService.createSubscriptionSession({
      userId: req.user.id,
      planType
    });

    res.status(200).json({ success: true, data: sessionData });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/payments/transactions
 * Retrieve billing history for the current agency
 */
router.get('/transactions', requireAuth, (req, res) => {
  const transactions = (db.data.transactions || []).filter(t => t.userId === req.user.id);
  res.json({ success: true, data: transactions });
});

module.exports = router;
