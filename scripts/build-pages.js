/**
 * DealForge AI — GitHub Pages Build & Packaging Script
 * 
 * Generates a clean, self-contained static site bundle in dist/
 * ready for direct deployment via GitHub Actions or the gh-pages branch.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const DOCS_ASSETS_DIR = path.join(ROOT_DIR, 'docs', 'assets');
const IMAGE_PNG = path.join(ROOT_DIR, 'image.png');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function build() {
  console.log('⚡ DealForge AI — Building Static Distribution for GitHub Pages...');

  // 1. Clean dist/
  if (fs.existsSync(DIST_DIR)) {
    console.log('  → Cleaning existing dist/ directory...');
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // 2. Copy client assets (HTML, CSS, JS)
  console.log('  → Packaging client interface, CSS tokens & application scripts...');
  copyDirRecursive(CLIENT_DIR, DIST_DIR);

  // 3. Copy visual assets
  const distDocsAssets = path.join(DIST_DIR, 'docs', 'assets');
  if (fs.existsSync(DOCS_ASSETS_DIR)) {
    console.log('  → Bundling high-res light-theme visual assets (SVGs & PNGs)...');
    copyDirRecursive(DOCS_ASSETS_DIR, distDocsAssets);
  }

  // Also copy docs/assets to assets/ at root of dist for flexible referencing
  const distAssets = path.join(DIST_DIR, 'assets');
  if (fs.existsSync(DOCS_ASSETS_DIR)) {
    copyDirRecursive(DOCS_ASSETS_DIR, distAssets);
  }

  // 4. Copy root image.png
  if (fs.existsSync(IMAGE_PNG)) {
    console.log('  → Copying LinkedIn launch announcement graphic (image.png)...');
    fs.copyFileSync(IMAGE_PNG, path.join(DIST_DIR, 'image.png'));
  }

  // 5. Create .nojekyll (bypasses Jekyll processing on GitHub Pages)
  console.log('  → Ingesting .nojekyll bypass flag...');
  fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

  // 6. Create 404.html single-page fallback
  console.log('  → Generating 404.html fallback router...');
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found — DealForge AI</title>
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/landing.css">
  <script>
    // GitHub Pages SPA Single-Page Router Fallback
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const repoName = 'Datheon_AI_Startup_-_SaaS_Launch_Lab';
    // If accessing subpaths like /app or /view, redirect gracefully
    if (window.location.search.includes('token=')) {
      window.location.replace('view.html' + window.location.search);
    }
  </script>
</head>
<body style="min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: var(--bg-body); color: var(--text-primary); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem;">
  <div class="glass-panel" style="max-width: 520px; padding: 3rem 2rem; border-radius: var(--radius-xl); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border: 1px solid var(--border-subtle); background: var(--bg-surface);">
    <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
    <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.75rem;">Page Not Found</h1>
    <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
      The page you requested could not be found or has moved. Return to DealForge AI to explore the proposal studio or view active deals.
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <a href="index.html" class="btn btn-primary" style="padding: 0.75rem 1.5rem; text-decoration: none; font-weight: 600;">← Return to Home</a>
      <a href="app.html" class="btn btn-secondary" style="padding: 0.75rem 1.5rem; text-decoration: none; font-weight: 600;">Launch Proposal Studio →</a>
    </div>
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml, 'utf8');

  // Verify file counts
  const distFiles = fs.readdirSync(DIST_DIR);
  console.log(`\n✅ Build complete! ${distFiles.length} root items created in dist/:`);
  distFiles.forEach(f => console.log(`   • ${f}`));
  console.log('============================================================\n');
}

build();
