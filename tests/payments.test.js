/**
 * DealForge AI — Payments & Webhook Cryptography Unit Tests
 */

const assert = require('assert');
const crypto = require('crypto');
const { verifyStripeSignature } = require('../server/routes/webhooks');
const paymentService = require('../server/services/paymentService');

async function runPaymentTests() {
  console.log('--- Running Payment & Webhook Verification Tests ---');

  const secret = 'whsec_test_secret_for_cryptographic_unit_testing_9080';
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({
    id: `evt_test_${Date.now()}`,
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_mock_123', payment_status: 'paid' } }
  });

  // Test 1: Valid HMAC-SHA256 signature verification
  const payloadToSign = `${timestamp}.${payload}`;
  const validSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadToSign, 'utf8')
    .digest('hex');

  const validHeader = `t=${timestamp},v1=${validSignature}`;
  const isVerified = verifyStripeSignature(payload, validHeader, secret);
  assert.strictEqual(isVerified, true, 'Valid Stripe HMAC signature should verify');
  console.log('  ✓ Stripe HMAC-SHA256 signature verification passed');

  // Test 2: Forged / tampered signature rejection
  const forgedHeader = `t=${timestamp},v1=forged_hex_signature_attempt_999`;
  const isRejected = verifyStripeSignature(payload, forgedHeader, secret);
  assert.strictEqual(isRejected, false, 'Forged signature should be rejected');
  console.log('  ✓ Tampered signature rejection passed');

  // Test 3: Replay attack prevention (timestamp older than 300s)
  const staleTimestamp = timestamp - 3600; // 1 hour old
  const stalePayloadToSign = `${staleTimestamp}.${payload}`;
  const staleSignature = crypto
    .createHmac('sha256', secret)
    .update(stalePayloadToSign, 'utf8')
    .digest('hex');

  const staleHeader = `t=${staleTimestamp},v1=${staleSignature}`;
  const isStaleRejected = verifyStripeSignature(payload, staleHeader, secret);
  assert.strictEqual(isStaleRejected, false, 'Expired timestamp should trigger replay protection rejection');
  console.log('  ✓ Replay attack protection passed');

  // Test 4: Server-side deposit session creation
  const session = await paymentService.createDepositSession({
    proposalId: 'prop_demo_fintech',
    signerName: 'Jane Doe',
    signerEmail: 'jane@fintechcorp.com'
  });

  assert.ok(session.sessionId.startsWith('cs_test_dep_'), 'Session ID should start with cs_test_dep_');
  assert.strictEqual(session.amount, 9600, 'Deposit amount must equal locked proposal amount ($9,600)');
  console.log('  ✓ Server-side price lock & checkout session generation passed');
}

module.exports = runPaymentTests;
if (require.main === module) runPaymentTests().catch(console.error);
