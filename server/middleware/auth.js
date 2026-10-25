/**
 * DealForge AI — Authentication & Authorization Middleware
 * Enforces JWT session validation, tenant isolation, and subscription tier guards.
 */

const authService = require('../services/authService');
const db = require('../db/database');

/**
 * Middleware: Requires a valid Bearer token
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication token required.'
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Session has expired or token is invalid. Please sign in again.'
    });
  }

  const user = db.findUserById(decoded.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'Account not found.'
    });
  }

  req.user = user;
  next();
}

/**
 * Middleware: Enforces minimum subscription tier
 * @param {string[]} allowedTiers Array of allowed tiers, e.g. ['pro', 'lifetime']
 */
function requireTier(allowedTiers = ['pro', 'lifetime']) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    }

    if (!allowedTiers.includes(req.user.tier)) {
      return res.status(403).json({
        success: false,
        error: 'UPGRADE_REQUIRED',
        message: `This feature requires a ${allowedTiers.join(' or ')} plan. Please upgrade to unlock.`
      });
    }

    next();
  };
}

/**
 * Middleware: Strict tenant isolation for proposal modifications
 */
function ensureProposalOwnership(req, res, next) {
  const proposalId = req.params.id;
  const proposal = db.findProposalById(proposalId);

  if (!proposal) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: 'Proposal not found.'
    });
  }

  if (proposal.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'You do not have permission to access or modify this proposal.'
    });
  }

  req.proposal = proposal;
  next();
}

module.exports = {
  requireAuth,
  requireTier,
  ensureProposalOwnership
};
