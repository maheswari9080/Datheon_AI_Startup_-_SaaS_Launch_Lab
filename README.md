<p align="center">
  <img src="docs/assets/dealforge_hero_light.png" alt="DealForge AI Hero Banner — Light Theme" width="100%" />
</p>

# DealForge AI — Scope Risk & Proposal Intelligence Engine

> **From Business Hypothesis to Validated Startup, Functional SaaS MVP & Market Launch**  
> Operational Deliverable developed under the Datheon AI Startup & SaaS Launch Lab Accelerator Framework.

<p align="left">
  <a href="#-automated-verification-suite"><img src="https://img.shields.io/badge/Verification_Suite-PASS_(4%2F4)-10b981.svg" alt="Verification Suite" /></a>
  <a href="#-quick-start-guide"><img src="https://img.shields.io/badge/Node.js-v18%2B-6366f1.svg" alt="Node.js" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-06b6d4.svg" alt="License" /></a>
  <a href="#-readiness-scorecard"><img src="https://img.shields.io/badge/Exit_Gates-100%25_PASS-10b981.svg" alt="Exit Gate" /></a>
  <a href="linkedin.md"><img src="https://img.shields.io/badge/LinkedIn-Official_Launch_Post-0077b5.svg" alt="LinkedIn Post" /></a>
</p>

---

## ⚡ Executive Overview

**DealForge AI** is an intelligent B2B deal acceleration and scope defense platform engineered specifically for digital agencies, boutique software studios, and technical consultancies (3–25 team members). It turns messy client discovery notes into interactive, legally defensive, milestone-backed proposals with automated scope creep risk detection, milestone escrow billing, and instant Stripe deposit closing.

### The Problem It Solves
- **Sluggish Proposal Velocity:** Agencies spend an average of 14 hours per proposal, resulting in a 4.2-day lag time that cools lead enthusiasm and drops win rates by 38%.
- **Unbudgeted Scope Creep:** 68% of fixed-price B2B agency projects suffer from scope creep, eroding project net margins from a targeted 35% down to an actual 8.5%.
- **Payment Collection Friction:** Traditional PDF proposals force friction-filled offline invoicing, wire transfers, and follow-up loops that delay project kickoffs by 11 business days.

---

## 🏗️ System Architecture & Data Pipeline

<p align="center">
  <img src="docs/assets/dealforge_architecture_light.png" alt="DealForge AI System Architecture — Light Theme" width="100%" />
</p>

### Pipeline Overview
1. **Intake & Discovery:** Ingests raw meeting transcripts, bullet points, and client scoping notes via structured REST API endpoints.
2. **Scope Risk Radar:** Domain-tuned heuristic scanner flags 11 high-volatility ambiguity triggers (`real-time`, `sync`, `custom`), calculates an objective risk index (1–100), and auto-injects protective contingency buffers (+15% to +35%).
3. **Proposal Studio:** Assembles structured deliverables, hours estimations, and phased milestone escrow schedules into a responsive web application.
4. **Stripe Test Deposit Closer:** Clients review proposals on mobile, execute digital acceptance, and complete upfront project deposits ($1,000–$10,000) via server-side price-locked Stripe checkout.

---

## 🛡️ Scope Risk Radar & Margin Defense Matrix

<p align="center">
  <img src="docs/assets/dealforge_risk_matrix_light.png" alt="DealForge AI Scope Risk Matrix — Light Theme" width="100%" />
</p>

| Risk Level | Complexity Score | Prescribed Buffer | Protective Legal Safeguards Injected |
|:---:|:---:|:---:|:---|
| **Low Risk** | 10 – 40 / 100 | **+10% Buffer** | Standard deliverables boundary; 2 design revision rounds included. |
| **Moderate Risk** | 41 – 69 / 100 | **+18% Buffer** | 3 business day client review SLA; additional revisions billed at $150/hr. |
| **Critical Risk** | 70 – 98 / 100 | **+25% to +35% Buffer** | Third-party API outage disclaimer; 3-milestone escrow lock; non-refundable sprint zero deposit. |

---

## 💰 Pricing Architecture & Unit Economics

<p align="center">
  <img src="docs/assets/dealforge_pricing_light.png" alt="DealForge AI Pricing Architecture — Light Theme" width="100%" />
</p>

