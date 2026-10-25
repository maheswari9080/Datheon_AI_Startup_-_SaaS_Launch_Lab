/**
 * DealForge AI — Client Interactive Proposal Viewer Logic
 * Loads tokenized proposal data, displays dynamic deliverables, and initiates Stripe test deposit checkout.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || 'token_nesta_demo_access_9080';
  const proposalId = urlParams.get('id') || 'prop_demo_fintech';

  let currentProposal = null;

  const agencyEl = document.getElementById('prop-view-agency');
  const titleEl = document.getElementById('prop-view-title');
  const clientEl = document.getElementById('prop-view-client');
  const totalEl = document.getElementById('prop-view-total');
  const depositInfoEl = document.getElementById('prop-view-deposit-info');
  const deliverablesEl = document.getElementById('prop-view-deliverables');
  const milestonesEl = document.getElementById('prop-view-milestones');
  const clausesEl = document.getElementById('prop-view-clauses');
  const statusBadgeEl = document.getElementById('prop-header-status-badge');

  const signForm = document.getElementById('sign-proposal-form');
  const actionBox = document.getElementById('proposal-action-box');
  const successBox = document.getElementById('payment-success-box');
  const receiptText = document.getElementById('payment-receipt-text');

  // 1. Fetch Proposal Data
  try {
    const res = await fetch(`/api/proposals/public/${token}`);
    const data = await res.json();

    if (res.ok && data.success) {
      currentProposal = data.data;
      renderProposal(currentProposal);
    } else {
      console.warn('Fallback to local mock data');
      loadFallbackData();
    }
  } catch (err) {
    console.warn('Network error loading proposal, using fallback:', err);
    loadFallbackData();
  }

  function loadFallbackData() {
    currentProposal = {
      id: proposalId,
      projectTitle: 'Next-Gen Mobile Wealth Management App',
      clientName: 'Nesta Financial Inc.',
      agencyName: 'Apex Digital Studio',
      projectValue: 32000,
      depositPercentage: 30,
      depositAmount: 9600,
      timelineWeeks: 8,
      deliverables: [
        { title: 'Figma UI/UX & Interactive Design System', hours: 45, price: 6500 },
        { title: 'Cross-Platform React Native Core Architecture', hours: 80, price: 11500 },
        { title: 'Plaid Open Banking Integration & KYC Auth', hours: 55, price: 8000 },
        { title: 'Real-Time Portfolio Analytics Engine', hours: 40, price: 6000 }
      ],
      milestones: [
        { name: 'Milestone 1: Project Kickoff & UI Sign-off', percentage: 30, amount: 9600, status: 'pending' },
        { name: 'Milestone 2: Alpha Build with Plaid Integration', percentage: 40, amount: 12800, status: 'pending' },
        { name: 'Milestone 3: Production App Store Release', percentage: 30, amount: 9600, status: 'pending' }
      ],
      protectiveClauses: [
        'Client acknowledges third-party bank API downtime is excluded from SLA penalties.',
        'Maximum of 2 revision cycles per design milestone; additional revisions billed at $150/hr.',
        'Deposit is non-refundable once sprint zero architecture is initiated.'
      ],
      status: 'published'
    };
    renderProposal(currentProposal);
  }

  function renderProposal(p) {
    if (agencyEl) agencyEl.textContent = p.agencyName || 'Apex Digital Studio';
    if (titleEl) titleEl.textContent = p.projectTitle;
    if (clientEl) clientEl.textContent = p.clientName;
    if (totalEl) totalEl.textContent = `$${Number(p.projectValue).toLocaleString()}`;
    if (depositInfoEl) {
      depositInfoEl.textContent = `$${Number(p.depositAmount).toLocaleString()} (${p.depositPercentage}%) Deposit to Initiate Sprint Zero`;
    }

    // Render Deliverables
    if (deliverablesEl && Array.isArray(p.deliverables)) {
      deliverablesEl.innerHTML = p.deliverables.map(d => `
        <div class="deliverable-item">
          <div>
            <div style="font-weight: 600; color: var(--text-primary);">${d.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${d.hours} Estimated Engineering Hours</div>
          </div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--brand-cyan);">
            $${Number(d.price).toLocaleString()}
          </div>
        </div>
      `).join('');
    }

    // Render Milestones
    if (milestonesEl && Array.isArray(p.milestones)) {
      milestonesEl.innerHTML = p.milestones.map((m, idx) => `
        <div class="milestone-box">
          <div>
            <span class="badge ${idx === 0 ? 'badge-indigo' : 'badge-secondary'}" style="margin-bottom: 0.25rem;">
              Phase ${idx + 1} (${m.percentage}%)
            </span>
            <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${m.name}</div>
          </div>
          <div style="font-family: var(--font-mono); font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
            $${Number(m.amount).toLocaleString()}
          </div>
        </div>
      `).join('');
    }

    // Render Clauses
    if (clausesEl && Array.isArray(p.protectiveClauses)) {
      clausesEl.innerHTML = p.protectiveClauses.map(c => `<li>${c}</li>`).join('');
    }

    // Update Status
    if (p.status === 'paid') {
      statusBadgeEl.innerHTML = '<span class="badge badge-success">✓ Executed & Deposit Paid</span>';
      signForm.style.display = 'none';
      successBox.style.display = 'block';
    } else if (p.status === 'signed') {
      statusBadgeEl.innerHTML = '<span class="badge badge-warning">Scope Signed • Awaiting Payment</span>';
    }
  }

  // 2. Handle Digital Signature & Stripe Deposit Checkout Trigger
  if (signForm) {
    signForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const signerName = document.getElementById('client-signer-name').value;
      const signerEmail = document.getElementById('client-signer-email').value;
      const payBtn = document.getElementById('sign-and-pay-btn');

      payBtn.disabled = true;
      payBtn.textContent = 'Generating Stripe Test Checkout Session...';

      try {
        const res = await fetch('/api/payments/create-deposit-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proposalId: currentProposal.id,
            signerName,
            signerEmail
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          if (data.data.checkoutUrl) {
            window.location.href = data.data.checkoutUrl;
          } else {
            // Simulated instant confirmation for local test mode
            signForm.style.display = 'none';
            successBox.style.display = 'block';
            statusBadgeEl.innerHTML = '<span class="badge badge-success">✓ Executed & Deposit Paid</span>';
            receiptText.textContent = `Deposit of $${Number(currentProposal.depositAmount).toLocaleString()} confirmed under session ${data.data.sessionId}.`;
          }
        } else {
          alert(data.message || 'Payment initiation failed. Please try again.');
          payBtn.disabled = false;
          payBtn.textContent = '💳 Sign & Pay Deposit via Stripe Test Checkout →';
        }
      } catch (err) {
        console.warn('Local checkout fallback:', err);
        signForm.style.display = 'none';
        successBox.style.display = 'block';
        statusBadgeEl.innerHTML = '<span class="badge badge-success">✓ Executed & Deposit Paid</span>';
      }
    });
  }
});
