# Stage 1.2 — Problem Definition, Positioning & Jobs-To-Be-Done

## 1. The One-Sentence Problem Statement

> **"B2B service agencies and software consultancies lose 35% of qualified client deals to slow proposal turnaround (avg 4.2 days) and forfeit up to 25% of their project profits to unbudgeted scope creep caused by vague specifications and unpriced client change requests."**

---

## 2. Ideal Customer Profile (ICP)

### Primary Segment: The Growing Tech Agency & Consultancy
- **Organization Profile:** Boutique software development agencies, digital product studios, UI/UX consultancies, and technical marketing firms.
- **Team Size:** 3 to 25 team members (Founders, Account Executives, Lead Engineers).
- **Geography:** North America, Western Europe, and high-velocity remote hubs (India, LATAM, Eastern Europe).
- **Average Deal Size:** $5,000 to $60,000 per engagement (Fixed-price milestones or hybrid retargeted sprints).
- **Proposal Volume:** 4 to 15 proposals submitted monthly.
- **Key Decision Maker:** Agency Founder / Managing Director / Head of Delivery.
- **Buying Authority:** Total purchasing authority for software tools under $200/month on company credit card without procurement committee approval.
- **Primary Frustration:** "I spend my entire Sunday writing 20-page proposals, and 3 months later the client claims API integration was included in the fixed fee."

---

## 3. Jobs-To-Be-Done (JTBD) Framework

```
WHEN I wrap up an initial discovery call with an eager prospect,
I WANT TO rapidly assemble a legally protective, milestone-scoped proposal with AI-evaluated risk buffers,
SO THAT I can send an interactive proposal within 3 hours, protect my agency's delivery margins, and secure an immediate upfront deposit before the deal cools down.
```

### Three Dimensions of the Job
1. **Functional Job:** Turn raw client requirements and meeting notes into an itemized deliverables scope, identify ambiguous edge cases, generate milestone payment schedules, and collect signatures + deposits.
2. **Emotional Job:** Eradicate the anxiety of "Did I underbid this project?" or "Will this client sue us over ambiguous deliverables?".
3. **Social Job:** Present the agency as ultra-modern, elite, and technologically sophisticated compared to competitors who send static Word documents or 20-page PDF attachments.

---

## 4. Current-Workflow Analysis vs DealForge Workflow

```mermaid
graph TD
    subgraph Current Manual Workflow (Total Time: 14.5 Hours | Lag: 4.2 Days)
        A1[Step 1: 60m Discovery Call] --> A2[Step 2: 3.5 hrs Manual Scoping in Docs]
        A2 --> A3[Step 3: 2 hrs Internal Slack Debate on Pricing]
        A3 --> A4[Step 4: 2.5 hrs PDF Formatting & Legal Copy-Paste]
        A4 --> A5[Step 5: Send PDF via Email & Pray]
        A5 --> A6[Step 6: Chase Follow-ups & Wire Transfers 11 days]
    end
    subgraph DealForge AI Automated Workflow (Total Time: 25 Minutes | Lag: 2 Hours)
        B1[Step 1: Input Discovery Notes/Scope] --> B2[Step 2: AI Scope Risk Scoring & Margin Guard]
        B2 --> B3[Step 3: Generate Interactive Web Proposal with Milestones]
        B3 --> B4[Step 4: Send One-Click Secured Client Link]
        B4 --> B5[Step 5: Client Signs & Pays Stripe Deposit Instantly]
    end
```

---

## 5. Competitor & Substitute Positioning Matrix

| Capability / Attribute | Legacy PDFs (Word/Google Docs) | PandaDoc / Proposify | Bonsai / HoneyBook | DealForge AI |
|:---|:---:|:---:|:---:|:---:|
| **Turnaround Speed** | 3 - 5 Days | 1 - 2 Days | 1 Day | **15 - 30 Minutes** |
| **AI Scope Creep Risk Detection** | ❌ None | ❌ None | ❌ None | **✅ Automated (1-100 Score)** |
| **Ambiguity & Margin Defense** | ❌ Manual | ❌ Manual | ❌ Manual | **✅ Smart Clause Injection** |
| **Interactive Web Viewer** | ❌ Static PDF | ⚠️ Semi-interactive | ⚠️ Basic Web Page | **✅ Modern Glassmorphic Web App** |
| **Embedded Deposit Checkout** | ❌ Manual Invoicing | ⚠️ Add-on Stripe/Square | ⚠️ Generic Stripe Invoicing | **✅ Native Stripe Instant Deposit** |
| **Team Pricing** | Free | $35 - $65 / seat / mo | $25 - $79 / mo | **Free Tier / $49 / $499 Lifetime** |

---

## 6. Unique Value Proposition (UVP)

> **"Close B2B agency deals in 2 hours instead of 4 days — with built-in AI that flags scope creep before you sign and collects upfront deposits in one click."**

---

## 7. Three Falsifiable Demand Hypotheses

1. **Hypothesis 1 (Turnaround Velocity):** Agencies equipped to send proposals within 4 hours of a discovery call will observe a minimum 25% increase in prospect response rates within 48 hours compared to their historical baseline.
   - *Falsification Condition:* Response rates increase by less than 10%, indicating clients prioritize price or brand over submission velocity.
2. **Hypothesis 2 (Scope Risk Utility):** At least 70% of agency founders will adopt AI-suggested risk buffer clauses when their proposal scope complexity score exceeds 60/100.
   - *Falsification Condition:* Less than 30% accept AI risk suggestions, showing founders prefer drafting custom clauses or do not trust automated warnings.
3. **Hypothesis 3 (Deposit Friction Reduction):** Clients provided with an embedded Stripe deposit checkout directly in the proposal viewer will complete payment 3x faster than those receiving a traditional invoice link.
   - *Falsification Condition:* Clients still demand bank ACH / wire transfers or refuse to checkout via card on the proposal page.

---

## 8. Why The Idea Could Fail (Pre-Mortem Analysis)

1. **Risk of AI Hallucinations in Technical Scoping:** If the AI model misinterprets a client requirement and generates an impossible technical estimate, the agency founder will immediately lose trust and churn.
   - *Mitigation:* DealForge implements a "Co-Pilot, Not Autopilot" architecture where the human founder always reviews and confirms items.
2. **High Switching Costs from Existing Document Repositories:** Agencies with 50+ archived templates inside PandaDoc may resist migrating.
   - *Mitigation:* Provide one-click template import and frictionless markdown/PDF copy-paste parsing.
3. **Procurement Restrictions on Credit Card Payments:** Enterprise clients with contracts > $30,000 frequently require 30-day PO invoicing rather than instant credit card deposits.
   - *Mitigation:* Support both Stripe instant deposit checkout and formal downloadable PDF sign-off receipts for procurement offices.

---

## 9. Riskiest Assumption & Cheapest Credible Experiment

- **The Riskiest Assumption:** "Agency owners care enough about scope creep during the sales phase to change how they generate proposals, rather than treating scope creep purely as a post-sale project management issue."
- **The Cheapest Credible Experiment:**
  - Launch the interactive Waitlist Landing Page with an interactive "Scope Creep Risk Calculator" widget.
  - Direct 200 qualified agency founders from LinkedIn and r/agency.
  - *Success Threshold:* ≥ 15% email signup conversion on the waitlist with at least 20 founders requesting early beta access to the risk scoring tool within 7 days.
