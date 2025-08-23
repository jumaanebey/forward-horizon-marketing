// Advanced analytics and conversion tracking system
// Tracks user behavior, lead sources, and conversion funnel

interface AnalyticsEvent {
  id: string;
  sessionId: string;
  leadId?: string;
  eventType: 'page_view' | 'form_start' | 'form_submit' | 'cta_click' | 'phone_call' | 'email_click' | 'conversion';
  eventName: string;
  page: string;
  source: string;
  campaign?: string;
  medium?: string;
  content?: string;
  value?: number;
  properties: Record<string, any>;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
  referrer?: string;
}

interface ConversionFunnel {
  sessionId: string;
  leadId?: string;
  source: string;
  campaign?: string;
  landingPage: string;
  steps: {
    page_view: Date | null;
    form_start: Date | null;
    form_submit: Date | null;
    conversion: Date | null;
  };
  dropOffPoint?: string;
  conversionTime?: number; // Minutes from first visit to conversion
  riskScore?: number;
  program?: string;
}

// Session storage for analytics
let analyticsEvents: AnalyticsEvent[] = [];
let conversionFunnels: Map<string, ConversionFunnel> = new Map();

// Generate session ID
export function getSessionId(): string {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('fh_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('fh_session_id', sessionId);
    }
    return sessionId;
  }
  return crypto.randomUUID();
}

// Track analytics event
export function trackEvent(
  eventType: AnalyticsEvent['eventType'],
  eventName: string,
  properties: Record<string, any> = {}
) {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();
  const urlParams = new URLSearchParams(window.location.search);
  
  const event: AnalyticsEvent = {
    id: crypto.randomUUID(),
    sessionId,
    leadId: properties.leadId,
    eventType,
    eventName,
    page: window.location.pathname,
    source: urlParams.get('utm_source') || properties.source || 'direct',
    campaign: urlParams.get('utm_campaign') || properties.campaign,
    medium: urlParams.get('utm_medium') || properties.medium,
    content: urlParams.get('utm_content') || properties.content,
    value: properties.value,
    properties,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  };

  analyticsEvents.push(event);
  updateConversionFunnel(event);

  // Send to analytics service (Google Analytics, etc.)
  sendToAnalytics(event);

  console.log(`📊 Analytics: ${eventType} - ${eventName}`, event);
}

// Update conversion funnel tracking
function updateConversionFunnel(event: AnalyticsEvent) {
  const sessionId = event.sessionId;
  let funnel = conversionFunnels.get(sessionId);

  if (!funnel) {
    funnel = {
      sessionId,
      source: event.source,
      campaign: event.campaign,
      landingPage: event.page,
      steps: {
        page_view: null,
        form_start: null,
        form_submit: null,
        conversion: null,
      },
    };
    conversionFunnels.set(sessionId, funnel);
  }

  // Update funnel steps
  const eventTime = new Date(event.timestamp);
  
  switch (event.eventType) {
    case 'page_view':
      if (!funnel.steps.page_view) {
        funnel.steps.page_view = eventTime;
      }
      break;
    case 'form_start':
      funnel.steps.form_start = eventTime;
      break;
    case 'form_submit':
      funnel.steps.form_submit = eventTime;
      funnel.leadId = event.leadId;
      funnel.riskScore = event.properties.riskScore;
      funnel.program = event.properties.program;
      break;
    case 'conversion':
      funnel.steps.conversion = eventTime;
      if (funnel.steps.page_view) {
        funnel.conversionTime = Math.round((eventTime.getTime() - funnel.steps.page_view.getTime()) / (1000 * 60));
      }
      break;
  }

  // Check for drop-off points
  if (!funnel.dropOffPoint) {
    if (funnel.steps.page_view && !funnel.steps.form_start) {
      // If user has been on site for more than 5 minutes without starting form
      const timeSinceView = new Date().getTime() - funnel.steps.page_view.getTime();
      if (timeSinceView > 5 * 60 * 1000) {
        funnel.dropOffPoint = 'page_view';
      }
    } else if (funnel.steps.form_start && !funnel.steps.form_submit) {
      // If user started form but hasn't submitted in 10 minutes
      const timeSinceStart = new Date().getTime() - funnel.steps.form_start.getTime();
      if (timeSinceStart > 10 * 60 * 1000) {
        funnel.dropOffPoint = 'form_start';
      }
    }
  }
}

// Send event to external analytics services
function sendToAnalytics(event: AnalyticsEvent) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.eventName, {
      event_category: event.eventType,
      event_label: event.page,
      value: event.value,
      custom_map: {
        session_id: event.sessionId,
        lead_id: event.leadId,
        source: event.source,
        campaign: event.campaign,
      },
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const fbEventName = mapToFacebookEvent(event.eventType, event.eventName);
    if (fbEventName) {
      (window as any).fbq('track', fbEventName, {
        content_name: event.eventName,
        content_category: event.eventType,
        source: event.source,
        value: event.value,
      });
    }
  }
}

