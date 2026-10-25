/**
 * DealForge AI — Express Application Setup
 * Configures CORS, static serving, routers, and global error handling.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const waitlistRouter = require('./routes/waitlist');
const authRouter = require('./routes/auth');
const analyticsRouter = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors());

// Raw body parser support for Stripe webhooks will be mounted specifically in webhooks route
// Standard JSON and URL-encoded parsers:
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from client/ directory
app.use(express.static(path.resolve(__dirname, '../client')));

// Route registrations
app.use('/api/waitlist', waitlistRouter);
app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DealForge AI Core Engine'
  });
});

module.exports = app;
