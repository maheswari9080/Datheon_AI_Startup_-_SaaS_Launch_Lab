/**
 * DealForge AI — Stripe Webhooks Controller
 * Implements HMAC SHA-256 cryptographic signature validation, replay attack prevention, and idempotent state transitions.
 */

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../db/database');

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_stripe_webhook_signing_secret_test_suite_9080';

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify Stripe Signature
 * Format: t=timestamp,v1=signature
 */
function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const parts = signatureHeader.split(',');
  let timestamp = null;
  let signature = null;

  parts.forEach(part => {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') signature = value;
  });

  if (!timestamp || !signature) return false;

  // Replay attack prevention: Max 5 minutes (300,000 ms) tolerance
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp, 10)) > 300) {
    return false;
  }

  const payloadToSign = `${timestamp}.${rawBody}`;
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadToSign, 'utf8')
    .digest('hex');

  return secureCompare(computedSignature, signature);
}

/**
 * POST /api/webhooks/stripe
 * Stripe Event Notification Webhook
 */
router.post('/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body.toString('utf8');

  // Verify HMAC signature
  const isValid = verifyStripeSignature(rawBody, sig, WEBHOOK_SECRET);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_SIGNATURE',
      message: 'Webhook signature verification failed.'
    });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
  }

  // Idempotency Check: Don't process duplicate webhook deliveries
  if (db.isWebhookProcessed(event.id)) {
    return res.status(200).json({
      success: true,
      message: 'Event already processed idempotently.'
    });
  }

  // Process Event
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};

      if (metadata.type === 'proposal_deposit' && metadata.proposalId) {
        // Unlock Proposal Paid State
        const proposal = db.findProposalById(metadata.proposalId);
        if (proposal) {
          const updatedMilestones = (proposal.milestones || []).map((m, idx) => {
            if (idx === 0) return { ...m, status: 'completed' };
            return m;
          });

          db.updateProposal(proposal.id, {
            status: 'paid',
            paidAt: new Date().toISOString(),
            stripeSessionId: session.id,
            milestones: updatedMilestones
          });
        }
      } else if (metadata.type === 'subscription_pro' || metadata.type === 'lifetime_license') {
        // Upgrade Agency User Tier
        if (session.customer_email) {
          const user = db.findUserByEmail(session.customer_email);
          if (user) {
            const newTier = metadata.type === 'lifetime_license' ? 'lifetime' : 'pro';
            db.updateUser(user.id, { tier: newTier });
          }
        }
      }

      // Update matching transaction record if exists
      const tx = db.data.transactions.find(t => t.stripeSessionId === session.id);
      if (tx) {
        db.updateTransaction(tx.id, {
          status: 'completed',
          stripePaymentIntentId: session.payment_intent || 'pi_simulated_success'
        });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const tx = db.data.transactions.find(t => t.stripePaymentIntentId === paymentIntent.id);
      if (tx) {
        db.updateTransaction(tx.id, { status: 'failed' });
      }
    }

    // Log processed event for idempotency
    db.logWebhookEvent(event);

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook execution error:', err);
    res.status(500).json({ error: 'Webhook processing failure.' });
  }
});

module.exports = {
  router,
  verifyStripeSignature
};
