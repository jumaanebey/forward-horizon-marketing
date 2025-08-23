import { Metadata } from 'next';
import Link from 'next/link';
import ClientAnalytics from '@/components/ClientAnalytics';
import SEOAnalytics from '@/components/SEOAnalytics';
import TrackingLink from '@/components/TrackingLink';

export const metadata: Metadata = {
  title: 'What to Look for in Sober Living Housing: Essential Checklist | Forward Horizon',
  description: 'Choose the right sober living environment for recovery success. Essential checklist for evaluating transitional housing, support services, and community environment.',
  keywords: 'sober living, recovery housing, transitional housing, addiction recovery, sober living checklist, Los Angeles recovery',
  openGraph: {
    title: 'Essential Checklist for Choosing Sober Living Housing',
    description: 'Expert guidance on selecting the right sober living environment for successful addiction recovery',
    type: 'article'
  }
}

export default function WhatToLookForInSoberLiving() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <ClientAnalytics pageName="Blog - Sober Living Checklist" />
      <SEOAnalytics 
        title="What to Look for in Sober Living Housing: Essential Checklist"
        category="recovery"
        postId="what-to-look-for-in-sober-living"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span>›</span>
            <span className="text-gray-900">Sober Living Checklist</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-green-100 text-green-800">
            🌱 Recovery Housing
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What to Look for in Sober Living Housing: Essential Checklist
          </h1>
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <span>Published: August 15, 2024</span>
            <span>•</span>
            <span>6 min read</span>
            <span>•</span>
            <span>Recovery Housing Guide</span>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Choosing the right sober living environment is one of the most critical decisions in your recovery journey. This comprehensive checklist helps you evaluate essential factors that contribute to successful long-term sobriety and personal growth.
          </p>
        </header>

        {/* Article Content */}
        <article className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Sober Living Environment Matters</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              The transition from treatment to independent living can be one of the most vulnerable periods in recovery. A quality sober living environment provides the structured support and accountability needed during this critical phase, while allowing residents to practice life skills in a safe, substance-free community.
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8 rounded-r-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Benefits of Quality Sober Living:</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Structured environment that supports recovery goals</li>
                <li>• Peer support from others in similar situations</li>
                <li>• Gradual transition to independent living</li>
                <li>• Access to ongoing recovery resources and programs</li>
                <li>• Safe, substance-free living environment</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Essential Safety and Structure Factors</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Drug and Alcohol Testing Policies</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              A reputable sober living facility should have clear, consistently enforced testing policies. Look for programs that conduct regular random testing and have transparent consequences for violations.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-red-900 mb-3">Questions to Ask About Testing:</h4>
              <ul className="space-y-2 text-red-800">
                <li>• How frequently is testing conducted?</li>
                <li>• What substances are tested for?</li>
                <li>• What happens if someone tests positive?</li>
                <li>• Are there clear appeals or second-chance policies?</li>
                <li>• How is testing documentation handled?</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">House Rules and Structure</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Clear, reasonable house rules provide the structure essential for early recovery. These should cover curfews, chores, meetings attendance, and visitor policies while respecting residents' dignity and recovery process.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Essential House Rules Should Cover:</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Curfew and check-in procedures</li>
                  <li>• Meeting attendance requirements</li>
                  <li>• Chore and maintenance responsibilities</li>
                  <li>• Visitor and overnight guest policies</li>
                  <li>• Employment or education expectations</li>
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-yellow-900 mb-3">Red Flags to Watch For:</h4>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Overly restrictive or unreasonable rules</li>
                  <li>• Inconsistent rule enforcement</li>
                  <li>• Lack of clear consequences</li>
                  <li>• No resident input in house policies</li>
                  <li>• Rules that don't support recovery goals</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Support Services and Programs</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">On-Site Support Staff</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Quality sober living facilities have trained staff available to provide guidance, crisis intervention, and connection to additional resources. Staff should be knowledgeable about addiction recovery and local support services.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Support Staff Qualifications to Look For:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-purple-800 mb-2">Education & Training</h5>
                  <ul className="space-y-1 text-purple-700 text-sm">
                    <li>• Addiction counseling certification</li>
                    <li>• Mental health first aid training</li>
                    <li>• Crisis intervention experience</li>
                    <li>• Recovery coaching credentials</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-800 mb-2">Experience & Approach</h5>
                  <ul className="space-y-1 text-purple-700 text-sm">
                    <li>• Personal recovery experience</li>
                    <li>• Trauma-informed care training</li>
                    <li>• Cultural competency awareness</li>
                    <li>• Local resource knowledge</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recovery Program Integration</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The best sober living environments actively support residents' ongoing recovery programs, whether that's 12-step meetings, SMART Recovery, therapy, or other evidence-based approaches.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Community and Peer Support</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Resident Screening Process</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              A thorough screening process ensures residents are committed to recovery and compatible with the house community. This typically includes interviews, reference checks, and verification of recent sobriety.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-green-900 mb-3">Screening Should Include:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-green-800">
                  <li>✓ In-person or virtual interview</li>
                  <li>✓ Verification of recent treatment or sobriety</li>
                  <li>✓ Reference checks from treatment providers</li>
                  <li>✓ Background check for safety</li>
                </ul>
                <ul className="space-y-2 text-green-800">
                  <li>✓ Financial capability verification</li>
                  <li>✓ Commitment to house rules agreement</li>
                  <li>✓ Recovery program participation plan</li>
                  <li>✓ Emergency contact information</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">House Meetings and Community Building</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Regular house meetings foster community, address concerns, and provide accountability. Look for facilities that encourage resident participation in house governance and decision-making processes.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Physical Environment and Amenities</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Living Conditions and Safety</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              The physical environment should be clean, safe, and conducive to recovery. This includes proper maintenance, security measures, and comfortable common areas for community activities.
            </p>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Safety & Security</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Secure entry systems and key management</li>
                  <li>• Well-lit parking and outdoor areas</li>
                  <li>• Working smoke detectors and emergency systems</li>
                  <li>• First aid supplies and emergency procedures</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Living Space Quality</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Clean, well-maintained bedrooms and bathrooms</li>
                  <li>• Adequate privacy and personal space</li>
                  <li>• Functioning kitchen and laundry facilities</li>
                  <li>• Comfortable common areas for socializing</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Recovery-Focused Amenities</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Quiet spaces for meditation or prayer</li>
                  <li>• Library or study areas</li>
                  <li>• Exercise or recreation facilities</li>
                  <li>• Meeting spaces for recovery groups</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Financial Considerations</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cost Transparency and Payment Options</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Understanding all costs upfront helps avoid financial stress that could threaten recovery. Reputable facilities provide clear pricing and may offer payment plans or assistance programs.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-yellow-900 mb-3">Financial Questions to Ask:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-yellow-800">
                  <li>• What is included in monthly rent?</li>
                  <li>• Are there additional fees or deposits?</li>
                  <li>• What payment methods are accepted?</li>
                  <li>• Are payment plans available?</li>
                </ul>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Is financial assistance available?</li>
                  <li>• What happens if payment is late?</li>
                  <li>• Are there any hidden costs?</li>
                  <li>• How much notice is required to leave?</li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Licensing and Accreditation</h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Regulatory Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Verify that the sober living facility meets all local and state regulations. In California, this may include licensing through the Department of Social Services or certification through organizations like CAARR (California Association of Addiction Recovery Resources).
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">Verify These Credentials:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Required Licensing</h5>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• State licensing or certification</li>
                    <li>• Local permits and zoning compliance</li>
                    <li>• Fire safety and health inspections</li>
                    <li>• Insurance and liability coverage</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Professional Accreditations</h5>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• CAARR certification (California)</li>
                    <li>• National association memberships</li>
                    <li>• Staff professional certifications</li>
                    <li>• Continuous education participation</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Questions to Ask During Your Visit</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              A comprehensive site visit and interview process helps you evaluate whether a sober living facility is the right fit for your recovery needs and goals.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Essential Questions for Your Visit:</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">About the Program</h5>
                  <ul className="space-y-1 text-gray-700 text-sm pl-4">
                    <li>• What is the typical length of stay?</li>
                    <li>• How many residents live here currently?</li>
                    <li>• What are the success rates for residents?</li>
                    <li>• How do you handle relapses or violations?</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">About Daily Life</h5>
                  <ul className="space-y-1 text-gray-700 text-sm pl-4">
                    <li>• What does a typical day look like?</li>
                    <li>• How are conflicts between residents handled?</li>
                    <li>• What support is available during difficult times?</li>
                    <li>• Can I speak with current residents?</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">About Transition Planning</h5>
                  <ul className="space-y-1 text-gray-700 text-sm pl-4">
                    <li>• What services help with job searching?</li>
                    <li>• How do you support transition to independent living?</li>
                    <li>• Are there alumni or continuing support programs?</li>
                    <li>• What happens if I need to leave early?</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Forward Horizon: Recovery Housing Excellence</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              At Forward Horizon, our recovery housing program incorporates all the essential elements identified in this checklist. We understand that quality sober living is about more than just providing a substance-free environment – it's about creating a community that supports lasting recovery and personal growth.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Our Recovery Housing Program Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-800 mb-2">Comprehensive Support</h5>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• 24/7 trained staff availability</li>
                    <li>• Individual recovery planning</li>
                    <li>• Peer support groups and mentoring</li>
                    <li>• Crisis intervention services</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-green-800 mb-2">Life Skills Development</h5>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Employment assistance and job placement</li>
                    <li>• Financial planning and budgeting</li>
                    <li>• Education and training opportunities</li>
                    <li>• Independent living preparation</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">Making Your Decision</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Choosing the right sober living environment is a personal decision that should align with your recovery goals, financial situation, and support needs. Take time to visit multiple facilities, ask questions, and trust your instincts about where you feel most comfortable and supported.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-red-900 mb-3">Remember: Your Recovery is Worth the Investment</h4>
              <ul className="space-y-2 text-red-800 mb-4">
                <li>• Quality sober living can be the difference between relapse and long-term success</li>
                <li>• The right environment supports not just sobriety, but personal growth</li>
                <li>• Investing in proper support now pays dividends in your future</li>
                <li>• You deserve a safe, supportive community during this crucial time</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Recovery Community?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our recovery housing specialists can help you find the supportive sober living environment that's right for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TrackingLink
              href="tel:+1-310-488-5280" 
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
              trackingType="phone"
              trackingData="Recovery Blog CTA"
            >
              📞 Call (310) 488-5280
            </TrackingLink>
            <TrackingLink
              href="/recovery-housing" 
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors"
              trackingType="cta"
              trackingData="Recovery Program Info"
            >
              🌱 Recovery Housing Info
            </TrackingLink>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/building-recovery-support-network" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-green-200">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-3 bg-green-100 text-green-800">
                  🌱 Recovery
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  Building a Recovery Support Network in Transitional Housing
                </h4>
                <p className="text-gray-600 text-sm">
                  Create meaningful connections that strengthen your recovery journey
                </p>
              </div>
            </Link>
            <Link href="/blog/maintaining-sobriety-transitional-housing" className="group">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-green-200">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-3 bg-green-100 text-green-800">
                  🌱 Recovery
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  Maintaining Sobriety in Transitional Housing: Success Strategies
                </h4>
                <p className="text-gray-600 text-sm">
                  Essential techniques for maintaining long-term sobriety in recovery housing
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}