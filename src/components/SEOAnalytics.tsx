'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface SEOAnalyticsProps {
  title?: string;
  category?: 'veterans' | 'recovery' | 'reentry' | 'general';
  postId?: string;
}

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

export default function SEOAnalytics({ title, category, postId }: SEOAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Track page view with enhanced data
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_title: title,
        page_location: window.location.href,
        content_group1: category || 'general', // Audience category
        content_group2: pathname.includes('/blog/') ? 'blog' : 'page', // Content type
        custom_map: {
          custom_dimension_1: category,
          custom_dimension_2: postId
        }
      });

      // Track specific events for blog content
      if (pathname.includes('/blog/') && postId) {
        window.gtag('event', 'blog_view', {
          event_category: 'Content',
          event_label: postId,
          custom_parameter_1: category,
          value: 1
        });
      }

      // Track audience-specific page views
      if (category) {
        window.gtag('event', 'audience_content_view', {
          event_category: 'Audience Engagement',
          event_label: category,
          page_title: title,
          value: 1
        });
      }
    }
  }, [pathname, searchParams, title, category, postId]);

  useEffect(() => {
    // Track content engagement events
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      // Track milestone scroll events
      if (scrollPercent >= 25 && !sessionStorage.getItem('scroll_25')) {
        sessionStorage.setItem('scroll_25', 'true');
        if (window.gtag) {
          window.gtag('event', 'scroll', {
            event_category: 'Content Engagement',
            event_label: 'scroll_25',
            custom_parameter_1: postId || pathname,
            value: 25
          });
        }
      }

      if (scrollPercent >= 50 && !sessionStorage.getItem('scroll_50')) {
        sessionStorage.setItem('scroll_50', 'true');
        if (window.gtag) {
          window.gtag('event', 'scroll', {
            event_category: 'Content Engagement',
            event_label: 'scroll_50',
            custom_parameter_1: postId || pathname,
            value: 50
          });
        }
      }

      if (scrollPercent >= 75 && !sessionStorage.getItem('scroll_75')) {
        sessionStorage.setItem('scroll_75', 'true');
        if (window.gtag) {
          window.gtag('event', 'scroll', {
            event_category: 'Content Engagement',
            event_label: 'scroll_75',
            custom_parameter_1: postId || pathname,
            value: 75
          });
        }
      }

      if (scrollPercent >= 90 && !sessionStorage.getItem('scroll_complete')) {
        sessionStorage.setItem('scroll_complete', 'true');
        if (window.gtag) {
          window.gtag('event', 'scroll', {
            event_category: 'Content Engagement',
            event_label: 'scroll_complete',
            custom_parameter_1: postId || pathname,
            value: 100
          });
        }
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (window.gtag && timeSpent > 30) { // Only track if spent more than 30 seconds
        window.gtag('event', 'time_on_page', {
          event_category: 'Content Engagement',
          event_label: postId || pathname,
          value: timeSpent
        });
      }
    };

    // Track link clicks within content
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && window.gtag) {
        const href = link.getAttribute('href') || '';
        const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
        const isPhone = href.startsWith('tel:');
        const isEmail = href.startsWith('mailto:');
        const isInternal = href.startsWith('/');

        let eventCategory = 'Link Click';
        let eventLabel = href;

        if (isPhone) {
          eventCategory = 'Phone Call';
          eventLabel = 'blog_phone_click';
        } else if (isEmail) {
          eventCategory = 'Email Click';
          eventLabel = 'blog_email_click';
        } else if (isExternal) {
          eventCategory = 'External Link';
          eventLabel = href;
        } else if (isInternal) {
          eventCategory = 'Internal Link';
          eventLabel = href;
        }

        window.gtag('event', 'click', {
          event_category: eventCategory,
          event_label: eventLabel,
          custom_parameter_1: postId || pathname,
          custom_parameter_2: category,
          value: 1
        });
      }
    };

    // Attach event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('click', handleLinkClick);

    // Clean up scroll tracking on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', handleLinkClick);
      
      // Clear session storage for scroll tracking
      sessionStorage.removeItem('scroll_25');
      sessionStorage.removeItem('scroll_50');
      sessionStorage.removeItem('scroll_75');
      sessionStorage.removeItem('scroll_complete');
    };
  }, [pathname, postId, category]);

  // Track CTA interactions
  useEffect(() => {
    const handleCTAClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const ctaElement = target.closest('[data-cta]');
      
      if (ctaElement && window.gtag) {
        const ctaType = ctaElement.getAttribute('data-cta');
        const ctaText = ctaElement.textContent || '';
        
        window.gtag('event', 'cta_click', {
          event_category: 'CTA Engagement',
          event_label: ctaType,
          custom_parameter_1: ctaText,
          custom_parameter_2: postId || pathname,
          custom_parameter_3: category,
          value: 1
        });
      }
    };

    document.addEventListener('click', handleCTAClick);

    return () => {
      document.removeEventListener('click', handleCTAClick);
    };
  }, [postId, category, pathname]);

  return null; // This component doesn't render anything visible
}

// Hook for tracking form submissions
export function useFormTracking() {
  const pathname = usePathname();

  const trackFormSubmission = (formType: string, formData?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submission', {
        event_category: 'Lead Generation',
        event_label: formType,
        custom_parameter_1: pathname,
        custom_parameter_2: formData?.audience || 'general',
        value: 1
      });
    }
  };

  const trackFormStart = (formType: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_start', {
        event_category: 'Lead Generation',
        event_label: formType,
        custom_parameter_1: pathname,
        value: 1
      });
    }
  };

  return { trackFormSubmission, trackFormStart };
}

// Hook for tracking search behavior
export function useSearchTracking() {
  const trackSiteSearch = (searchTerm: string, resultsCount?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        event_category: 'Site Search',
        custom_parameter_1: resultsCount || 0,
        value: 1
      });
    }
  };

  return { trackSiteSearch };
}