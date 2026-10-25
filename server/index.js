/**
 * DealForge AI — Server Entry Point
 */

require('dotenv').config();
const app = require('./app');
const seed = require('./db/seed');

const PORT = process.env.PORT || 4000;

// Ensure database has default seed data
seed()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
============================================================
⚡ DealForge AI Server Operational
============================================================
• Environment:       ${process.env.NODE_ENV || 'development'}
• HTTP Server:       http://localhost:${PORT}
• Waitlist Landing:  http://localhost:${PORT}/
• SaaS MVP Dashboard:http://localhost:${PORT}/app.html
• Interactive Demo:  http://localhost:${PORT}/view.html?id=prop_demo_fintech
============================================================
      `);
    });
  })
  .catch(err => {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  });
