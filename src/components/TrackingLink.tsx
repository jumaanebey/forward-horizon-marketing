'use client'

import { trackPhoneCall, trackCTAClick } from './ClientAnalytics'

interface TrackingLinkProps {
  href: string;
  className: string;
  children: React.ReactNode;
  trackingType: 'phone' | 'cta';
  trackingData: string;
}

export default function TrackingLink({ 
  href, 
  className, 
  children, 
  trackingType, 
  trackingData 
}: TrackingLinkProps) {
  const handleClick = () => {
    if (trackingType === 'phone') {
      trackPhoneCall(trackingData);
    } else if (trackingType === 'cta') {
      trackCTAClick(trackingData, href);
    }
  };

  return (
    <a 
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}