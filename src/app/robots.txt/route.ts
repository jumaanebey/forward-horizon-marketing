import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# Robots.txt for Forward Horizon Transitional Housing

User-agent: *
Allow: /

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block any potential admin or private areas
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow important pages for transitional housing SEO
Allow: /veterans-housing
Allow: /recovery-housing
Allow: /reentry-support
Allow: /contact
Allow: /blog/*

# Sitemap location
Sitemap: https://forwardhorizon.vercel.app/sitemap.xml

# Crawl delay for being respectful
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}