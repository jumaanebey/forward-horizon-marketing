import { Metadata } from 'next';
import Link from 'next/link';
import ClientAnalytics from '@/components/ClientAnalytics';

export const metadata: Metadata = {
  title: 'Veterans Housing | Forward Horizon - Transitional Housing for Veterans',
  description: 'Safe, supportive transitional housing for veterans with VA benefits assistance, peer support, and dedicated case management. Serving those who served.',
};

export default function VeteransHousingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <ClientAnalytics pageName="Veterans Housing" />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">Forward Horizon</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600">← Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold mb-8">
              🇺🇸 For Veterans Only
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Safe, Supportive Housing for Veterans
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Transitioning to civilian life shouldn't be a battle you fight alone. Join a community of veterans who understand your journey and are committed to your success.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What You'll Receive</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe Housing</h3>
              <p className="text-gray-600">Private or shared transitional housing in secure, veteran-friendly facilities</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">VA Benefits Navigation</h3>
              <p className="text-gray-600">Full support with VA benefits, healthcare enrollment, and disability claims</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Peer Support Network</h3>
              <p className="text-gray-600">Connect with fellow veterans who understand your experiences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Support</h3>
              <p className="text-gray-600">Job placement assistance, resume building, and skills training</p>
            </div>
          </div>
        </div>
      </section>


      {/* Program Details */}
      <section className="py-16 bg-white">
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
                    <h4 className="font-semibold text-gray-900 mb-2">24/7 Support Available</h4>
                    <p className="text-gray-600">Crisis support and assistance available around the clock from veteran-friendly staff</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Flexible Stay Length</h4>
                    <p className="text-gray-600">Stay as long as needed while you stabilize and work toward independent housing</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Transportation Assistance</h4>
                    <p className="text-gray-600">Help with transportation to VA appointments, job interviews, and essential services</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mental Health Resources</h4>
                    <p className="text-gray-600">Access to counseling, PTSD support, and connection to VA mental health services</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-blue-900 mb-3">Honor. Respect. Results.</h4>
                <p className="text-blue-800">
                  Forward Horizon is committed to serving those who served. We understand the unique challenges veterans face and provide evidence-based support tailored to your needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-900">Program Duration</span>
                  <span className="text-blue-600 font-semibold">Flexible length</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-900">Support Level</span>
                  <span className="text-blue-600 font-semibold">24/7 availability</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-900">Service Areas</span>
                  <span className="text-blue-600 font-semibold">4 Counties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Take the Next Step?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Your service to our country deserves support. Let us help you secure safe, stable housing and connect with the resources you've earned.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Apply for Veterans Housing
            </Link>
            <a 
              href="tel:+1-310-488-5280" 
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors"
            >
              Call Now: (310) 488-5280
            </a>
          </div>
          
          <p className="text-blue-200 mt-6 text-sm">
            Crisis support available 24/7 for veterans in need
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FH</span>
            </div>
            <span className="text-2xl font-bold">Forward Horizon</span>
          </div>
          <p className="text-gray-400 mb-6">Supporting veterans in their transition to civilian life</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8">
            <a href="tel:+1-310-488-5280" className="text-blue-400 hover:text-blue-300 font-semibold">
              📞 (310) 488-5280
            </a>
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              📧 Contact Form
            </Link>
            <Link href="https://theforwardhorizon.com" className="text-blue-400 hover:text-blue-300">
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