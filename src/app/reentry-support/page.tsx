import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Re-entry Support | Forward Horizon - Transitional Housing After Incarceration',
  description: 'Comprehensive re-entry support and transitional housing for individuals returning to the community. Second chances, stable housing, and pathway to independence.',
};

export default function ReentrySupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">Forward Horizon</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-purple-600">← Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-6 py-3 rounded-full text-lg font-semibold mb-8">
              🏠 Re-entry Support
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Your Fresh Start Begins Here
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Your past doesn't define your future. We provide the stable housing, support, and resources you need to successfully reintegrate into the community and build the life you deserve.
            </p>
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Complete Re-entry Support</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe Housing</h3>
              <p className="text-gray-600">Secure transitional housing while you establish stability and independence</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Employment Support</h3>
              <p className="text-gray-600">Job placement with second-chance employers and skills training programs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Documentation Help</h3>
              <p className="text-gray-600">Assistance obtaining ID, Social Security card, birth certificate, and other essential documents</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Support</h3>
              <p className="text-gray-600">Connections to legal aid, expungement resources, and understanding your rights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Features</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Case Management</h4>
                    <p className="text-gray-600">Dedicated case manager to help navigate systems and coordinate services</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Financial Literacy</h4>
                    <p className="text-gray-600">Budget management, banking setup, credit repair, and financial planning education</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Healthcare Access</h4>
                    <p className="text-gray-600">Help enrolling in health insurance and connecting with medical and mental health services</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Transportation Assistance</h4>
                    <p className="text-gray-600">Help with transportation to work, appointments, and essential services</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Family Reunification</h4>
                    <p className="text-gray-600">Support with rebuilding family relationships and parenting resources</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
              <div className="bg-white border border-purple-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-purple-900 mb-3">Second Chances. New Beginnings.</h4>
                <p className="text-purple-800">
                  We believe in redemption and the power of transformation. Our evidence-based re-entry program provides the comprehensive support needed for successful community reintegration.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-900">Program Length</span>
                  <span className="text-purple-600 font-semibold">Up to 24 months</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-900">Case Manager Ratio</span>
                  <span className="text-purple-600 font-semibold">1:15 clients</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-900">Support Hours</span>
                  <span className="text-purple-600 font-semibold">24/7 availability</span>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-purple-200">
                  <span className="font-medium text-gray-900">Follow-up Support</span>
                  <span className="text-purple-600 font-semibold">12 months post-exit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Re-entry Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Your Re-entry Journey</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-purple-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Intake & Assessment</h3>
              <p className="text-gray-600">Comprehensive evaluation of needs, goals, and barriers to success</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-purple-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Stabilization</h3>
              <p className="text-gray-600">Secure housing, documentation, healthcare, and basic needs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Building</h3>
              <p className="text-gray-600">Employment training, education, and life skills development</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-purple-600 font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Independence</h3>
              <p className="text-gray-600">Transition to permanent housing with ongoing support network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Essential Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Documentation Center</h3>
              <p className="text-gray-600 mb-4">Get help obtaining essential documents needed for employment and housing</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• State ID/Driver's License</li>
                <li>• Social Security Card</li>
                <li>• Birth Certificate</li>
                <li>• Passport</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Services</h3>
              <p className="text-gray-600 mb-4">Build financial stability and independence with comprehensive support</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bank Account Setup</li>
                <li>• Budget Planning</li>
                <li>• Credit Repair</li>
                <li>• Tax Preparation</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Education & Training</h3>
              <p className="text-gray-600 mb-4">Develop skills and credentials for better employment opportunities</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GED Preparation</li>
                <li>• Vocational Training</li>
                <li>• Computer Skills</li>
                <li>• Industry Certifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready for Your Fresh Start?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Your past doesn't define your future. Take the first step toward building the independent, successful life you deserve with comprehensive re-entry support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors"
            >
              Apply for Re-entry Support
            </Link>
            <a 
              href="tel:+1-626-603-0954" 
              className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
            >
              Call Now: (626) 603-0954
            </a>
          </div>
          
          <p className="text-purple-200 mt-6 text-sm">
            Confidential support available 24/7 for re-entry planning
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FH</span>
            </div>
            <span className="text-2xl font-bold">Forward Horizon</span>
          </div>
          <p className="text-gray-400 mb-6">Believing in second chances and new beginnings</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8">
            <a href="tel:+1-626-603-0954" className="text-purple-400 hover:text-purple-300 font-semibold">
              📞 (626) 603-0954
            </a>
            <Link href="/contact" className="text-purple-400 hover:text-purple-300">
              📧 Contact Form
            </Link>
            <Link href="https://theforwardhorizon.com" className="text-purple-400 hover:text-purple-300">
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