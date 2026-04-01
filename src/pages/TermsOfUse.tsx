import React from "react";
import { FiArrowLeft, FiAlertCircle, FiAlertTriangle, FiAward, FiUser, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";

function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20 sm:pt-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-green-100 hover:text-white mb-6 transition">
            <FiArrowLeft className="text-xl" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-3">Terms of Use</h1>
          <p className="text-green-100">Last updated: March 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiAward className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome to E-Afya TB Detection System</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            These Terms of Use govern your access to and use of the E-Afya TB Detection System, including our website, application, and all related services. By accessing or using E-Afya, you agree to be bound by these terms. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        {/* Medical Disclaimer */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertCircle className="text-amber-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Important Medical Disclaimer</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              E-Afya TB Detection System is designed to assist healthcare professionals in analyzing chest X-rays. However, our platform is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="font-semibold">
              By using this system, you understand and agree that:
            </p>
            <ul className="space-y-2">
              <li>• Our analyses are for informational purposes and must be verified by qualified healthcare professionals</li>
              <li>• You should always consult with a licensed physician before making any healthcare decisions</li>
              <li>• Tuberculosis diagnosis requires clinical evaluation, laboratory tests, and professional medical judgment</li>
              <li>• Users assume full responsibility for decisions made based on our system's output</li>
              <li>• E-Afya is not approved as a diagnostic device and should not be the sole basis for any medical decision</li>
            </ul>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FiUser className="text-green-600" />
            Your Responsibilities
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>When using E-Afya, you agree to:</p>
            <ul className="space-y-2">
              <li>• Provide accurate and complete information</li>
              <li>• Use the system only for lawful purposes</li>
              <li>• Respect the privacy and rights of all users</li>
              <li>• Not attempt to access or modify system components without authorization</li>
              <li>• Not transmit viruses, malware, or any malicious code</li>
              <li>• Comply with all applicable laws and healthcare regulations</li>
              <li>• Ensure you have the right to upload medical images you submit</li>
              <li>• Use the system in compliance with HIPAA and local health information laws</li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              All content, including the E-Afya application, software, artificial intelligence models, text, images, and graphics, are the exclusive property of orbytetech solutions or its licensors. They are protected by international copyright laws.
            </p>
            <p>
              You are granted a limited, non-exclusive, non-transferable license to use E-Afya for personal or professional medical purposes only. You may not reproduce, modify, distribute, or transmit any content without express written permission.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertTriangle className="text-red-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              To the fullest extent permitted by law, E-Afya and orbytetech solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, lost data, or emotional distress, even if we have been advised of the possibility of such damages.
            </p>
            <p>
              E-Afya is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the system will be error-free, uninterrupted, or meet your expectations. Users assume all risks associated with using our platform.
            </p>
          </div>
        </section>

        {/* Data and Images */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Medical Images and Data</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              By uploading X-ray images to E-Afya, you grant us permission to process, analyze, and store these images for the purpose of providing diagnostic analysis. You represent that you have the authority to upload and share these medical images.
            </p>
            <p>
              You can request deletion of your images and data at any time by contacting our privacy team. Each healthcare facility using E-Afya is responsible for maintaining its own copies of original medical records as required by law.
            </p>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unacceptable Uses</h2>
          <p className="text-gray-700 mb-4">You agree not to use E-Afya:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• To facilitate illegal activities or violations of healthcare laws</li>
            <li>• To harass, threaten, or discriminate against any individual</li>
            <li>• For research without proper institutional review board approval</li>
            <li>• To reverse-engineer or extract our AI models</li>
            <li>• To make automated queries without permission</li>
            <li>• To access another user's information without authorization</li>
            <li>• In violation of HIPAA, GDPR, or other privacy regulations</li>
          </ul>
        </section>

        {/* Modifications */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <FiInfo className="text-green-600" />
            Changes to These Terms
          </h2>
          <p className="text-gray-700">
            We may update or modify these Terms of Use at any time. We will notify you of significant changes via email or through a prominent notice on our platform. Your continued use of E-Afya following any changes indicates your acceptance of the new terms.
          </p>
        </section>

        {/* Termination */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
          <p className="text-gray-700">
            We reserve the right to terminate or suspend your access to E-Afya at any time, with or without cause, if we believe you have violated these terms or applicable laws. Upon termination, your right to use the system ceases immediately, though you may request a copy of your data.
          </p>
        </section>

        {/* Governing Law */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Contact</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              These Terms of Use are governed by applicable international laws and local jurisdictions where E-Afya operates. Any legal disputes shall be resolved through arbitration or appropriate legal channels.
            </p>
            <p className="font-semibold mt-6">Questions about these Terms?</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@eafyatb.com</p>
              <p><strong>Address:</strong> orbytetech solutions, Legal Department</p>
              <p><strong>Phone:</strong> +1-800-EAFYA-TB</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TermsOfUse;
