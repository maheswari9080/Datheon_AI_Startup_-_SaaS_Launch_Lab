/**
 * DealForge AI — Database Seeding Script
 * Populates sample founder accounts, realistic proposals, and test transactions.
 */

const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('🌱 Seeding DealForge AI database...');

  const passwordHash = await bcrypt.hash('FounderDemo2026!', 10);

  // 1. Seed Demo Founder User
  const demoUserId = 'usr_demo_founder_9080';
  let demoUser = db.findUserById(demoUserId);

  if (!demoUser) {
    demoUser = db.createUser({
      id: demoUserId,
      name: 'Alex Rivera',
      email: 'founder@dealforge.ai',
      passwordHash,
      agencyName: 'Apex Digital Studio',
      tier: 'pro',
      stripeCustomerId: 'cus_mock_alex_rivera_123',
      proposalsCount: 3,
      createdAt: new Date().toISOString()
    });
    console.log('✅ Created demo founder account: founder@dealforge.ai (PW: FounderDemo2026!)');
  }

  // 2. Seed Realistic Proposals
  const proposalsToSeed = [
    {
      id: 'prop_demo_fintech',
      userId: demoUserId,
      clientName: 'Nesta Financial Inc.',
      clientEmail: 'procurement@nestafinancial.com',
      projectTitle: 'Next-Gen Mobile Wealth Management App',
      projectValue: 32000,
      depositPercentage: 30,
      depositAmount: 9600,
      timelineWeeks: 8,
      scopeNotes: 'Build iOS and Android fintech app with Plaid bank linking, biometric login, and real-time transaction webhooks.',
      deliverables: [
        { title: 'Figma UI/UX & Interactive Design System', hours: 45, price: 6500 },
        { title: 'Cross-Platform React Native Core Architecture', hours: 80, price: 11500 },
        { title: 'Plaid Open Banking Integration & KYC Auth', hours: 55, price: 8000 },
        { title: 'Real-Time Portfolio Analytics Engine', hours: 40, price: 6000 }
      ],
      milestones: [
        { name: 'Milestone 1: Project Kickoff & UI Sign-off', percentage: 30, amount: 9600, status: 'pending' },
        { name: 'Milestone 2: Alpha Build with Plaid Integration', percentage: 40, amount: 12800, status: 'pending' },
        { name: 'Milestone 3: Production App Store Release', percentage: 30, amount: 9600, status: 'pending' }
      ],
      riskScore: 78,
      riskLevel: 'high',
      riskFactors: [
        'Vague specification around Plaid multi-account aggregation error handling',
        'External banking sandbox delays historically exceed 10 business days',
        'Aggressive 8-week delivery timeline creates sprint compression'
      ],
      contingencyBufferPct: 25,
      protectiveClauses: [
        'Client acknowledges third-party bank API downtime is excluded from SLA penalties.',
        'Maximum of 2 revision cycles per design milestone; additional revisions billed at $150/hr.',
        'Deposit is non-refundable once sprint zero architecture is delivered.'
      ],
      status: 'published',
      clientAccessToken: 'token_nesta_demo_access_9080',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'prop_demo_design_sys',
      userId: demoUserId,
      clientName: 'Velox Cloud Platforms',
      clientEmail: 'sarah@veloxcloud.io',
      projectTitle: 'Enterprise Component Design System',
      projectValue: 14500,
      depositPercentage: 35,
      depositAmount: 5075,
      timelineWeeks: 4,
      scopeNotes: 'Standardize 40 React UI components, tokens, and documentation in Storybook.',
      deliverables: [
        { title: 'Design Token Taxonomy & Figma Library', hours: 30, price: 4500 },
        { title: 'Tailwind / React Accessible Component Suite', hours: 50, price: 7500 },
        { title: 'Storybook Docs & Automated Chromatic CI', hours: 20, price: 2500 }
      ],
      milestones: [
        { name: 'Milestone 1: Token Architecture (35% Deposit)', percentage: 35, amount: 5075, status: 'completed' },
        { name: 'Milestone 2: Final Storybook Deployment', percentage: 65, amount: 9425, status: 'pending' }
      ],
      riskScore: 22,
      riskLevel: 'low',
      riskFactors: ['Well-defined scope with minimal third-party dependencies.'],
      contingencyBufferPct: 10,
      protectiveClauses: ['Browser compatibility restricted to modern Evergreen browsers.'],
      status: 'viewed',
      clientAccessToken: 'token_velox_demo_access_9080',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ];

  proposalsToSeed.forEach(p => {
    if (!db.findProposalById(p.id)) {
      db.createProposal(p);
      console.log(`✅ Seeded proposal: ${p.projectTitle} (ID: ${p.id})`);
    }
  });

  console.log('✨ Seeding complete! Database ready for MVP operations.');
}

if (require.main === module) {
  seed().catch(console.error);
}

module.exports = seed;
