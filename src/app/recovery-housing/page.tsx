import { Metadata } from 'next';
import Link from 'next/link';
import ClientAnalytics from '@/components/ClientAnalytics';

export const metadata: Metadata = {
  title: 'Recovery Housing | Forward Horizon - Sober Living After Treatment',
  description: 'Safe, substance-free transitional housing for individuals in addiction recovery. 24/7 support, peer community, and structured environment for lasting sobriety.',
};

export default function RecoveryHousingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <ClientAnalytics pageName="Recovery Housing" />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600">Forward Horizon</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-green-600">← Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold mb-8">
              🌱 Recovery Housing
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Safe, Sober Living Community
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Your recovery journey continues in a supportive, substance-free environment where you can build the foundation for lasting sobriety and independent living.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Recovery Support You Need</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Substance-Free Housing</h3>
              <p className="text-gray-600">Clean, safe environment with zero tolerance for substance use</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Peer Support Network</h3>
              <p className="text-gray-600">Connect with others in recovery who understand your journey</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Structured Program</h3>
              <p className="text-gray-600">Daily structure, house meetings, and accountability systems</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Life Skills Training</h3>
              <p className="text-gray-600">Job readiness, financial planning, and independent living skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Features</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">24/7 Recovery Support</h4>
                    <p className="text-gray-600">Around-the-clock support from recovery-focused staff and peer mentors</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recovery Program Integration</h4>
                    <p className="text-gray-600">Support for attending AA/NA meetings, therapy, and outpatient programs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Random Drug Testing</h4>
                    <p className="text-gray-600">Regular testing to maintain house safety and support accountability</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Employment Assistance</h4>
                    <p className="text-gray-600">Job search support, resume building, and interview preparation</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Transportation Support</h4>
                    <p className="text-gray-600">Help getting to work, meetings, appointments, and essential services</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">House Guidelines</h2>
              <div className="bg-white border border-green-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-green-900 mb-3">Building a Foundation for Success</h4>
                <p className="text-green-800">
                  Our structured environment provides the stability and accountability needed to maintain sobriety while building life skills for independent living.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                  <span className="font-medium text-gray-900">House Meetings</span>
                  <span className="text-green-600 font-semibold">Weekly</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                  <span className="font-medium text-gray-900">Curfew</span>
                  <span className="text-green-600 font-semibold">Structured hours</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                  <span className="font-medium text-gray-900">Chore Schedule</span>
                  <span className="text-green-600 font-semibold">Shared responsibilities</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
                  <span className="font-medium text-gray-900">Recovery Meetings</span>
                  <span className="text-green-600 font-semibold">Required attendance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Your Recovery Journey</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">First 30 Days</h3>
              <p className="text-gray-600">Adjust to house structure, establish routines, and connect with your recovery community</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Building Stability</h3>
              <p className="text-gray-600">Focus on employment, strengthening recovery habits, and developing life skills</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transition Planning</h3>
              <p className="text-gray-600">Prepare for independent living with continued recovery support network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Continue Your Recovery?</h2>
          <p className="text-xl text-green-100 mb-8">
            Take the next step in your recovery journey. Our sober living community provides the support and structure you need to build lasting sobriety.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors"
            >
              Apply for Recovery Housing
            </Link>
            <a 
              href="tel:+1-310-488-5280" 
              className="bg-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
            >
              Call Now: (310) 488-5280
            </a>
          </div>
          
          <p className="text-green-200 mt-6 text-sm">
            Crisis support available 24/7 for individuals in recovery
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FH</span>
            </div>
            <span className="text-2xl font-bold">Forward Horizon</span>
          </div>
          <p className="text-gray-400 mb-6">Supporting your recovery journey with safe, sober living</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8">
            <a href="tel:+1-310-488-5280" className="text-green-400 hover:text-green-300 font-semibold">
              📞 (310) 488-5280
            </a>
            <Link href="/contact" className="text-green-400 hover:text-green-300">
              📧 Contact Form
            </Link>
            <Link href="https://theforwardhorizon.com" className="text-green-400 hover:text-green-300">
              🌐 theforwardhorizon.com
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              Serving Los Angeles, Orange, Riverside & San Bernardino Counties & Surrounding Areas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}