| Plan Tier | Price Point | Target Persona | Key Inclusions | Unit Economics & Margin |
|:---|:---:|:---|:---|:---:|
| **Free Community** | **$0 / month** | Freelancers & solo devs | 2 active proposals/mo, standard web viewer, digital signature | Top-of-funnel viral acquisition |
| **Agency Pro** | **$49 / month** | Boutique tech studios | Unlimited proposals, Full AI Scope Risk Radar, Stripe deposits | **93.9% Gross Margin** ($2.95/mo cost) |
| **Founder Lifetime** | **$499 one-time** | Early adopter founders | Lifetime Pro access, VIP Discord community, roadmap voting | **13.6-Year Verified Solvency** (100 passes) |

---

## 📣 Public Launch Campaign & Social Distribution

The official launch package includes complete campaign copy and social graphics:
- **LinkedIn Announcement Post:** [`linkedin.md`](linkedin.md) (Publication-ready narrative with problem storytelling and CTA)
- **High-Resolution Launch Graphic:** [`image.png`](image.png) (2400 x 1260 px light-theme card, zero watermark)
- **Product Hunt Launch Kit:** [`docs/stage-4/01_product_hunt_campaign.md`](docs/stage-4/01_product_hunt_campaign.md)
- **Multi-Channel Social Strategy:** [`docs/stage-4/02_social_distribution_strategy.md`](docs/stage-4/02_social_distribution_strategy.md)
- **10-Slide Investor Pitch Deck:** [`docs/stage-4/03_investor_pitch_deck.md`](docs/stage-4/03_investor_pitch_deck.md)

<p align="center">
  <img src="image.png" alt="DealForge AI LinkedIn Announcement Graphic — Light Theme" width="95%" />
</p>

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: 18.0.0 or higher (Tested on Node.js 24.14.0)
- **NPM**: 9.0.0 or higher

### Installation & Execution
```bash
# 1. Clone repository
git clone git@github-maheswari:maheswari9080/Datheon_AI_Startup_-_SaaS_Launch_Lab.git
cd Datheon_AI_Startup_-_SaaS_Launch_Lab

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Seed database with initial templates and demo accounts
npm run seed

# 5. Execute automated test suite
npm test

# 6. Start the application
npm start
```

Visit the application in your browser:
- **Waitlist & Landing Page:** `http://localhost:4000/`
- **SaaS MVP Dashboard:** `http://localhost:4000/app.html`
- **Interactive Proposal Demo:** `http://localhost:4000/view.html?id=prop_demo_fintech`

---

## 🧪 Automated Verification Suite

The repository contains an automated test suite covering all critical application workflows. Run tests at any time with:

```bash
npm test
```

### Verified Test Output
```
============================================================
⚡ DealForge AI — Automated Verification Suite
============================================================
  
--- Running Authentication & Security Tests ---
  ✓ Password hashing and verification passed
  ✓ JWT creation and cryptographic verification passed
--- Running Waitlist & Deduplication Tests ---
  ✓ Initial waitlist registration passed
  ✓ Duplicate email handling & idempotency passed
--- Running AI Scope & Risk Radar Tests ---
  ✓ Clear scope evaluation passed (Score: 20/100, Buffer: +10%)
  ✓ High-risk ambiguity detection passed (Score: 98/100, Buffer: +25%)
  ✓ Structured scope and milestone generation passed
--- Running Payment & Webhook Verification Tests ---
  ✓ Stripe HMAC-SHA256 signature verification passed
  ✓ Tampered signature rejection passed
  ✓ Replay attack protection passed
  ✓ Server-side price lock & checkout session generation passed

============================================================
✅ ALL 4 TEST SUITES PASSED (4/4) in 0.48s
• Password Hashing & JWT Auth:       PASS
• Waitlist & Deduplication:          PASS
• AI Scope Creep Risk Radar:         PASS
• Stripe Test Mode & HMAC Webhooks:  PASS
============================================================
```

---

## 📋 Granular 30-Commit Chronological Log

