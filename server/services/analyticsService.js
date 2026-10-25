/**
 * DealForge AI — Analytics & Telemetry Service
 * Processes conversion funnel events, UTM attribution, and experiment telemetry.
 */

const db = require('../db/database');

class AnalyticsService {
  /**
   * Log an incoming telemetry event
   * @param {Object} eventData 
   */
  logEvent(eventData) {
    const validEvent = {
      eventName: eventData.eventName || 'page_view',
      utmSource: eventData.utmSource || 'direct',
      utmMedium: eventData.utmMedium || 'none',
      utmCampaign: eventData.utmCampaign || 'organic',
      variant: eventData.variant || 'variant_a',
      metadata: eventData.metadata || {},
      ip: eventData.ip || 'anonymous',
      userAgent: eventData.userAgent || 'unknown'
    };

    db.logAnalyticsEvent(validEvent);
    return validEvent;
  }

  /**
   * Aggregate conversion metrics across variants and channels
   */
  getConversionSummary() {
    const events = db.data.analyticsEvents || [];
    const waitlist = db.getWaitlist();

    const summary = {
      totalPageViews: 0,
      totalCalculatorInteractions: 0,
      totalWaitlistSignups: waitlist.length,
      conversionRate: 0,
      variants: {
        variant_a: { views: 0, signups: 0, conversionRate: 0 },
        variant_b: { views: 0, signups: 0, conversionRate: 0 }
      },
      channels: {}
    };

    events.forEach(e => {
      if (e.eventName === 'page_view') {
        summary.totalPageViews++;
        const v = e.variant === 'variant_b' ? 'variant_b' : 'variant_a';
        summary.variants[v].views++;

        const ch = e.utmSource || 'direct';
        summary.channels[ch] = (summary.channels[ch] || 0) + 1;
      }
      if (e.eventName === 'calc_interaction') {
        summary.totalCalculatorInteractions++;
      }
    });

    waitlist.forEach(w => {
      const v = w.variant === 'variant_b' ? 'variant_b' : 'variant_a';
      summary.variants[v].signups++;
    });

    // Compute conversion rates
    if (summary.totalPageViews > 0) {
      summary.conversionRate = Number(((summary.totalWaitlistSignups / summary.totalPageViews) * 100).toFixed(2));
    }

    ['variant_a', 'variant_b'].forEach(v => {
      if (summary.variants[v].views > 0) {
        summary.variants[v].conversionRate = Number(
          ((summary.variants[v].signups / summary.variants[v].views) * 100).toFixed(2)
        );
      }
    });

    return summary;
  }
}

module.exports = new AnalyticsService();
