/**
 * DealForge AI — Direct gh-pages Deployment Script
 * 
 * Builds dist/ and publishes the static artifacts directly to the
 * gh-pages branch on GitHub via SSH.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const REMOTE_URL = 'git@github-maheswari:maheswari9080/Datheon_AI_Startup_-_SaaS_Launch_Lab.git';

function deploy() {
  console.log('============================================================');
  console.log('⚡ DealForge AI — Deploying to GitHub Pages (gh-pages Branch)');
  console.log('============================================================\n');

  // 1. Build fresh dist
  execSync('node scripts/build-pages.js', { stdio: 'inherit', cwd: ROOT_DIR });

  const distGit = path.join(DIST_DIR, '.git');
  if (fs.existsSync(distGit)) {
    fs.rmSync(distGit, { recursive: true, force: true });
  }

  // 2. Initialize standalone git in dist
  console.log('  → Initializing isolated git repository in dist/...');
  execSync('git init', { cwd: DIST_DIR, stdio: 'inherit' });
  execSync('git checkout -b gh-pages', { cwd: DIST_DIR, stdio: 'inherit' });
  execSync('git config user.name "maheswari9080"', { cwd: DIST_DIR, stdio: 'inherit' });
  execSync('git config user.email "maheswari9080@users.noreply.github.com"', { cwd: DIST_DIR, stdio: 'inherit' });

  // 3. Stage and commit
  console.log('  → Staging all static assets...');
  execSync('git add -A', { cwd: DIST_DIR, stdio: 'inherit' });
  execSync('git commit -m "deploy: publish static web application to GitHub Pages"', { cwd: DIST_DIR, stdio: 'inherit' });

  // 4. Force push to remote gh-pages branch
  console.log(`  → Pushing to remote ${REMOTE_URL} (branch: gh-pages)...`);
  execSync(`git push -f ${REMOTE_URL} gh-pages`, { cwd: DIST_DIR, stdio: 'inherit' });

  // 5. Clean up dist/.git
  if (fs.existsSync(distGit)) {
    fs.rmSync(distGit, { recursive: true, force: true });
  }

  console.log('\n============================================================');
  console.log('✅ SUCCESS: gh-pages branch deployed to GitHub!');
  console.log('🔗 URL: https://maheswari9080.github.io/Datheon_AI_Startup_-_SaaS_Launch_Lab/');
  console.log('============================================================\n');
}

try {
  deploy();
} catch (err) {
  console.error('❌ Deployment error:', err.message);
  process.exit(1);
}
