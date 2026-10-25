# Stage 2.2 — Pricing Architecture & Sustainability Model

## 1. Pricing Tier Design & Strategic Rationale

| Plan Tier | Price Point | Target Persona | Strategic Purpose | Hard Limits & Guardrails |
|:---|:---:|:---|:---|:---|
| **FREE (Community)** | **$0 / mo** | Freelancers, pre-revenue agency founders, and students | Product-Led Acquisition engine; establishes market presence and generates viral "Powered by DealForge" footers on live proposals. | Max 2 active proposals/month; standard risk preview; DealForge watermark. |
| **PRO (Agency Growth)** | **$49 / mo** (or $470/yr) | Boutique tech & design agencies (3–25 people) with steady deal flow | Core recurring cash flow engine (MRR). Easily expensed on corporate cards without board sign-off. | Unlimited proposals; full AI Scope Risk Radar; custom domain; instant Stripe checkouts. |
| **FOUNDER LIFETIME** | **$499 one-time** | Early adopter agency owners, mastermind members, and power users | Upfront capital injection to bootstrap development without venture dilution; converts 100 power users into passionate brand advocates. | Strictly limited to first 100 customers; fair-use cap of 50 AI proposals/month; community support. |

---

## 2. Unit Economic Sustainability Model (Per-Customer Cost Breakdown)

To guarantee that the **$499 Lifetime Tier** and **$49/mo Pro Tier** maintain long-term business solvency, we calculated precise infrastructure, AI token inference, and transaction overheads:

### 2.1 Ongoing Variable Operating Costs per Active Agency

| Operational Cost Component | Monthly Cost (Pro User) | Lifetime User Equivalent (Annualized) | Methodology / Source Formula |
|:---|:---:|:---:|:---|
| **Cloud Hosting & Database Storage** | $0.85 / mo | $10.20 / yr | Scaled Node.js instance + persistent storage amortized across active tenant cluster. |
| **AI LLM Inference Cost** | $0.60 / mo | $7.20 / yr | 20 proposals/month @ ~2,500 tokens per proposal via GPT-4o-mini / Claude 3.5 Haiku ($0.15 / 1M input, $0.60 / 1M output) = $0.03 per generated proposal. |
| **Stripe Payment Gateway Processing** | $1.72 (one-time on signup) | $14.77 (one-time) | 2.9% + $0.30 Stripe checkout fee on software plan purchase. |
| **Customer Support Overhead** | $1.50 / mo | $18.00 / yr | Automated onboarding, interactive docs, and asynchronous Discord community support. |
| **TOTAL VARIABLE COST** | **~$2.95 / month** | **~$35.40 / year** | **Highly sustainable cost structure.** |

---

## 3. Margin Safety & Solvency Analysis for Lifetime Tier

### The Solvency Stress Test (100 Founder Lifetime Passes @ $499)
- **Gross Upfront Revenue Collected:** `100 * $499 = $49,900`
- **Initial Stripe Processing Fees (2.9% + $0.30):** `100 * $14.77 = $1,477`
- **Net Upfront Working Capital Secured:** **$48,423**
- **Annual Maintenance Cost per Lifetime User:** `~$35.40`
- **Total Annual Cost for 100 Lifetime Users:** `100 * $35.40 = $3,540 / year`
- **Runway from Lifetime Revenue Alone:** `48,423 / 3,540 =` **13.6 Years of Operating Solvency**!

```
Gross Lifetime Revenue ($49,900)
├── Net Working Capital ($48,423) ──▶ Provides 13.6 Years of Hosting & AI Inference
└── Stripe Fees ($1,477)
```

### Protection Against Runaway AI Costs (Fair Use Policy)
To prevent adversarial abuse (e.g. script-kiddies running 10,000 API calls per day):
1. **Tier Rate Limit:** Lifetime tier includes 50 AI scope generation calls per calendar month (far exceeding normal agency proposal velocity of 8–15 deals).
2. **Hybrid Inference Engine:** Client discovery parsing uses lightweight local heuristic pattern matching for initial draft assembly, reserving LLM token inference exclusively for complex ambiguity detection and risk scoring.

---

## 4. Gross Margin Summary

- **Pro Tier ($49/mo):** `($49 - $2.95) / $49 =` **93.9% Gross Margin**
- **Lifetime Tier ($499 over 3-year horizon):** `($499 - $14.77 - ($35.40 * 3)) / $499 =` **75.7% Net Realized Margin**
- **Blended Software Gross Margin:** **86.2%** (Industry benchmark for tier-1 SaaS is 75%–85%).
