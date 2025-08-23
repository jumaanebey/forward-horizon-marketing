'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { trackEvent } from '../../../components/Analytics';

export default function ReentryThankYou() {
  useEffect(() => {
    // Track conversion for Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      // Standard form submission event
      window.gtag('event', 'form_submit', {
        'event_category': 'lead_generation',
        'event_label': 'reentry_guide_download',
        'value': 25
      });
      
      // Conversion event for GA4
      window.gtag('event', 'generate_lead', {
        'event_category': 'conversion',
        'event_label': 'reentry_guide',
        'value': 25,
        'currency': 'USD'
      });
      
      // Custom conversion event
      window.gtag('event', 'conversion', {
        'event_category': 'lead_generation',
        'event_label': 'reentry_guide_download'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Life After Release Planning Kit is on its way to your inbox.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                <p className="text-gray-600">Your Life After Release Planning Kit will arrive within the next few minutes.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Your Planning Kit</h3>
                <p className="text-gray-600">Take time to go through the 90-day re-entry plan and essential documentation checklist.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Start Your Journey</h3>
                <p className="text-gray-600">Visit Forward Horizon to learn about our re-entry support program and housing options.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <a 
            href="https://theforwardhorizon.com" 
            className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Visit Forward Horizon →
          </a>
          
          <div className="text-gray-600">
            <p>Need immediate support? <a href="tel:+1-310-488-5280" className="text-purple-600 font-semibold">(310) 488-5280</a></p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/reentry-support" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Re-entry Support
          </Link>
        </div>
      </div>
    </div>
  );
}