// Map our events to Facebook Pixel events
function mapToFacebookEvent(eventType: string, eventName: string): string | null {
  switch (eventType) {
    case 'page_view':
      return 'PageView';
    case 'form_start':
      return 'InitiateCheckout';
    case 'form_submit':
      return 'Lead';
    case 'conversion':
      return 'Purchase';
    case 'cta_click':
      if (eventName.includes('call') || eventName.includes('phone')) {
        return 'Contact';
      }
      return 'ViewContent';
    default:
      return null;
  }
}

// Common tracking functions for easy use
export const Analytics = {
  // Page views
  trackPageView: (pageName?: string) => {
    trackEvent('page_view', `Page View: ${pageName || document.title}`);
  },

  // Form interactions
  trackFormStart: (formType: string) => {
    trackEvent('form_start', `Form Started: ${formType}`, { formType });
  },

  trackFormSubmit: (formType: string, leadId: string, riskScore: number, program: string) => {
    trackEvent('form_submit', `Form Submitted: ${formType}`, {
      formType,
      leadId,
      riskScore,
      program,
    });
  },

  // CTA clicks
  trackCTAClick: (ctaName: string, destination: string) => {
    trackEvent('cta_click', `CTA Click: ${ctaName}`, { destination });
  },

  // Phone calls
  trackPhoneCall: (source: string) => {
    trackEvent('phone_call', 'Phone Call Initiated', { source });
  },

  // Email clicks
  trackEmailClick: (source: string) => {
    trackEvent('email_click', 'Email Link Clicked', { source });
  },

  // Conversions (when someone actually gets housed)
  trackConversion: (leadId: string, program: string, value: number) => {
    trackEvent('conversion', 'Lead Converted to Resident', {
      leadId,
      program,
      value,
    });
  },
};

// Analytics dashboard data
export function getAnalyticsSummary() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentEvents = analyticsEvents.filter(e => new Date(e.timestamp) > last24Hours);
  const weeklyEvents = analyticsEvents.filter(e => new Date(e.timestamp) > last7Days);

  // Calculate conversion rates
  const funnels = Array.from(conversionFunnels.values());
  const totalSessions = funnels.length;
  const formStarts = funnels.filter(f => f.steps.form_start).length;
  const formSubmits = funnels.filter(f => f.steps.form_submit).length;
  const conversions = funnels.filter(f => f.steps.conversion).length;

  return {
    summary: {
      totalEvents: analyticsEvents.length,
      last24Hours: recentEvents.length,
      last7Days: weeklyEvents.length,
      totalSessions,
      conversionRate: totalSessions > 0 ? (formSubmits / totalSessions * 100) : 0,
      formCompletionRate: formStarts > 0 ? (formSubmits / formStarts * 100) : 0,
    },
    funnelAnalysis: {
      totalSessions,
      formStarts,
      formSubmits,
      conversions,
      dropOffs: {
        pageView: funnels.filter(f => f.dropOffPoint === 'page_view').length,
        formStart: funnels.filter(f => f.dropOffPoint === 'form_start').length,
      },
    },
    sourceAnalysis: getSourceBreakdown(weeklyEvents),
    averageConversionTime: calculateAverageConversionTime(funnels),
    programBreakdown: getProgramBreakdown(funnels),
  };
}

// Source analysis
function getSourceBreakdown(events: AnalyticsEvent[]) {
  const sources = new Map<string, number>();
  events.forEach(event => {
    const source = event.source || 'direct';
    sources.set(source, (sources.get(source) || 0) + 1);
  });
  
  return Array.from(sources.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

// Calculate average conversion time
function calculateAverageConversionTime(funnels: ConversionFunnel[]): number {
  const convertedFunnels = funnels.filter(f => f.conversionTime);
  if (convertedFunnels.length === 0) return 0;
  
  const totalTime = convertedFunnels.reduce((sum, f) => sum + (f.conversionTime || 0), 0);
  return Math.round(totalTime / convertedFunnels.length);
}

// Program breakdown
function getProgramBreakdown(funnels: ConversionFunnel[]) {
  const programs = new Map<string, number>();
  funnels.filter(f => f.program).forEach(funnel => {
    const program = funnel.program!;
    programs.set(program, (programs.get(program) || 0) + 1);
  });
  
  return Array.from(programs.entries())
    .map(([program, count]) => ({ program, count }))
    .sort((a, b) => b.count - a.count);
}

// Export analytics data
export function exportAnalyticsData() {
  return {
    events: analyticsEvents,
    funnels: Array.from(conversionFunnels.values()),
    summary: getAnalyticsSummary(),
    exportDate: new Date().toISOString(),
  };
}

// Clear old analytics data (run periodically)
export function cleanupAnalyticsData(daysToKeep: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const beforeCount = analyticsEvents.length;
  analyticsEvents = analyticsEvents.filter(event => 
    new Date(event.timestamp) > cutoffDate
  );

  // Clean up funnels
  const beforeFunnels = conversionFunnels.size;
  for (const [sessionId, funnel] of conversionFunnels.entries()) {
    if (funnel.steps.page_view && funnel.steps.page_view < cutoffDate) {
      conversionFunnels.delete(sessionId);
    }
  }

  console.log(`🧹 Analytics cleanup: Removed ${beforeCount - analyticsEvents.length} events and ${beforeFunnels - conversionFunnels.size} funnels`);
}