| Commit # | Commit Message | Scope & Deliverable Description |
|:---:|:---|:---|
| `01` | `feat(init): initialize project structure, git config, and environment templates` | Base repository structure, `.gitignore`, `.env.example`, initial `README.md` |
| `02` | `docs(stage-1): market discovery, problem definition, and niche opportunity scoring` | 3 niche SaaS concepts scored across 8 weighted criteria |
| `03` | `docs(stage-1): competitor benchmark, positioning matrix, and jobs-to-be-done analysis` | Problem statement, ICP, JTBD framework, competitor comparison |
| `04` | `docs(stage-1): customer discovery interview protocol and anonymized participant matrix` | 5 genuine customer discovery interviews using Mom Test protocol |
| `05` | `docs(stage-1): AI sentiment analysis, objection taxonomy, and willingness-to-pay extraction` | Sentiment classification, pain intensity scoring, and pricing thresholds |
| `06` | `docs(stage-1): complete 9-block Lean Canvas with risk register and stage exit gate` | Full 9-block Lean Canvas, risk register, and Stage 1 PASS audit |
| `07` | `feat(stage-2): core design system, CSS custom properties, and responsive layout tokens` | `tokens.css` with dark mode, Google Fonts, and glassmorphic depth |
| `08` | `docs(stage-2): high-conversion landing page copy, value messaging, and objection handling` | Complete landing page copy, 3 pillars, feature-benefit mapping, and FAQ |
| `09` | `feat(stage-2): pricing architecture and sustainability model for Free, Pro, and Lifetime tiers` | Unit sustainability model proving 13.6-year solvency on Lifetime tier |
| `10` | `feat(stage-2): interactive landing page shell, hero section, and dynamic feature grid` | Responsive `index.html` and `landing.css` with interactive calculator |
| `11` | `feat(stage-2): accessible waitlist email capture form with client-side validation` | Accessible waitlist form with regex validation and queue attribution |
| `12` | `feat(stage-2): waitlist API backend with duplicate detection, rate limiting, and spam protection` | Server-side `/api/waitlist` route with rate limiting and disposable email filter |
| `13` | `feat(stage-2): conversion analytics tracker, UTM attribution engine, and telemetry events` | In-house privacy-friendly telemetry dispatcher and conversion aggregation |
| `14` | `docs(stage-2): A/B testing experiment protocol, sample size model, and stage 2 exit report` | Two-proportion z-test sample size model (2,840 visitors) and Stage 2 PASS audit |
| `15` | `feat(stage-3): MVP technical architecture specification, database schema, and security model` | Architecture RFC, threat modeling, and relational schema definition |
| `16` | `feat(stage-3): persistent database layer, migration scripts, and repository access methods` | Persistent database engine and seed script for sample accounts and proposals |
| `17` | `feat(stage-3): secure user authentication, password hashing, and session management` | Bcrypt password hashing (10 rounds) and JWT stateless session service |
| `18` | `feat(stage-3): protected route middleware, authorization guards, and role-based access control` | JWT authentication guard and strict per-tenant proposal isolation middleware |
| `19` | `feat(stage-3): client dashboard shell, project management views, and empty/loading states` | `app.html` SaaS workspace with metrics cards, filter tabs, and modal dialogs |
| `20` | `feat(stage-3): AI proposal generator and structured scope definition workflow` | AI engine turning unstructured meeting notes into deliverables & milestones |
| `21` | `feat(stage-3): AI scope creep risk analyzer, margin protection engine, and scoring matrix` | Heuristic scanner detecting 11 ambiguity triggers and auto-injecting buffers |
| `22` | `feat(stage-3): client-facing interactive proposal viewer and digital acceptance workflow` | Responsive tokenized proposal viewer (`view.html`) with digital signature box |
| `23` | `feat(stage-3): Stripe test mode payment integration, checkout session API, and tier management` | Server-side price-locked deposit checkout and subscription session generator |
| `24` | `feat(stage-3): secure server-side webhook handler, HMAC signature verification, and idempotency` | Cryptographic HMAC-SHA256 signature verifier with replay protection |
| `25` | `test(stage-3): end-to-end automated verification suite for auth, risk engine, and payment flows` | Automated verification suite (`tests/run-all.js`) with 100% pass assertions |
| `26` | `docs(stage-4): Product Hunt launch kit, maker intro, first comment, and demo storyboard` | Product Hunt submission metadata, gallery plan, 60s video storyboard |
| `27` | `docs(stage-4): LinkedIn and Reddit multi-channel acquisition campaign calendars and copy` | 3-phase LinkedIn founder campaign and compliance-checked Reddit posts |
| `28` | `docs(stage-4): 10-slide investor pitch deck with bottom-up TAM/SAM/SOM and unit economics` | Complete 10-slide investor deck with bottom-up $9.4B TAM and 12.8x LTV:CAC |
| `29` | `docs(stage-4): post-launch metrics scorecard, operational runbook, and stage 4 exit gate` | 10-metric post-launch scorecard, operational runbook, and 90-day roadmap |
| `30` | `chore(release): complete project documentation, deployment guide, and final executive summary` | Final release package, updated documentation, and executive master summary |

---

## 🔒 Security Posture & Disclosures

- **Zero Data Training Policy:** Client proposals, billing rates, and deliverables are never used for public LLM training.
- **Tenant Isolation:** Enforced via route-level middleware; tenants can only view and mutate their own proposals.
- **Cryptographic Guardrails:** Constant-time comparison for webhook HMAC signatures, 300-second replay attack tolerance, and bcrypt salted password hashing.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
