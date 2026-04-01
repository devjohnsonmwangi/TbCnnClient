import React from "react";
import { FiArrowLeft, FiCoffee, FiLock, FiSettings, FiEye, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 sm:pt-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-6 transition">
            <FiArrowLeft className="text-xl" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-3">Cookies and Tracking Policy</h1>
          <p className="text-green-100">Last updated: March 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiCoffee className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Understanding Our Use of Cookies</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            E-Afya TB Detection System uses cookies and similar tracking technologies to enhance your experience, improve our services, and understand how users interact with our platform. This Cookies Policy explains what cookies are, what we use them for, and how you can manage your cookie preferences.
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit our website or use our application. They help websites remember information about your visit, such as your preferences, login information, and browsing habits.
            </p>
            <p>
              Cookies can be either "session cookies" that expire when you close your browser, or "persistent cookies" that remain on your device for a specified period of time.
            </p>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FiSettings className="text-green-600" />
            Types of Cookies We Use
          </h2>

          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Essential Cookies</h3>
              <p className="text-gray-700 mb-2">
                These cookies are necessary for the basic functionality of E-Afya. Without them, certain features would not work properly.
              </p>
              <p className="text-sm text-gray-600">
                Examples: Session cookies that keep you logged in, security tokens, CSRF protection cookies
              </p>
            </div>

            {/* Performance Cookies */}
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Performance and Analytics Cookies</h3>
              <p className="text-gray-700 mb-2">
                We use these cookies to understand how users interact with our platform. This helps us improve performance, detect errors, and optimize user experience.
              </p>
              <p className="text-sm text-gray-600">
                Examples: Google Analytics cookies, heatmapping tools, crash reporting software
              </p>
            </div>

            {/* Preference Cookies */}
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Preference Cookies</h3>
              <p className="text-gray-700 mb-2">
                These cookies remember your settings and preferences so you don't have to reconfigure them each visit.
              </p>
              <p className="text-sm text-gray-600">
                Examples: Language preferences, theme settings, layout customizations
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Marketing and Advertising Cookies</h3>
              <p className="text-gray-700 mb-2">
                We use these cookies to deliver relevant content and advertisements. They also help us measure the effectiveness of our marketing campaigns.
              </p>
              <p className="text-sm text-gray-600">
                Examples: Social media tracking, retargeting pixels, conversion tracking
              </p>
            </div>

            {/* Third-Party Cookies */}
            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">5. Third-Party Cookies</h3>
              <p className="text-gray-700 mb-2">
                Third-party service providers may set their own cookies when you use E-Afya. These include payment processors, analytics providers, and social media platforms.
              </p>
              <p className="text-sm text-gray-600">
                Examples: Stripe payment cookies, Google Maps, embedded social media widgets
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Cookies */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FiEye className="text-green-600" />
            How We Use Cookie Information
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Authenticate your identity and maintain secure login sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Remember your preferences and settings across sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Analyze usage patterns to improve our platform's performance</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Measure the effectiveness of our marketing campaigns</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Provide personalized content and recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Detect and prevent fraudulent activity</span>
            </li>
          </ul>
        </section>

        {/* Cookie Consent */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Consent</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              When you first visit E-Afya, we display a cookie consent banner asking for your permission to use different types of cookies. You can:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Accept all cookies</li>
              <li>• Accept only essential cookies</li>
              <li>• Customize your cookie preferences</li>
              <li>• Reject non-essential cookies</li>
            </ul>
            <p className="mt-4">
              Essential cookies cannot be disabled as they are necessary for the platform to function properly. However, you can disable all other types of cookies if you prefer.
            </p>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FiLock className="text-green-600" />
            How to Manage Cookies
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold mb-2">Through E-Afya:</p>
              <p>You can manage your cookie preferences anytime through your account settings. We provide easy-to-use controls to enable or disable different cookie categories.</p>
            </div>

            <div>
              <p className="font-semibold mb-2">Through Your Browser:</p>
              <p>Most web browsers allow you to control cookies through their settings. You can typically:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>View all cookies stored on your device</li>
                <li>Delete cookies individually or in bulk</li>
                <li>Block certain websites from setting cookies</li>
                <li>Set your browser to ask before accepting cookies</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Important Note:</p>
              <p>
                Disabling essential cookies may affect the functionality of E-Afya and prevent you from using certain features. We recommend keeping essential cookies enabled to ensure the platform works properly.
              </p>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Retention</h2>
          <p className="text-gray-700 mb-4">
            Different types of cookies are retained for different periods:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Session cookies: Deleted when you close your browser</li>
            <li>• Essential cookies: Retained for as long as your account exists</li>
            <li>• Analytics cookies: Typically retained for up to 24 months</li>
            <li>• Preference cookies: Retained for up to 2 years</li>
            <li>• Marketing cookies: Retained for up to 12 months</li>
          </ul>
        </section>

        {/* Updates to Policy */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this Cookies Policy periodically to reflect changes in technology, regulations, or our practices. We will notify you of significant changes through email or a prominent notice on our platform.
          </p>

          <div className="border-t border-green-300 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Questions About Cookies?</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@eafyatb.com</p>
              <p><strong>Address:</strong> orbytetech solutions, Privacy Team</p>
              <p><strong>Phone:</strong> +1-800-EAFYA-TB</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CookiesPolicy;
