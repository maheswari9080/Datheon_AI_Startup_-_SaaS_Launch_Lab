/**
 * DealForge AI — Analytics Router
 * Ingests client telemetry and serves funnel analytics reports
 */

const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

/**
 * POST /api/analytics/event
 * Log a frontend telemetry event
 */
router.post('/event', (req, res) => {
  try {
    const { eventName, utmSource, utmMedium, utmCampaign, variant, metadata } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    analyticsService.logEvent({
      eventName,
      utmSource,
      utmMedium,
      utmCampaign,
      variant,
      metadata,
      ip,
      userAgent
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/analytics/summary
 * Aggregate conversion dashboard stats
 */
router.get('/summary', (req, res) => {
  try {
    const summary = analyticsService.getConversionSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
