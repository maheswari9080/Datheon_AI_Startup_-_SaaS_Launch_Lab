/**
 * DealForge AI — Automated Test Suite Runner
 * Runs all unit and integration tests across auth, waitlist, AI engine, and payments.
 */

const runAuthTests = require('./auth.test');
const runWaitlistTests = require('./waitlist.test');
const runAIEngineTests = require('./aiEngine.test');
const runPaymentTests = require('./payments.test');

async function main() {
  console.log(`
============================================================
⚡ DealForge AI — Automated Verification Suite
============================================================
  `);

  const startTime = Date.now();
  let passedCount = 0;

  try {
    await runAuthTests();
    passedCount++;

    runWaitlistTests();
    passedCount++;

    runAIEngineTests();
    passedCount++;

    await runPaymentTests();
    passedCount++;

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`
============================================================
✅ ALL 4 TEST SUITES PASSED (${passedCount}/${passedCount}) in ${duration}s
• Password Hashing & JWT Auth:       PASS
• Waitlist & Deduplication:          PASS
• AI Scope Creep Risk Radar:         PASS
• Stripe Test Mode & HMAC Webhooks:  PASS
============================================================
    `);
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test suite failed with error:', err);
    process.exit(1);
  }
}

main();
