'use client';

import { usePathname } from 'next/navigation';

interface SchemaMarkupProps {
  type: 'organization' | 'article' | 'service' | 'faq' | 'breadcrumb';
  data: any;
}

interface OrganizationSchema {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  services: string[];
  areaServed: string[];
}

interface ArticleSchema {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  category: string;
  keywords: string[];
  url: string;
  wordCount: number;
}

interface ServiceSchema {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string[];
  offers: {
    name: string;
    description: string;
  }[];
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const pathname = usePathname();
  const baseUrl = 'https://forwardhorizon.vercel.app';

  const generateOrganizationSchema = (orgData: OrganizationSchema) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: orgData.name,
      alternateName: 'Forward Horizon',
      description: orgData.description,
      url: baseUrl,
      telephone: orgData.telephone,
      email: 'info@theforwardhorizon.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: orgData.address.streetAddress,
        addressLocality: orgData.address.addressLocality,
        addressRegion: orgData.address.addressRegion,
        postalCode: orgData.address.postalCode,
        addressCountry: orgData.address.addressCountry
      },
      areaServed: orgData.areaServed.map(area => ({
        '@type': 'GeoCircle',
        name: area
      })),
      serviceArea: orgData.areaServed,
      knowsAbout: [
        'Transitional Housing',
        'Veterans Housing',
        'Recovery Housing',
        'Reentry Support',
        'Substance Abuse Recovery',
        'Housing Assistance',
        'Social Services'
      ],
      memberOf: {
        '@type': 'Organization',
        name: 'California Association of Addiction Recovery Resources'
      },
      sameAs: [
        'https://theforwardhorizon.com',
        'https://www.facebook.com/ForwardHorizonHousing',
        'https://www.linkedin.com/company/forward-horizon'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Housing Services',
        itemListElement: orgData.services.map((service, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service,
            serviceType: 'Transitional Housing'
          }
        }))
      }
    };
  };

  const generateArticleSchema = (articleData: ArticleSchema) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleData.headline,
      description: articleData.description,
      author: {
        '@type': 'Organization',
        name: 'Forward Horizon',
        url: baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'Forward Horizon',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/forward-horizon-logo.png`,
          width: 200,
          height: 60
        }
      },
      datePublished: articleData.datePublished,
      dateModified: articleData.dateModified || articleData.datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}${pathname}`
      },
      articleSection: articleData.category,
      keywords: articleData.keywords,
      wordCount: articleData.wordCount,
      url: articleData.url,
      about: [
        {
          '@type': 'Thing',
          name: 'Transitional Housing',
          sameAs: 'https://en.wikipedia.org/wiki/Transitional_housing'
        },
        {
          '@type': 'Thing',
          name: articleData.category === 'veterans' ? 'Veterans Affairs' :
                articleData.category === 'recovery' ? 'Addiction Recovery' :
                articleData.category === 'reentry' ? 'Prisoner Reentry' : 'Social Services'
        }
      ],
      mentions: [
        {
          '@type': 'Organization',
          name: 'Forward Horizon'
        }
      ]
    };
  };

  const generateServiceSchema = (serviceData: ServiceSchema) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: serviceData.name,
      description: serviceData.description,
      serviceType: serviceData.serviceType,
      provider: {
        '@type': 'Organization',
        name: 'Forward Horizon',
        '@id': `${baseUrl}#organization`
      },
      areaServed: serviceData.areaServed.map(area => ({
        '@type': 'State',
        name: area
      })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${serviceData.name} Services`,
        itemListElement: serviceData.offers.map((offer, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: offer.name,
            description: offer.description
          }
        }))
      },
      audience: {
        '@type': 'Audience',
        audienceType: serviceData.serviceType === 'Veterans Housing' ? 'Veterans' :
                     serviceData.serviceType === 'Recovery Housing' ? 'Individuals in Recovery' :
                     serviceData.serviceType === 'Reentry Support' ? 'Returning Citizens' : 'General Population'
      }
    };
  };

  const generateFAQSchema = (faqData: { question: string; answer: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  };

  const generateBreadcrumbSchema = (breadcrumbs: { name: string; url: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('/') ? `${baseUrl}${crumb.url}` : crumb.url
      }))
    };
  };

  let schema;

  switch (type) {
    case 'organization':
      schema = generateOrganizationSchema(data as OrganizationSchema);
      break;
    case 'article':
      schema = generateArticleSchema(data as ArticleSchema);
      break;
    case 'service':
      schema = generateServiceSchema(data as ServiceSchema);
      break;
    case 'faq':
      schema = generateFAQSchema(data);
      break;
    case 'breadcrumb':
      schema = generateBreadcrumbSchema(data);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-configured schemas for common use cases
export function OrganizationSchema() {
  const orgData: OrganizationSchema = {
    name: 'Forward Horizon',
    description: 'Transitional housing and comprehensive support services for veterans, individuals in recovery, and returning citizens in Southern California.',
    url: 'https://forwardhorizon.vercel.app',
    telephone: '(310) 488-5280',
    address: {
      streetAddress: '123 Housing Way',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      postalCode: '90210',
      addressCountry: 'US'
    },
    services: [
      'Veterans Housing',
      'Recovery Housing',
      'Reentry Support',
      'Case Management',
      'Life Skills Training',
      'Employment Assistance'
    ],
    areaServed: [
      'Los Angeles County',
      'Orange County',
      'Riverside County',
      'San Bernardino County'
    ]
  };

  return <SchemaMarkup type="organization" data={orgData} />;
}

export function VeteransServiceSchema() {
  const serviceData: ServiceSchema = {
    name: 'Veterans Transitional Housing',
    description: 'Comprehensive housing and support services specifically designed for veterans transitioning to civilian life.',
    serviceType: 'Veterans Housing',
    areaServed: ['California'],
    offers: [
      {
        name: 'Secure Housing',
        description: 'Safe, stable transitional housing for veterans'
      },
      {
        name: 'VA Benefits Assistance',
        description: 'Help navigating and accessing VA benefits and services'
      },
      {
        name: 'Employment Support',
        description: 'Job placement and career development services'
      },
      {
        name: 'Mental Health Services',
        description: 'Access to mental health counseling and support'
      }
    ]
  };

  return <SchemaMarkup type="service" data={serviceData} />;
}

export function RecoveryServiceSchema() {
  const serviceData: ServiceSchema = {
    name: 'Recovery Housing Program',
    description: 'Substance-free transitional housing with comprehensive recovery support services.',
    serviceType: 'Recovery Housing',
    areaServed: ['California'],
    offers: [
      {
        name: 'Sober Living Environment',
        description: 'Safe, substance-free housing community'
      },
      {
        name: 'Peer Support Groups',
        description: '24/7 peer support and accountability'
      },
      {
        name: 'Life Skills Training',
        description: 'Essential life skills for independent living'
      },
      {
        name: 'Recovery Planning',
        description: 'Individualized recovery planning and support'
      }
    ]
  };

  return <SchemaMarkup type="service" data={serviceData} />;
}

export function ReentryServiceSchema() {
  const serviceData: ServiceSchema = {
    name: 'Reentry Support Program',
    description: 'Comprehensive support services for individuals returning to the community after incarceration.',
    serviceType: 'Reentry Support',
    areaServed: ['California'],
    offers: [
      {
        name: 'Transitional Housing',
        description: 'Safe, supportive housing during community reintegration'
      },
      {
        name: 'Employment Placement',
        description: 'Job search assistance and employment placement services'
      },
      {
        name: 'Case Management',
        description: 'Individualized case management and support planning'
      },
      {
        name: 'Legal Support',
        description: 'Assistance with legal documentation and rights'
      }
    ]
  };

  return <SchemaMarkup type="service" data={serviceData} />;
}