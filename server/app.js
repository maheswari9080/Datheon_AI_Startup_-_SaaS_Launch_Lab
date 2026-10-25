/**
 * DealForge AI — Express Application Setup
 * Configures CORS, static serving, routers, webhooks, and error handlers.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const waitlistRouter = require('./routes/waitlist');
const authRouter = require('./routes/auth');
const analyticsRouter = require('./routes/analytics');
const proposalsRouter = require('./routes/proposals');
const paymentsRouter = require('./routes/payments');
const { router: webhooksRouter } = require('./routes/webhooks');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Webhooks must be mounted BEFORE express.json() to preserve raw Buffer for HMAC validation
app.use('/api/webhooks', webhooksRouter);

// Standard JSON and URL-encoded parsers for all standard API endpoints
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from client/ directory
app.use(express.static(path.resolve(__dirname, '../client')));

// Route registrations
app.use('/api/waitlist', waitlistRouter);
app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/payments', paymentsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DealForge AI Core Engine'
  });
});

module.exports = app;
