/**
 * DealForge AI — Client Telemetry & UTM Attribution Tracker
 * Lightweight zero-cookie telemetry dispatcher
 */

(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source') || 'direct';
  const utmMedium = urlParams.get('utm_medium') || 'none';
  const utmCampaign = urlParams.get('utm_campaign') || 'organic';
  const variant = localStorage.getItem('df_ab_variant') || 'variant_a';

  function trackEvent(eventName, metadata = {}) {
    try {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          utmSource,
          utmMedium,
          utmCampaign,
          variant,
          metadata
        }),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }

  // 1. Fire Page View
  trackEvent('page_view', { path: window.location.pathname });

  // 2. Track Calculator Interaction
  document.addEventListener('DOMContentLoaded', () => {
    const calcInputs = document.querySelectorAll('#calc-widget-container input, #calc-widget-container select');
    let hasInteractedWithCalc = false;

    calcInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!hasInteractedWithCalc) {
          hasInteractedWithCalc = true;
          trackEvent('calc_interaction');
        }
      });
    });

    // 3. Track Pricing Clicks
    const pricingBtns = document.querySelectorAll('#pricing .btn');
    pricingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        trackEvent('pricing_cta_click', { card: btn.closest('.pricing-card')?.id });
      });
    });
  });

  window.DF_Analytics = { trackEvent };
})();
