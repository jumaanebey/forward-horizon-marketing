import { NextResponse } from 'next/server';

interface BlogPost {
  slug: string;
  lastModified: string;
  priority: number;
}

// Blog posts configuration
const blogPosts: BlogPost[] = [
  {
    slug: 'transitioning-from-military-to-civilian-life',
    lastModified: '2024-08-20',
    priority: 0.9
  },
  {
    slug: 'what-to-look-for-in-sober-living',
    lastModified: '2024-08-15',
    priority: 0.9
  },
  {
    slug: 'first-30-days-after-release-checklist',
    lastModified: '2024-08-10',
    priority: 0.9
  },
  {
    slug: 'va-benefits-and-housing-assistance',
    lastModified: '2024-08-05',
    priority: 0.8
  },
  {
    slug: 'building-recovery-support-network',
    lastModified: '2024-07-30',
    priority: 0.8
  },
  {
    slug: 'finding-employment-with-criminal-record',
    lastModified: '2024-07-25',
    priority: 0.8
  },
  {
    slug: 'building-community-after-service',
    lastModified: '2024-07-20',
    priority: 0.7
  },
  {
    slug: 'maintaining-sobriety-transitional-housing',
    lastModified: '2024-07-15',
    priority: 0.7
  },
  {
    slug: 'building-positive-community-connections',
    lastModified: '2024-07-10',
    priority: 0.7
  }
];

export async function GET() {
  const baseUrl = 'https://forwardhorizon.vercel.app';
  
  // Main site pages
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/veterans-housing', priority: 0.9, changefreq: 'weekly' },
    { url: '/recovery-housing', priority: 0.9, changefreq: 'weekly' },
    { url: '/reentry-support', priority: 0.9, changefreq: 'weekly' },
    { url: '/contact', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.8, changefreq: 'daily' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${blogPosts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${post.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}