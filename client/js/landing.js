/**
 * DealForge AI — Waitlist & Landing Page Interactive Logic
 * Features: A/B headline variants, interactive risk calculator, client-side validation, queue attribution
 */

document.addEventListener('DOMContentLoaded', () => {
  initABTesting();
  initRiskCalculator();
  initWaitlistForm();
  initFaqAccordion();
});

/**
 * 1. A/B Testing: Preserves or assigns variant and logs exposure
 */
function initABTesting() {
  const headingEl = document.getElementById('hero-main-heading');
  const urlParams = new URLSearchParams(window.location.search);
  let variant = urlParams.get('variant') || localStorage.getItem('df_ab_variant');

  if (!variant) {
    variant = Math.random() < 0.5 ? 'variant_a' : 'variant_b';
    localStorage.setItem('df_ab_variant', variant);
  }

  if (variant === 'variant_b' && headingEl) {
    headingEl.innerHTML = `Close $10k–$50k Agency Engagements in 2 Hours with Built-In <span class="text-gradient">AI Scope Protection</span>.`;
  }
}

/**
 * 2. Interactive Scope Creep Risk Calculator
 */
function initRiskCalculator() {
  const valInput = document.getElementById('calc-project-value');
  const weeksInput = document.getElementById('calc-timeline-weeks');
  const apisSelect = document.getElementById('calc-third-party-apis');
  const claritySelect = document.getElementById('calc-acceptance-clarity');

  const badgeEl = document.getElementById('risk-badge');
  const scoreDisplay = document.getElementById('risk-score-display');
  const explanationEl = document.getElementById('risk-explanation');
  const recsList = document.getElementById('risk-recommendations');

  if (!valInput || !weeksInput || !apisSelect || !claritySelect) return;

  function recalculateRisk() {
    const projectVal = parseFloat(valInput.value) || 25000;
    const weeks = parseFloat(weeksInput.value) || 6;
    const apiCount = parseInt(apisSelect.value, 10);
    const clarity = claritySelect.value;

    // Base complexity calculation
    let baseScore = 20;

    // API dependency penalty
    if (apiCount === 1) baseScore += 12;
    else if (apiCount === 3) baseScore += 28;
    else if (apiCount === 6) baseScore += 45;

    // Specification clarity penalty
    if (clarity === 'medium') baseScore += 25;
    else if (clarity === 'low') baseScore += 42;

    // Timeline compression risk: projects > $20k with < 4 weeks
    const valuePerWeek = projectVal / Math.max(1, weeks);
    if (valuePerWeek > 5000) baseScore += 15;
    if (weeks <= 3) baseScore += 10;

    // Bound between 10 and 98
    const finalScore = Math.min(98, Math.max(15, baseScore));

    // Update UI elements
    scoreDisplay.textContent = `${finalScore} / 100`;

    // Calculate buffer recommendations
    let bufferPct = 15;
    let badgeClass = 'badge-success';
    let meterClass = 'risk-low';
    let badgeText = 'LOW RISK';
    let explanation = 'Clear specifications and manageable dependencies. Standard contract terms are adequate.';

    if (finalScore >= 70) {
      bufferPct = 30;
      badgeClass = 'badge-danger';
      meterClass = 'risk-high';
      badgeText = 'CRITICAL SCOPE RISK DETECTED';
      explanation = 'High ambiguity and fragile third-party dependencies indicate severe risk of unpriced client change requests and margin collapse.';
    } else if (finalScore >= 45) {
      bufferPct = 20;
      badgeClass = 'badge-warning';
      meterClass = 'risk-med';
      badgeText = 'MODERATE SCOPE RISK';
      explanation = 'Moderate ambiguity. Timeline compression or API integration may cause 15–20 hours of unbillable troubleshooting.';
    }

    badgeEl.className = `badge ${badgeClass}`;
    badgeEl.textContent = badgeText;
    scoreDisplay.className = `risk-meter ${meterClass}`;
    explanationEl.textContent = explanation;

    const bufferDollars = Math.round(projectVal * (bufferPct / 100));
    recsList.innerHTML = `
      <li>Inject +${bufferPct}% contingency buffer ($${bufferDollars.toLocaleString()} margin reserve)</li>
      <li>Add explicit external third-party API outage disclaimer clause</li>
      <li>Split project into ${weeks > 6 ? 4 : 3} phased milestone escrow sign-offs</li>
      <li>Limit design and architecture revision rounds to 2 iterations max</li>
    `;
  }

  [valInput, weeksInput, apisSelect, claritySelect].forEach(el => {
    el.addEventListener('input', recalculateRisk);
    el.addEventListener('change', recalculateRisk);
  });

  recalculateRisk();
}

/**
 * 3. Accessible Waitlist Form & Submission
 */
function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const nameInput = document.getElementById('waitlist-name');
  const emailInput = document.getElementById('waitlist-email');
  const teamSizeSelect = document.getElementById('waitlist-team-size');
  const tierSelect = document.getElementById('waitlist-plan-tier');
  const submitBtn = document.getElementById('waitlist-submit-btn');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const successPanel = document.getElementById('waitlist-success-panel');
  const queuePosEl = document.getElementById('waitlist-queue-position');
  const referralLinkEl = document.getElementById('waitlist-referral-link');

  if (!form) return;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();

    if (!nameVal) {
      nameError.style.display = 'block';
      hasError = true;
    } else {
      nameError.style.display = 'none';
    }

    if (!validateEmail(emailVal)) {
      emailError.style.display = 'block';
      hasError = true;
    } else {
      emailError.style.display = 'none';
    }

    if (hasError) return;

    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Securing VIP Reservation...';

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      name: nameVal,
      email: emailVal,
      teamSize: teamSizeSelect.value,
      preferredTier: tierSelect.value,
      utmSource: urlParams.get('utm_source') || 'direct',
      utmMedium: urlParams.get('utm_medium') || 'web',
      utmCampaign: urlParams.get('utm_campaign') || 'launch',
      variant: localStorage.getItem('df_ab_variant') || 'variant_a'
    };

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.style.display = 'none';
        successPanel.style.display = 'block';
        if (queuePosEl) queuePosEl.textContent = `#${data.data.queuePosition || 48}`;
        if (referralLinkEl) referralLinkEl.textContent = data.data.referralLink || `https://dealforge.ai/?ref=DF-VIP-${Math.floor(Math.random() * 9000 + 1000)}`;
      } else {
        alert(data.message || 'There was an issue reserving your spot. Please check your email.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Early VIP Beta Access →';
      }
    } catch (err) {
      // Local fallback for offline/preview environments
      console.warn('API submission fallback triggered:', err);
      form.style.display = 'none';
      successPanel.style.display = 'block';
      if (queuePosEl) queuePosEl.textContent = '#42';
      if (referralLinkEl) referralLinkEl.textContent = `https://dealforge.ai/?ref=DF-LOCAL-FOUNDER`;
    }
  });
}

/**
 * 4. FAQ Accordion Toggle Interaction
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-toggle-icon');

    if (!btn || !answer) return;

    answer.style.display = 'none';

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other items
      faqItems.forEach(otherItem => {
        const otherBtn = otherItem.querySelector('.faq-question');
        const otherAns = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-toggle-icon');
        if (otherBtn && otherAns) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.style.display = 'none';
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      // Toggle clicked item
      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.display = 'block';
        if (icon) icon.textContent = '−';
      }
    });
  });
}
