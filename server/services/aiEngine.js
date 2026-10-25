/**
 * DealForge AI — Scope Risk & Margin Shield Heuristic Engine
 * Evaluates scope ambiguity, third-party API exposure, timeline compression, and auto-injects protective legal clauses.
 */

// Ambiguity & high-volatility keywords that trigger scope creep in tech agencies
const AMBIGUITY_TRIGGERS = [
  { term: 'real-time', weight: 14, reason: 'Real-time sync/sockets often trigger 3x WebSocket & concurrency debugging overhead.' },
  { term: 'ai', weight: 12, reason: 'AI/LLM prompt tuning requires non-deterministic testing and edge-case handling.' },
  { term: 'machine learning', weight: 15, reason: 'Model training and inference accuracy targets create open-ended scope disputes.' },
  { term: 'sync', weight: 10, reason: 'Bidirectional state sync creates difficult conflict-resolution edge cases.' },
  { term: 'integration', weight: 8, reason: 'Third-party APIs frequently suffer from rate limits, auth bugs, and lack of sandboxes.' },
  { term: 'seamless', weight: 7, reason: 'Vague marketing terms ("seamless") create subjective client acceptance arguments.' },
  { term: 'scalable', weight: 6, reason: 'Unspecified scalability requirements invite arbitrary load testing demands.' },
  { term: 'etc', weight: 15, reason: 'Open-ended placeholders ("etc.") are the number-one cause of unbilled scope creep.' },
  { term: 'and more', weight: 12, reason: 'Vague promises create misaligned client expectations.' },
  { term: 'flexible', weight: 6, reason: 'Unbounded flexibility leads to infinite architecture revisions.' },
  { term: 'custom', weight: 5, reason: 'Custom components take 4x longer than standard off-the-shelf primitives.' }
];

class AIEngine {
  /**
   * Parse unstructured discovery notes into structured deliverables & milestones
   */
  generateStructuredScope(scopeNotes, projectValue, timelineWeeks) {
    const rawLines = scopeNotes
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 3);

    let deliverables = [];

    if (rawLines.length >= 2) {
      const budgetPerItem = Math.round(projectValue / rawLines.length);
      const hoursPerItem = Math.max(15, Math.round((timelineWeeks * 35) / rawLines.length));

      deliverables = rawLines.map((line, idx) => {
        const cleanTitle = line.replace(/^[-*•\d.]+\s*/, '');
        return {
          id: `deliv_${idx + 1}`,
          title: cleanTitle,
          hours: hoursPerItem,
          price: budgetPerItem
        };
      });
    } else {
      deliverables = [
        {
          id: 'deliv_1',
          title: 'Discovery, UI/UX Architecture & Technical Specifications',
          hours: Math.round(timelineWeeks * 8),
          price: Math.round(projectValue * 0.25)
        },
        {
          id: 'deliv_2',
          title: 'Core Application Engine & Data Pipeline Development',
          hours: Math.round(timelineWeeks * 18),
          price: Math.round(projectValue * 0.45)
        },
        {
          id: 'deliv_3',
          title: 'External API Integrations, Webhooks & Verification Suite',
          hours: Math.round(timelineWeeks * 8),
          price: Math.round(projectValue * 0.20)
        },
        {
          id: 'deliv_4',
          title: 'Production Staging, Performance Optimization & Client Handover',
          hours: Math.round(timelineWeeks * 4),
          price: Math.round(projectValue * 0.10)
        }
      ];
    }

    const depositPct = 30;
    const midPct = 40;
    const finalPct = 30;

    const milestones = [
      {
        id: 'ms_1',
        name: `Milestone 1: Project Kickoff & Architecture Sign-off (${depositPct}% Deposit)`,
        percentage: depositPct,
        amount: Math.round(projectValue * (depositPct / 100)),
        status: 'pending'
      },
      {
        id: 'ms_2',
        name: `Milestone 2: Functional Core MVP & Integration Verification (${midPct}%)`,
        percentage: midPct,
        amount: Math.round(projectValue * (midPct / 100)),
        status: 'pending'
      },
      {
        id: 'ms_3',
        name: `Milestone 3: Final Acceptance, Production Deployment & Handover (${finalPct}%)`,
        percentage: finalPct,
        amount: Math.round(projectValue * (finalPct / 100)),
        status: 'pending'
      }
    ];

    return { deliverables, milestones };
  }

  /**
   * Evaluates Scope Creep Risk & Generates Margin Defense Output
   * @param {string} scopeNotes 
   * @param {number} projectValue 
   * @param {number} timelineWeeks 
   */
  analyzeScopeRisk(scopeNotes, projectValue, timelineWeeks) {
    const textLower = (scopeNotes || '').toLowerCase();
    let score = 20; // baseline
    const riskFactors = [];

    // 1. Keyword Ambiguity Detection
    AMBIGUITY_TRIGGERS.forEach(trigger => {
      const regex = new RegExp(`\\b${trigger.term}\\b`, 'i');
      if (regex.test(textLower)) {
        score += trigger.weight;
        riskFactors.push(`Detected trigger "${trigger.term}": ${trigger.reason}`);
      }
    });

    // 2. Timeline Compression Risk
    const velocityDollarsPerWeek = projectValue / Math.max(1, timelineWeeks);
    if (velocityDollarsPerWeek > 6000) {
      score += 18;
      riskFactors.push(`High financial burn rate ($${Math.round(velocityDollarsPerWeek)}/wk) across a compressed ${timelineWeeks}-week timeline.`);
    }

    if (timelineWeeks <= 4 && projectValue >= 20000) {
      score += 15;
      riskFactors.push('Aggressive sub-4-week deadline for enterprise deliverable creates sprint overtime risk.');
    }

    // 3. Brevity / Vagueness Penalty (Short notes = high ambiguity)
    if (scopeNotes.trim().length < 80) {
      score += 22;
      riskFactors.push('Extremely brief discovery notes indicate unstated requirements and implicit client assumptions.');
    }

    // Bound final score between 12 and 98
    const finalScore = Math.min(98, Math.max(12, score));

    // Categorization & Buffer Recommendation
    let riskLevel = 'low';
    let contingencyBufferPct = 10;
    const protectiveClauses = [
      'Work is strictly bounded to agreed deliverables; out-of-scope feature requests billed at standard $150/hr change order rates.',
      'Client feedback cycles must conclude within 3 business days to maintain scheduled milestone delivery dates.'
    ];

    if (finalScore >= 70) {
      riskLevel = 'high';
      contingencyBufferPct = 25;
      protectiveClauses.push(
        'Third-party external API downtimes, undocumented endpoints, or rate limits are expressly excluded from sprint milestone SLA guarantees.',
        'Maximum of two (2) revision rounds per deliverable; subsequent iterations require executed change request approval.',
        'Kickoff deposit is non-refundable once sprint zero architecture is initiated.'
      );
    } else if (finalScore >= 42) {
      riskLevel = 'medium';
      contingencyBufferPct = 18;
      protectiveClauses.push(
        'Third-party integration testing assumes client provides fully functional staging sandbox credentials at kickoff.',
        'Maximum of three (3) revision rounds per deliverable.'
      );
    }

    return {
      riskScore: finalScore,
      riskLevel,
      riskFactors: riskFactors.length ? riskFactors : ['Scope is well-bounded with minimal high-risk dependencies.'],
      contingencyBufferPct,
      protectiveClauses
    };
  }
}

module.exports = new AIEngine();
