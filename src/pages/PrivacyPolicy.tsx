import React from "react";
import { FiArrowLeft, FiShield, FiLock, FiInfo, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 sm:pt-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-6 transition">
            <FiArrowLeft className="text-xl" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-green-100">Last updated: March 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiShield className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Our Commitment to Your Privacy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            At E-Afya TB Detection System, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our application. We are committed to protecting your personal data and ensuring transparency about how we use it.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FiInfo className="text-green-600" />
            Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
              <p className="text-gray-700 mb-2">When you use E-Afya, we may collect:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Name and contact information (email, phone number)</li>
                <li>Age and medical history information you voluntarily provide</li>
                <li>Account credentials for authentication</li>
                <li>Payment information if applicable</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical Data</h3>
              <p className="text-gray-700 mb-2">We collect and process:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Chest X-ray images you upload for analysis</li>
                <li>Analysis results and diagnostic interpretations</li>
                <li>Notes and observations related to your health assessment</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Information</h3>
              <p className="text-gray-700 mb-2">We may automatically collect:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on the application</li>
                <li>IP address and device identifiers</li>
                <li>Interaction patterns and feature usage</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use collected information to:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Provide and improve our TB detection services</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Process your X-ray images and generate diagnostic analyses</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Send you health alerts and medical recommendations</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Conduct research and improve our artificial intelligence models</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Comply with legal obligations and healthcare regulations</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Prevent fraud and enhance security</span>
            </li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiLock className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Data Security and Protection</h2>
          </div>
          <p className="text-gray-700 mb-4">
            We implement comprehensive security measures to protect your information:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✓ End-to-end encryption for all data transmission</li>
            <li>✓ HIPAA-compliant storage and processing systems</li>
            <li>✓ Regular security audits and vulnerability assessments</li>
            <li>✓ Multi-factor authentication for account access</li>
            <li>✓ Restricted access to personal health information</li>
            <li>✓ Secure deletion protocols for archived data</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sharing Your Information</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or share your personal information with third parties except:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• With healthcare providers you authorize for medical consultations</li>
            <li>• With service providers who assist us in operating our application under strict confidentiality agreements</li>
            <li>• When required by law or court order</li>
            <li>• With your explicit written consent</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• Access your personal and medical information</li>
            <li>• Request correction or deletion of inaccurate data</li>
            <li>• Withdraw consent for data processing at any time</li>
            <li>• Request a copy of your data in a portable format</li>
            <li>• Opt-out of non-essential marketing communications</li>
            <li>• Lodge a complaint with regulatory authorities</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="text-gray-700 space-y-2">
            <p><strong>Email:</strong> privacy@eafyatb.com</p>
            <p><strong>Address:</strong> orbytetech solutions, Global Health Division</p>
            <p><strong>Phone:</strong> +1-800-EAFYA-TB</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
