import { Metadata } from 'next'
import ClientAnalytics from '@/components/ClientAnalytics'

export const metadata: Metadata = {
  title: 'Contact Forward Horizon - Quick Assessment & Program Matching',
  description: 'Get matched with the right housing program through our quick assessment. Contact Forward Horizon for transitional housing, veteran support, recovery housing, and reentry services.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientAnalytics pageName="Contact" />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="https://theforwardhorizon.com" className="text-2xl font-bold text-blue-600">Forward Horizon</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://theforwardhorizon.com" className="text-gray-700 hover:text-blue-600">← Back to Main Site</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Get Matched with the Right Program</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Our quick assessment helps us understand your needs and match you with the best housing program for your situation.
            </p>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium">
                ✨ Smart Assessment: Answer a few questions to help us prioritize your request and connect you with the right resources
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form id="contact-form" action="/api/submit-form" method="POST" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      required 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      required 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]" 
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-type" className="block text-sm font-medium text-gray-700 mb-2">I'm interested in: *</label>
                  <select 
                    id="inquiry-type" 
                    name="inquiry_type" 
                    required 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                  >
                    <option value="">Select an option</option>
                    <option value="veteran-housing">Veteran Transitional Housing</option>
                    <option value="sober-living">Sober Living After Detox</option>
                    <option value="Re-Entry-housing">Re-Entry Housing</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="donate">Making a Donation</option>
                    <option value="partner">Community Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Risk Assessment Questions */}
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Help Us Prioritize Your Request</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">When do you need housing assistance? *</label>
                      <select 
                        id="urgency" 
                        name="urgency" 
                        required 
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                      >
                        <option value="">Select timeframe</option>
                        <option value="immediate">Immediately - I have no safe place to stay tonight</option>
                        <option value="within-week">Within the next week - My current situation ends soon</option>
                        <option value="within-month">Within the next month - Planning ahead</option>
                        <option value="future-planning">Future planning - Gathering information for later</option>
                        <option value="not-applicable">Not applicable - Not seeking housing</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="current-situation" className="block text-sm font-medium text-gray-700 mb-2">Which best describes your current situation? *</label>
                      <select 
                        id="current-situation" 
                        name="current_situation" 
                        required 
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                      >
                        <option value="">Select situation</option>
                        <option value="crisis">In crisis - Homeless or unsafe housing</option>
                        <option value="transitioning">Transitioning - Leaving treatment/facility/incarceration</option>
                        <option value="unstable">Unstable housing - May lose current place soon</option>
                        <option value="stable-planning">Stable but planning - Looking ahead</option>
                        <option value="other-support">Other - Volunteering, donating, or partnerships</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="support-needed" className="block text-sm font-medium text-gray-700 mb-2">What type of support do you need most? *</label>
                      <select 
                        id="support-needed" 
                        name="support_needed" 
                        required 
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
                      >
                        <option value="">Select primary need</option>
                        <option value="emergency-housing">Emergency housing placement</option>
                        <option value="program-entry">Help entering a specific program</option>
                        <option value="information">Information about services and eligibility</option>
                        <option value="application-help">Help with applications and paperwork</option>
                        <option value="other-services">Other services or support</option>
                        <option value="giving-back">Want to volunteer or donate</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Please share any additional details that would help us assist you better..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 min-h-[48px] text-base"
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-500 text-center">We'll respond within 24 hours during business days</p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Immediate Help</h4>
                    <p className="text-gray-600">(310) 488-5280</p>
                    <p className="text-sm text-gray-500">24/7 crisis support available</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Info & Applications</h4>
                    <p className="text-gray-600">admin@theforwardhorizon.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Location</h4>
                    <p className="text-gray-600">Serving Los Angeles, Orange, Riverside & San Bernardino Counties & Surrounding Areas</p>
                    <p className="text-sm text-gray-500">Multiple housing locations available</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span>9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span>Emergency only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}