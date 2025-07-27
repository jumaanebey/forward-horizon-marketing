import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">FH</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Forward Horizon Marketing
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive housing solutions for those who need support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/veterans-housing" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🇺🇸</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Veterans Housing</h3>
              <p className="text-gray-600 mb-4">
                Secure, supportive housing for veterans with VA benefits assistance and community support.
              </p>
              <div className="text-blue-600 font-semibold group-hover:text-blue-700">
                Learn More →
              </div>
            </div>
          </Link>

          <Link href="/recovery-housing" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Recovery Housing</h3>
              <p className="text-gray-600 mb-4">
                Safe, substance-free community for individuals in addiction recovery with 24/7 support.
              </p>
              <div className="text-green-600 font-semibold group-hover:text-green-700">
                Learn More →
              </div>
            </div>
          </Link>

          <Link href="/reentry-support" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Re-entry Support</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive support for individuals transitioning back to the community after incarceration.
              </p>
              <div className="text-purple-600 font-semibold group-hover:text-purple-700">
                Learn More →
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Need immediate assistance?</p>
          <a 
            href="tel:+1-626-603-0954" 
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            📞 Call (626) 603-0954
          </a>
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://theforwardhorizon.com" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Visit theforwardhorizon.com →
          </a>
        </div>
      </div>
    </div>
  );
}