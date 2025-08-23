import { Metadata } from 'next';
import Link from 'next/link';
import ClientAnalytics from '@/components/ClientAnalytics';
import TrackingLink from '@/components/TrackingLink';

export const metadata: Metadata = {
  title: 'Housing Resources Blog | Forward Horizon - Expert Guidance for Veterans, Recovery & Reentry',
  description: 'Expert housing advice for veterans, individuals in recovery, and returning citizens. Get practical tips, success stories, and step-by-step guides from housing professionals.',
  keywords: 'transitional housing, veterans housing, recovery housing, reentry support, housing assistance, Los Angeles housing',
  openGraph: {
    title: 'Forward Horizon Housing Resources Blog',
    description: 'Expert housing guidance and success stories for transitional housing programs',
    type: 'website'
  }
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'veterans' | 'recovery' | 'reentry' | 'general';
  publishDate: string;
  readTime: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 'transitioning-from-military-to-civilian-life',
    title: 'Transitioning from Military to Civilian Life: Your Complete Housing Guide',
    excerpt: 'Navigate the transition from military service with our comprehensive guide to finding stable housing, accessing VA benefits, and building civilian community.',
    category: 'veterans',
    publishDate: '2024-08-20',
    readTime: '8 min read',
    featured: true
  },
  {
    id: 'what-to-look-for-in-sober-living',
    title: 'What to Look for in Sober Living Housing: Essential Checklist',
    excerpt: 'Choosing the right sober living environment is crucial for recovery success. Learn key factors to evaluate when selecting transitional housing.',
    category: 'recovery',
    publishDate: '2024-08-15',
    readTime: '6 min read',
    featured: true
  },
  {
    id: 'first-30-days-after-release-checklist',
    title: 'First 30 Days After Release: Your Complete Action Plan',
    excerpt: 'Successfully navigate your first month back in the community with this comprehensive step-by-step checklist for housing, employment, and essential services.',
    category: 'reentry',
    publishDate: '2024-08-10',
    readTime: '10 min read',
    featured: true
  },
  {
    id: 'va-benefits-and-housing-assistance',
    title: 'VA Benefits and Housing Assistance: Maximizing Your Support',
    excerpt: 'Complete guide to veterans housing benefits, HUD-VASH vouchers, and VA supportive housing programs available in Southern California.',
    category: 'veterans',
    publishDate: '2024-08-05',
    readTime: '7 min read',
    featured: false
  },
  {
    id: 'building-recovery-support-network',
    title: 'Building a Recovery Support Network in Transitional Housing',
    excerpt: 'Learn how to create meaningful connections and support systems that strengthen your recovery journey in transitional housing.',
    category: 'recovery',
    publishDate: '2024-07-30',
    readTime: '5 min read',
    featured: false
  },
  {
    id: 'finding-employment-with-criminal-record',
    title: 'Finding Employment with a Criminal Record: Proven Strategies',
    excerpt: 'Practical job search strategies, interview tips, and resources for securing employment opportunities with a criminal background.',
    category: 'reentry',
    publishDate: '2024-07-25',
    readTime: '9 min read',
    featured: false
  },
  {
    id: 'building-community-after-service',
    title: 'Building Community After Military Service',
    excerpt: 'Connect with fellow veterans and build lasting relationships in civilian communities through housing programs and support networks.',
    category: 'veterans',
    publishDate: '2024-07-20',
    readTime: '6 min read',
    featured: false
  },
  {
    id: 'maintaining-sobriety-transitional-housing',
    title: 'Maintaining Sobriety in Transitional Housing: Success Strategies',
    excerpt: 'Essential techniques and daily practices for maintaining long-term sobriety while living in transitional housing environments.',
    category: 'recovery',
    publishDate: '2024-07-15',
    readTime: '7 min read',
    featured: false
  },
  {
    id: 'building-positive-community-connections',
    title: 'Building Positive Community Connections After Incarceration',
    excerpt: 'Strategies for creating healthy relationships and community ties that support successful reintegration and long-term stability.',
    category: 'reentry',
    publishDate: '2024-07-10',
    readTime: '8 min read',
    featured: false
  }
];

const categories = {
  veterans: { name: 'Veterans', icon: '🇺🇸', color: 'blue' },
  recovery: { name: 'Recovery', icon: '🌱', color: 'green' },
  reentry: { name: 'Reentry', icon: '🏠', color: 'purple' },
  general: { name: 'General', icon: '📚', color: 'gray' }
};

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <ClientAnalytics pageName="Blog" />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">📚</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Housing Resources & Success Stories
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Expert guidance, practical tips, and inspiring stories from our transitional housing community
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="bg-white px-6 py-3 rounded-full shadow-md font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              All Articles
            </button>
            {Object.entries(categories).map(([key, category]) => (
              <button 
                key={key}
                className={`bg-white px-6 py-3 rounded-full shadow-md font-semibold text-gray-700 hover:bg-${category.color}-50 hover:text-${category.color}-700 transition-colors`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => {
              const categoryInfo = categories[post.category];
              return (
                <Link key={post.id} href={`/blog/${post.id}`} className="group">
                  <article className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-blue-200">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}>
                      {categoryInfo.icon} {categoryInfo.name}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="text-blue-600 font-semibold mt-4 group-hover:text-blue-700">
                      Read Article →
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* All Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularPosts.map((post) => {
              const categoryInfo = categories[post.category];
              return (
                <Link key={post.id} href={`/blog/${post.id}`} className="group">
                  <article className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-blue-200">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-3 bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}>
                      {categoryInfo.icon} {categoryInfo.name}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="text-blue-600 font-semibold mt-3 group-hover:text-blue-700">
                      Read Article →
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Housing Assistance?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our experienced team is here to help you find the right transitional housing program
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackingLink
              href="tel:+1-310-488-5280" 
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
              trackingType="phone"
              trackingData="Blog CTA"
            >
              📞 Call (310) 488-5280
            </TrackingLink>
            <TrackingLink
              href="/contact" 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              trackingType="cta"
              trackingData="Blog Contact"
            >
              📧 Get Information
            </TrackingLink>
          </div>
        </div>
      </div>
    </div>
  );
}