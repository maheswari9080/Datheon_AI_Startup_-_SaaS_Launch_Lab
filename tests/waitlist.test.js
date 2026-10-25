/**
 * DealForge AI — Waitlist & Deduplication Unit Tests
 */

const assert = require('assert');
const db = require('../server/db/database');

function runWaitlistTests() {
  console.log('--- Running Waitlist & Deduplication Tests ---');

  const testEmail = `founder_${Date.now()}@agencytest.com`;

  // Test 1: Add new entry
  const { entry: entry1, isDuplicate: isDup1 } = db.addToWaitlist({
    name: 'Test Founder',
    email: testEmail,
    teamSize: '6-15',
    preferredTier: 'lifetime'
  });

  assert.strictEqual(isDup1, false, 'First registration should not be duplicate');
  assert.strictEqual(entry1.email, testEmail, 'Email should match');
  assert.ok(entry1.queuePosition > 100, 'Queue position should be assigned');
  assert.ok(entry1.referralCode.startsWith('DF-'), 'Referral code should start with DF-');
  console.log('  ✓ Initial waitlist registration passed');

  // Test 2: Duplicate submission handling
  const { entry: entry2, isDuplicate: isDup2 } = db.addToWaitlist({
    name: 'Test Founder Duplicate',
    email: testEmail,
    teamSize: '6-15',
    preferredTier: 'pro'
  });

  assert.strictEqual(isDup2, true, 'Subsequent registration with same email should be flagged duplicate');
  assert.strictEqual(entry2.id, entry1.id, 'Duplicate registration should return original entry ID');
  console.log('  ✓ Duplicate email handling & idempotency passed');
}

module.exports = runWaitlistTests;
if (require.main === module) runWaitlistTests();
