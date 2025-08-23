'use client'

import { useEffect } from 'react'
import { Analytics } from '@/lib/analytics-tracker'

interface ClientAnalyticsProps {
  pageName: string;
}

export default function ClientAnalytics({ pageName }: ClientAnalyticsProps) {
  useEffect(() => {
    Analytics.trackPageView(pageName);
  }, [pageName]);

  return null;
}

export function trackFormStart(formType: string) {
  Analytics.trackFormStart(formType);
}

export function trackCTAClick(ctaName: string, destination: string) {
  Analytics.trackCTAClick(ctaName, destination);
}

export function trackPhoneCall(source: string) {
  Analytics.trackPhoneCall(source);
}

export function trackEmailClick(source: string) {
  Analytics.trackEmailClick(source);
}