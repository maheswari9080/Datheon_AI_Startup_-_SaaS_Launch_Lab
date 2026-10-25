/**
 * DealForge AI — Scope Risk & AI Engine Unit Tests
 */

const assert = require('assert');
const aiEngine = require('../server/services/aiEngine');

function runAIEngineTests() {
  console.log('--- Running AI Scope & Risk Radar Tests ---');

  // Test 1: Low-risk well-defined scope
  const clearNotes = `
- Complete Figma Design System & responsive wireframes
- Implement standard Node.js REST API with PostgreSQL
- Integrate standard Stripe test checkout flow
- Final deployment to AWS ECS with CloudFront
  `;
  const lowRisk = aiEngine.analyzeScopeRisk(clearNotes, 15000, 6);
  assert.ok(lowRisk.riskScore < 50, 'Clear scope without ambiguity words should score low-to-moderate');
  assert.ok(lowRisk.contingencyBufferPct <= 18, 'Buffer should be 10-18%');
  console.log(`  ✓ Clear scope evaluation passed (Score: ${lowRisk.riskScore}/100, Buffer: +${lowRisk.contingencyBufferPct}%)`);

  // Test 2: High-risk ambiguous scope with keywords
  const vagueNotes = `Build real-time AI sync engine with machine learning predictions and custom integrations etc.`;
  const highRisk = aiEngine.analyzeScopeRisk(vagueNotes, 40000, 3);
  assert.ok(highRisk.riskScore >= 70, 'Scope with real-time, AI, sync, and etc. should trigger HIGH risk');
  assert.strictEqual(highRisk.riskLevel, 'high', 'Risk level should be "high"');
  assert.strictEqual(highRisk.contingencyBufferPct, 25, 'High risk should prescribe 25% buffer');
  assert.ok(highRisk.protectiveClauses.length >= 3, 'Protective clauses should be auto-injected');
  console.log(`  ✓ High-risk ambiguity detection passed (Score: ${highRisk.riskScore}/100, Buffer: +${highRisk.contingencyBufferPct}%)`);

  // Test 3: Structured deliverables generation
  const { deliverables, milestones } = aiEngine.generateStructuredScope(clearNotes, 20000, 4);
  assert.ok(deliverables.length >= 3, 'Deliverables array should be populated');
  assert.strictEqual(milestones.length, 3, 'Default 3-milestone escrow should be generated');
  const totalMilestoneAmt = milestones.reduce((sum, m) => sum + m.amount, 0);
  assert.strictEqual(totalMilestoneAmt, 20000, 'Milestone amounts should sum up to total project value');
  console.log('  ✓ Structured scope and milestone generation passed');
}

module.exports = runAIEngineTests;
if (require.main === module) runAIEngineTests();
