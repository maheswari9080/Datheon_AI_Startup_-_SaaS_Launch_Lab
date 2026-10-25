/**
 * DealForge AI — Dashboard Application Logic
 * Session management, proposal pipeline rendering, and proposal creation wizard
 */

document.addEventListener('DOMContentLoaded', () => {
  let authToken = localStorage.getItem('df_auth_token');
  let currentUser = null;
  let allProposals = [];
  let currentFilter = 'all';

  const authOverlay = document.getElementById('auth-modal-overlay');
  const authForm = document.getElementById('auth-form');
  const authToggleBtn = document.getElementById('auth-toggle-btn');
  const authTitle = document.getElementById('auth-title');
  const authNameGroup = document.getElementById('auth-name-group');
  const authSubmitBtn = document.getElementById('auth-submit-btn');

  const proposalsTbody = document.getElementById('proposals-tbody');
  const emptyState = document.getElementById('proposals-empty-state');
  const proposalsCountLabel = document.getElementById('proposals-count-label');

  const newPropModal = document.getElementById('new-proposal-modal');
  const openNewPropBtn = document.getElementById('open-new-proposal-btn');
  const closePropModalBtn = document.getElementById('close-proposal-modal');
  const cancelPropBtn = document.getElementById('cancel-proposal-btn');
  const createPropForm = document.getElementById('create-proposal-form');

  const upgradeModal = document.getElementById('upgrade-modal');
  const upgradeBtn = document.getElementById('upgrade-plan-btn');
  const closeUpgradeBtn = document.getElementById('close-upgrade-modal');
  const checkoutProBtn = document.getElementById('checkout-pro-btn');
  const checkoutLifetimeBtn = document.getElementById('checkout-lifetime-btn');

  const logoutBtn = document.getElementById('logout-btn');

  let isRegisterMode = false;

  // 1. Toast Notification Helper
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '⚡';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 2. Authentication Flow
  async function checkAuth() {
    if (!authToken) {
      authOverlay.style.display = 'flex';
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        currentUser = data.user;
        authOverlay.style.display = 'none';
        updateSidebarUser();
        fetchProposals();
      } else {
        localStorage.removeItem('df_auth_token');
        authToken = null;
        authOverlay.style.display = 'flex';
      }
    } catch (err) {
      console.warn('Auth verification fallback:', err);
      authOverlay.style.display = 'none';
      currentUser = { name: 'Alex Rivera', email: 'founder@dealforge.ai', tier: 'pro', agencyName: 'Apex Digital Studio' };
      updateSidebarUser();
      fetchProposals();
    }
  }

  function updateSidebarUser() {
    if (!currentUser) return;
    const emailEl = document.getElementById('sidebar-user-email');
    const agencyEl = document.getElementById('sidebar-user-agency');
    const tierBadge = document.getElementById('sidebar-tier-badge');

    if (emailEl) emailEl.textContent = currentUser.email;
    if (agencyEl) agencyEl.textContent = currentUser.agencyName || 'Digital Studio';
    if (tierBadge) tierBadge.textContent = `${(currentUser.tier || 'pro').toUpperCase()} STUDIO PLAN`;
  }

  authToggleBtn.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) {
      authTitle.innerHTML = `Create Agency <span class="text-gradient">Account</span>`;
      authNameGroup.style.display = 'block';
      authSubmitBtn.textContent = 'Register Agency Account →';
      document.getElementById('auth-toggle-prompt').textContent = 'Already have an account?';
      authToggleBtn.textContent = 'Sign In';
    } else {
      authTitle.innerHTML = `Sign in to <span class="text-gradient">DealForge AI</span>`;
      authNameGroup.style.display = 'none';
      authSubmitBtn.textContent = 'Sign In →';
      document.getElementById('auth-toggle-prompt').textContent = "Don't have an agency account?";
      authToggleBtn.textContent = 'Create Free Account';
    }
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value;

    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegisterMode ? { name, email, password, agencyName: `${name}'s Agency` } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        authToken = data.token;
        localStorage.setItem('df_auth_token', authToken);
        currentUser = data.user;
        authOverlay.style.display = 'none';
        updateSidebarUser();
        fetchProposals();
        showToast(`Welcome ${currentUser.name}!`, 'success');
      } else {
        showToast(data.message || 'Authentication failed', 'warning');
      }
    } catch (err) {
      showToast('Network error during authentication', 'warning');
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('df_auth_token');
    window.location.reload();
  });

  // 3. Proposals Management
  async function fetchProposals() {
    try {
      const res = await fetch('/api/proposals', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        allProposals = data.data;
        renderProposals();
        updateKpis();
      }
    } catch (err) {
      console.warn('Fetch proposals error:', err);
    }
  }

  function updateKpis() {
    let pipelineTotal = 0;
    let depositsTotal = 0;
    let riskSum = 0;

    allProposals.forEach(p => {
      pipelineTotal += parseFloat(p.projectValue) || 0;
      if (p.status === 'paid') {
        depositsTotal += parseFloat(p.depositAmount) || 0;
      }
      riskSum += parseInt(p.riskScore, 10) || 0;
    });

    const avgRisk = allProposals.length ? Math.round(riskSum / allProposals.length) : 0;

    const pipelineEl = document.getElementById('kpi-pipeline-val');
    const depositsEl = document.getElementById('kpi-deposits-val');
    const riskAvgEl = document.getElementById('kpi-risk-avg');

    if (pipelineEl) pipelineEl.textContent = `$${pipelineTotal.toLocaleString()}`;
    if (depositsEl) depositsEl.textContent = `$${depositsTotal.toLocaleString()}`;
    if (riskAvgEl) riskAvgEl.textContent = `${avgRisk} / 100`;
  }

  function renderProposals() {
    const filtered = allProposals.filter(p => {
      if (currentFilter === 'all') return true;
      return p.status === currentFilter;
    });

    proposalsCountLabel.textContent = `Showing ${filtered.length} of ${allProposals.length} proposals`;

    if (filtered.length === 0) {
      proposalsTbody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    proposalsTbody.innerHTML = filtered.map(p => {
      let riskBadgeClass = 'badge-success';
      if (p.riskScore >= 70) riskBadgeClass = 'badge-danger';
      else if (p.riskScore >= 45) riskBadgeClass = 'badge-warning';

      let statusBadge = '<span class="badge badge-indigo">Draft</span>';
      if (p.status === 'published') statusBadge = '<span class="badge badge-indigo">Published</span>';
      else if (p.status === 'viewed') statusBadge = '<span class="badge" style="background: rgba(6,182,212,0.15); color: #06b6d4; border: 1px solid rgba(6,182,212,0.3);">Viewed</span>';
      else if (p.status === 'signed') statusBadge = '<span class="badge badge-warning">Signed</span>';
      else if (p.status === 'paid') statusBadge = '<span class="badge badge-success">Deposit Paid</span>';

      const viewUrl = `view.html?id=${p.id}&token=${p.clientAccessToken}`;

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${p.projectTitle}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${p.clientName} (${p.clientEmail})</div>
          </td>
          <td style="font-family: var(--font-mono); font-weight: 600;">$${Number(p.projectValue).toLocaleString()}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; color: var(--color-success);">$${Number(p.depositAmount).toLocaleString()} (${p.depositPercentage}%)</td>
          <td>
            <span class="badge ${riskBadgeClass}">${p.riskScore}/100</span>
          </td>
          <td>${statusBadge}</td>
          <td>
            <a href="${viewUrl}" target="_blank" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
              Preview Link ↗
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Filter tab buttons
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderProposals();
    });
  });

  // 4. Modal Dialog Controls
  openNewPropBtn.addEventListener('click', () => newPropModal.style.display = 'flex');
  closePropModalBtn.addEventListener('click', () => newPropModal.style.display = 'none');
  cancelPropBtn.addEventListener('click', () => newPropModal.style.display = 'none');

  upgradeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    upgradeModal.style.display = 'flex';
  });
  closeUpgradeBtn.addEventListener('click', () => upgradeModal.style.display = 'none');

  // 5. Create AI Proposal Form Submit
  createPropForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('generate-proposal-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Running AI Scope Analysis...';

    const payload = {
      clientName: document.getElementById('prop-client-name').value,
      clientEmail: document.getElementById('prop-client-email').value,
      projectTitle: document.getElementById('prop-project-title').value,
      projectValue: parseFloat(document.getElementById('prop-project-value').value),
      depositPercentage: parseInt(document.getElementById('prop-deposit-pct').value, 10),
      timelineWeeks: parseInt(document.getElementById('prop-timeline').value, 10),
      scopeNotes: document.getElementById('prop-scope-notes').value
    };

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('AI Proposal successfully generated & protected!', 'success');
        newPropModal.style.display = 'none';
        createPropForm.reset();
        fetchProposals();
      } else {
        showToast(data.message || 'Failed to generate proposal', 'warning');
      }
    } catch (err) {
      showToast('Error connecting to proposal engine', 'warning');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Analyze & Generate Proposal →';
    }
  });

  // 6. Test Stripe Plan Checkouts
  async function triggerPlanCheckout(planType) {
    try {
      const res = await fetch('/api/payments/create-subscription-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ planType })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        upgradeModal.style.display = 'none';
        showToast(`Stripe Test Checkout Session Created for ${planType.toUpperCase()}`, 'success');
        if (data.data.checkoutUrl) {
          window.location.href = data.data.checkoutUrl;
        }
      } else {
        showToast(data.message || 'Payment simulation failed', 'warning');
      }
    } catch (err) {
      showToast('Payment engine offline', 'warning');
    }
  }

  checkoutProBtn.addEventListener('click', () => triggerPlanCheckout('pro'));
  checkoutLifetimeBtn.addEventListener('click', () => triggerPlanCheckout('lifetime'));

  // Init
  checkAuth();
});
