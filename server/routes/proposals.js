/**
 * DealForge AI — Proposals Router
 * Create, retrieve, publish, and inspect proposals with strict tenant authorization
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const aiEngine = require('../services/aiEngine');
const { requireAuth, ensureProposalOwnership } = require('../middleware/auth');

/**
 * GET /api/proposals
 * List all proposals belonging to the authenticated agency user
 */
router.get('/', requireAuth, (req, res) => {
  try {
    const proposals = db.getProposals(req.user.id);
    res.json({ success: true, data: proposals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/proposals
 * Generate an AI-scoped proposal with risk analysis
 */
router.post('/', requireAuth, (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      projectTitle,
      projectValue,
      depositPercentage,
      timelineWeeks,
      scopeNotes
    } = req.body;

    if (!clientName || !clientEmail || !projectTitle || !projectValue) {
      return res.status(400).json({
        success: false,
        message: 'Client name, client email, project title, and contract value are required.'
      });
    }

    const val = parseFloat(projectValue);
    const depPct = parseInt(depositPercentage, 10) || 30;
    const weeks = parseInt(timelineWeeks, 10) || 6;
    const depositAmt = Math.round(val * (depPct / 100));

    // 1. Generate Structured Scope & Milestones via AI Engine
    const { deliverables, milestones } = aiEngine.generateStructuredScope(scopeNotes || '', val, weeks);

    // 2. Run Scope Creep Risk & Margin Shield Analysis
    const riskAnalysis = (typeof aiEngine.analyzeScopeRisk === 'function')
      ? aiEngine.analyzeScopeRisk(scopeNotes || '', val, weeks)
      : {
          riskScore: 45,
          riskLevel: 'medium',
          riskFactors: ['Standard scope with moderate delivery dependencies.'],
          contingencyBufferPct: 15,
          protectiveClauses: ['Revisions limited to 2 rounds per milestone.']
        };

    const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clientAccessToken = `token_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

    const newProposal = {
      id: proposalId,
      userId: req.user.id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      projectTitle: projectTitle.trim(),
      projectValue: val,
      depositPercentage: depPct,
      depositAmount: depositAmt,
      timelineWeeks: weeks,
      scopeNotes: scopeNotes || '',
      deliverables,
      milestones,
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      riskFactors: riskAnalysis.riskFactors,
      contingencyBufferPct: riskAnalysis.contingencyBufferPct,
      protectiveClauses: riskAnalysis.protectiveClauses,
      status: 'published',
      clientAccessToken,
      createdAt: new Date().toISOString()
    };

    db.createProposal(newProposal);

    res.status(201).json({
      success: true,
      message: 'AI proposal generated and protected successfully.',
      data: newProposal
    });
  } catch (err) {
    console.error('Create proposal error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/proposals/:id
 * Retrieve a single proposal (owner only)
 */
router.get('/:id', requireAuth, ensureProposalOwnership, (req, res) => {
  res.json({ success: true, data: req.proposal });
});

/**
 * GET /api/proposals/public/:token
 * Public client endpoint: Read-only access to interactive proposal via secure token
 */
router.get('/public/:token', (req, res) => {
  const token = req.params.token;
  const proposal = db.data.proposals.find(p => p.clientAccessToken === token);

  if (!proposal) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'This proposal link is invalid or has expired.'
    });
  }

  // Update status from 'published' to 'viewed' upon first client open
  if (proposal.status === 'published') {
    db.updateProposal(proposal.id, { status: 'viewed' });
    proposal.status = 'viewed';
  }

  // Find agency owner info for branding
  const agencyUser = db.findUserById(proposal.userId);

  res.json({
    success: true,
    data: {
      id: proposal.id,
      projectTitle: proposal.projectTitle,
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      agencyName: agencyUser ? agencyUser.agencyName : 'Apex Digital Studio',
      projectValue: proposal.projectValue,
      depositPercentage: proposal.depositPercentage,
      depositAmount: proposal.depositAmount,
      timelineWeeks: proposal.timelineWeeks,
      deliverables: proposal.deliverables,
      milestones: proposal.milestones,
      protectiveClauses: proposal.protectiveClauses,
      status: proposal.status,
      signedAt: proposal.signedAt,
      signerName: proposal.signerName,
      paidAt: proposal.paidAt,
      createdAt: proposal.createdAt
    }
  });
});

module.exports = router;
