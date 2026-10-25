/**
 * DealForge AI — Authentication & Security Unit Tests
 */

const assert = require('assert');
const authService = require('../server/services/authService');
const db = require('../server/db/database');

async function runAuthTests() {
  console.log('--- Running Authentication & Security Tests ---');

  // Test 1: Bcrypt password hashing
  const rawPw = 'SuperSecret123!';
  const hash = await authService.hashPassword(rawPw);
  assert.ok(hash.startsWith('$2'), 'Bcrypt hash should start with $2');
  const isMatch = await authService.comparePassword(rawPw, hash);
  assert.strictEqual(isMatch, true, 'Valid password should verify against hash');
  const isFalseMatch = await authService.comparePassword('WrongPassword', hash);
  assert.strictEqual(isFalseMatch, false, 'Invalid password should be rejected');
  console.log('  ✓ Password hashing and verification passed');

  // Test 2: JWT generation and verification
  const testUser = { id: 'usr_test_123', email: 'test@studio.com', tier: 'pro' };
  const token = authService.generateToken(testUser);
  assert.ok(typeof token === 'string' && token.length > 20, 'JWT should be generated');

  const decoded = authService.verifyToken(token);
  assert.strictEqual(decoded.userId, testUser.id, 'Decoded user ID should match');
  assert.strictEqual(decoded.tier, 'pro', 'Decoded user tier should match');

  const invalidDecoded = authService.verifyToken('invalid.token.structure');
  assert.strictEqual(invalidDecoded, null, 'Invalid token should return null');
  console.log('  ✓ JWT creation and cryptographic verification passed');
}

module.exports = runAuthTests;
if (require.main === module) runAuthTests().catch(console.error);
