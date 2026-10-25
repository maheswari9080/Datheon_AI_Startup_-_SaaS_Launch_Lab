/**
 * DealForge AI — Intelligent Scope & Proposal Analysis Engine
 * Converts unstructured client discovery notes into structured deliverables, milestones, and estimates.
 */

class AIEngine {
  /**
   * Parse unstructured discovery notes into structured deliverables
   * @param {string} scopeNotes 
   * @param {number} projectValue 
   * @param {number} timelineWeeks 
   */
  generateStructuredScope(scopeNotes, projectValue, timelineWeeks) {
    const rawLines = scopeNotes
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 3);

    let deliverables = [];

    // If client supplied bullet points, use them as basis
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
      // Default domain-tuned delivery breakdown for B2B tech engagements
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

    // Milestones definition based on industry standard escrow phases
    const depositPct = 30;
    const midPct = 40;
    const finalPct = 30;

    const milestones = [
      {
        id: 'ms_1',
        name: `Milestone 1: Project Kickoff & Sprint Zero Architecture (${depositPct}% Deposit)`,
        percentage: depositPct,
        amount: Math.round(projectValue * (depositPct / 100)),
        status: 'pending'
      },
      {
        id: 'ms_2',
        name: `Milestone 2: Functional Core MVP & Integration Review (${midPct}%)`,
        percentage: midPct,
        amount: Math.round(projectValue * (midPct / 100)),
        status: 'pending'
      },
      {
        id: 'ms_3',
        name: `Milestone 3: Final Acceptance, Security Verification & Launch (${finalPct}%)`,
        percentage: finalPct,
        amount: Math.round(projectValue * (finalPct / 100)),
        status: 'pending'
      }
    ];

    return { deliverables, milestones };
  }
}

module.exports = new AIEngine();
