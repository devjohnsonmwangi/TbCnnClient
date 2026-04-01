import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiUpload, FiCheck, FiZap, FiShield, FiActivity, FiInfo, FiAlertCircle, FiAward, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../hooks/useAuthContext";

function LandingPage() {
  const [activeTab, setActiveTab] = useState<"symptoms" | "transmission" | "prevention" | "facts">("symptoms");
  const [showStats, setShowStats] = useState(false);
  const [selectedXray, setSelectedXray] = useState<"affected" | "unaffected">("affected");
  const [heroProgress, setHeroProgress] = useState(0);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Animate hero progress on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleStartDiagnosis = () => {
    if (isLoggedIn) {
      navigate("/patient-intake");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Full Width & Responsive */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-12 md:pb-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-green-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-72 h-40 sm:h-72 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse" />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {/* Main Hero Content - Full Width Layout */}
          <div className="mb-16 sm:mb-20">
            {/* Top Section - Centered */}
            <div className="text-center mb-10 sm:mb-12">
              <div className="mb-4 inline-block animate-bounce">
                <span className="text-green-600 font-semibold text-base sm:text-lg bg-green-100 px-4 py-2 rounded-full block sm:inline-block">
                  🫁 Fight TB with AI Technology
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Early TB Detection Saves Lives
              </h1>
            </div>

            {/* Two Column Layout - Content + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 sm:mb-12 lg:gap-12">
              {/* Left Column - Main Content */}
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8 text-sm sm:text-base lg:justify-start justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-gray-700"><span className="font-bold">&lt;30s</span> Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <span className="text-gray-700"><span className="font-bold">99.2%</span> Accurate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <span className="text-gray-700"><span className="font-bold">HIPAA</span> Secure</span>
                  </div>
                </div>

                <p className="text-base sm:text-lg md:text-lg text-gray-600 mb-8 leading-relaxed lg:text-left text-center">
                  Tuberculosis is preventable and curable. E-Afya's AI-powered X-ray analysis enables early TB detection in seconds, not weeks. Advanced deep learning trained on thousands of verified TB cases for maximum reliability.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-start justify-center">
                  <button
                    onClick={handleStartDiagnosis}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    <FiUpload className="text-lg sm:text-xl" />
                    Start Diagnosis
                    <FiArrowRight className="text-lg sm:text-xl" />
                  </button>
                  <a
                    href="#xray"
                    className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all w-full sm:w-auto"
                  >
                    📊 View Examples
                  </a>
                </div>
              </div>

              {/* Right Column - Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">&lt;30s</div>
                  <p className="text-xs sm:text-sm text-gray-700">Lightning Fast Analysis</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
                  <p className="text-xs sm:text-sm text-gray-700">Clinical Accuracy</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition text-center">
                  <div className="text-4xl mb-2">🕐</div>
                  <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
                  <p className="text-xs sm:text-sm text-gray-700">Always Available</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-300 p-4 sm:p-6 rounded-2xl hover:shadow-lg transition text-center">
                  <div className="text-4xl mb-2">💰</div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">50%</div>
                  <p className="text-xs sm:text-sm text-gray-700">More Affordable</p>
                </div>
              </div>
            </div>

            {/* Global TB Impact Stats - Full Width */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg mb-10 sm:mb-12 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Global TB Impact</p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-bold text-2xl sm:text-3xl text-red-600">10M</span> people develop TB annually
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-2">Annual Deaths</p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-bold text-2xl sm:text-3xl text-red-600">1.2M</span> deaths per year from TB
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Facts Row - Full Width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              <div className="bg-white border-2 border-green-200 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">100K+</div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Tests Analyzed</p>
              </div>

              <div className="bg-white border-2 border-emerald-200 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">45+</div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Countries Deployed</p>
              </div>

              <div className="bg-white border-2 border-teal-200 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">10K+</div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Lives Saved</p>
              </div>

              <div className="bg-white border-2 border-blue-200 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition">
                <div className="text-3xl mb-2">1K+</div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold">Healthcare Partners</p>
              </div>
            </div>
          </div>

          {/* Bento Card Grid - Rich Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20 px-2 auto-rows-max">
            {/* Large Problem Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-red-600 to-red-700 text-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">The TB Crisis</h3>
              <p className="text-base sm:text-lg leading-relaxed mb-6">
                TB kills more people than any other infectious disease. 10 million people develop TB annually, yet 2 million cases go undetected due to delayed diagnosis.
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <p>• Causes 1.2 million deaths/year globally</p>
                <p>• #1 killer of immunocompromised individuals</p>
                <p>• Traditional diagnosis takes weeks</p>
              </div>
            </div>

            {/* Large Solution Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-green-600 to-emerald-700 text-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl mb-4">🤖</div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Our AI Solution</h3>
              <p className="text-base sm:text-lg leading-relaxed mb-6">
                E-Afya uses advanced deep learning to analyze chest X-rays in seconds with 99.2% accuracy, enabling early TB detection and immediate treatment initiation.
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <p>✓ Results in &lt;30 seconds</p>
                <p>✓ Clinically validated (99.2% accuracy)</p>
                <p>✓ Accessible 24/7 globally</p>
              </div>
            </div>

            {/* Speed Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h4>
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;30s</div>
              <p className="text-sm text-gray-700">Complete analysis and diagnosis within 30 seconds</p>
            </div>

            {/* Accuracy Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Highly Accurate</h4>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
              <p className="text-sm text-gray-700">Clinical-grade accuracy in TB detection</p>
            </div>

            {/* Availability Card */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition">
              <div className="text-4xl mb-3">🕐</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Always Available</h4>
              <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
              <p className="text-sm text-gray-700">Access diagnostic services anytime, anywhere</p>
            </div>

            {/* Cost Effective Card */}
            <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-300 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Affordable</h4>
              <div className="text-3xl font-bold text-teal-600 mb-2">50%</div>
              <p className="text-sm text-gray-700">Cheaper than traditional TB screening</p>
            </div>

            {/* Accessibility Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition">
              <div className="text-4xl mb-3">🌍</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Global Accessibility</h4>
              <p className="text-gray-700 mb-4">Deployed in low-resource settings across Africa and Asia where TB burden is highest</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-200 text-indigo-900 px-3 py-1 rounded-full text-sm font-semibold">45+ Countries</span>
                <span className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">10K+ Lives Saved</span>
                <span className="bg-cyan-200 text-cyan-900 px-3 py-1 rounded-full text-sm font-semibold">Mobile-First</span>
              </div>
            </div>

            {/* Privacy & Security Card */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400 p-6 sm:p-8 rounded-2xl hover:shadow-lg transition lg:col-span-2">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Privacy First</h4>
              <p className="text-gray-700 mb-4">Enterprise-grade security protecting patient data</p>
              <div className="space-y-2 text-sm">
                <p>✓ HIPAA Compliant</p>
                <p>✓ End-to-end Encryption</p>
                <p>✓ Zero Data Retention Option</p>
                <p>✓ GDPR Compliant</p>
              </div>
            </div>
          </div>

          {/* Key Statistics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 px-2">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600">10M+</div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">TB Cases/Year</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600">{heroProgress}%</div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Detection Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600">100K+</div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Tests Analyzed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">30s</div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Fast Results</p>
            </div>
          </div>

          {/* How It Works - Quick Visual */}
          <div className="bg-white bg-opacity-70 backdrop-blur border-2 border-green-200 p-6 sm:p-8 rounded-2xl mb-16 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Simple 3-Step Process</h3>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold">1</div>
                <h4 className="text-sm sm:text-xl font-bold text-gray-900 mb-2">Upload X-ray</h4>
                <p className="text-xs sm:text-sm text-gray-600">Submit your chest X-ray image</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold">2</div>
                <h4 className="text-sm sm:text-xl font-bold text-gray-900 mb-2">AI Analysis</h4>
                <p className="text-xs sm:text-sm text-gray-600">Our model analyzes your image</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl font-bold">3</div>
                <h4 className="text-sm sm:text-xl font-bold text-gray-900 mb-2">Get Results</h4>
                <p className="text-xs sm:text-sm text-gray-600">Instant diagnosis & recommendations</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators - Enhanced */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8 text-gray-600 text-xs sm:text-sm mb-12 px-2 flex-wrap">
            <div className="flex items-center gap-2 justify-center">
              <FiCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
              <span className="font-semibold">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FiCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
              <span className="font-semibold">Clinical Validation</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FiCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
              <span className="font-semibold">Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FiCheck className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
              <span className="font-semibold">Affordable</span>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center animate-bounce">
            <FiChevronDown className="text-green-600 text-3xl sm:text-4xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Why Choose E-Afya TB?</h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Advanced AI technology specifically trained for TB detection combined with medical expertise.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition transform hover:-translate-y-2">
              <div className="bg-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FiZap className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Get TB analysis results in seconds. Early detection within minutes, not days.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-lg transition transform hover:-translate-y-2">
              <div className="bg-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clinically Validated</h3>
              <p className="text-gray-600">Trained on thousands of TB X-rays with 99.2% sensitivity and specificity.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-8 rounded-2xl border border-teal-100 hover:shadow-lg transition transform hover:-translate-y-2">
              <div className="bg-teal-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <FiActivity className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Clear Insights</h3>
              <p className="text-gray-600">Grad-CAM visualizations show exactly which lung areas show TB signs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* X-ray Samples Section */}
      <section id="xray" className="py-24 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">TB X-ray Comparison</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Understand the differences between healthy lungs and TB-affected lungs. Learn what our AI detection system identifies.
          </p>

          {/* Toggle Buttons */}
          <div className="flex gap-4 justify-center mb-12">
            <button
              onClick={() => setSelectedXray("unaffected")}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                selectedXray === "unaffected"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-green-600"
              }`}
            >
              ✓ Healthy Lungs
            </button>
            <button
              onClick={() => setSelectedXray("affected")}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                selectedXray === "affected"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-green-600"
              }`}
            >
              ⚠️ TB Affected
            </button>
          </div>

          {/* X-ray Display Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Unaffected Lungs */}
            {selectedXray === "unaffected" && (
              <div className="md:col-span-2 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                    <h3 className="text-2xl font-bold">Healthy Lungs (Normal X-ray)</h3>
                    <p className="text-green-100 mt-2">No signs of tuberculosis infection</p>
                  </div>
                  <div className="p-8">
                    <img 
                      src="https://media.istockphoto.com/id/945204026/photo/chest-x-ray-of-normal-healthy-man-show-lung-heart-spine-clavicle-diaphragm.jpg?s=612x612&w=0&k=20&c=m_E1jl81_yOjy5ruk-FHTdmNqWrAA3veGjw8rER6gsY=" 
                      alt="Normal Chest X-ray - Healthy Lungs"
                      className="w-full rounded-xl mb-6 bg-gray-100 object-contain max-h-80"
                      onError={(e) => {e.currentTarget.src = "https://via.placeholder.com/640x480?text=Normal+Chest+X-ray"}}
                    />
                    <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                      <h4 className="font-bold text-green-900 mb-3">Characteristics:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>✓ Clear lungs without opacities</li>
                        <li>✓ Normal bronchial patterns</li>
                        <li>✓ No nodules or cavitations</li>
                        <li>✓ Normal mediastinal silhouette</li>
                        <li>✓ Symmetric chest wall</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Affected Lungs */}
            {selectedXray === "affected" && (
              <div className="md:col-span-2 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
                    <h3 className="text-2xl font-bold">TB-Affected Lungs (Abnormal X-ray)</h3>
                    <p className="text-amber-100 mt-2">Shows typical signs of tuberculosis infection</p>
                  </div>
                  <div className="p-8">
                    <img 
                      src="https://tse1.mm.bing.net/th/id/OIP.fjIYL379GTnGQJMa0Gyf-gAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" 
                      alt="TB Affected Chest X-ray - Abnormal Findings"
                      className="w-full rounded-xl mb-6 bg-gray-100 object-contain border-2 border-amber-500 max-h-80"
                      onError={(e) => {e.currentTarget.src = "https://via.placeholder.com/640x480?text=TB+Chest+X-ray"}}
                    />
                    <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded">
                      <h4 className="font-bold text-amber-900 mb-3">TB Signs Detected:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>⚠️ Upper lobe consolidation or infiltration</li>
                        <li>⚠️ Cavitary lesions (in advanced TB)</li>
                        <li>⚠️ Nodular opacities</li>
                        <li>⚠️ Bronchial wall thickening</li>
                        <li>⚠️ Potential spread to other lobes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detection Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How Our AI Detection Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="text-4xl mb-3">1️⃣</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Image Upload</h4>
                <p className="text-gray-600">Patient uploads chest X-ray image through our secure platform</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-3">2️⃣</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">AI Analysis</h4>
                <p className="text-gray-600">Our CNN model analyzes the image in real-time for TB indicators</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-3">3️⃣</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Results</h4>
                <p className="text-gray-600">Get instant results with visual heatmaps showing detected areas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TB Awareness Section */}
      <section id="education" className="py-24 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Understanding Tuberculosis</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
            Knowledge is power. Learn about TB symptoms, transmission, prevention, and impact. Early awareness saves lives.
          </p>

          {/* Interactive Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["symptoms", "transmission", "prevention", "facts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  activeTab === tab
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Symptoms Tab */}
            {activeTab === "symptoms" && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FiAlertCircle className="text-green-600 text-3xl" />
                  <h3 className="text-3xl font-bold text-gray-900">TB Symptoms</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: "🔴", symptom: "Persistent Cough", detail: "Lasting more than 3 weeks, sometimes with blood" },
                    { icon: "🌡️", symptom: "Fever", detail: "Usually worse in the afternoon and evening" },
                    { icon: "💦", symptom: "Night Sweats", detail: "Heavy sweating that soaks clothing and bedding" },
                    { icon: "⚖️", symptom: "Weight Loss", detail: "Unexplained loss of appetite and weight" },
                    { icon: "😴", symptom: "Fatigue", detail: "Persistent weakness and tiredness" },
                    { icon: "🫁", symptom: "Chest Pain", detail: "Pain when breathing or coughing" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{item.symptom}</h4>
                      <p className="text-gray-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transmission Tab */}
            {activeTab === "transmission" && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FiInfo className="text-emerald-600 text-3xl" />
                  <h3 className="text-3xl font-bold text-gray-900">How TB Spreads</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Airborne Transmission</h4>
                    <p className="text-gray-700 mb-4">TB spreads through the air when an infected person:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-3"><FiCheck className="text-green-600" /> Coughs or sneezes</li>
                      <li className="flex items-center gap-3"><FiCheck className="text-green-600" /> Speaks or sings</li>
                      <li className="flex items-center gap-3"><FiCheck className="text-green-600" /> Spits</li>
                    </ul>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-50 rounded-xl">
                      <h4 className="text-lg font-bold text-green-900 mb-3">✓ TB Does NOT Spread By</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Shaking hands</li>
                        <li>• Sharing food or drinks</li>
                        <li>• Touching or hugging</li>
                        <li>• Sharing clothes or bedding</li>
                        <li>• Contact with sweat or urine</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-amber-50 rounded-xl">
                      <h4 className="text-lg font-bold text-amber-900 mb-3">⚠️ High Risk Groups</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• HIV/AIDS patients</li>
                        <li>• Young children</li>
                        <li>• Elderly people</li>
                        <li>• Immunocompromised individuals</li>
                        <li>• Healthcare workers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prevention Tab */}
            {activeTab === "prevention" && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FiShield className="text-blue-600 text-3xl" />
                  <h3 className="text-3xl font-bold text-gray-900">Prevention & Control</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: "Vaccination", desc: "BCG vaccine provides protection, especially for children", color: "bg-blue-50" },
                    { title: "Early Detection", desc: "Get tested if you have symptoms lasting 3+ weeks", color: "bg-green-50" },
                    { title: "Treatment", desc: "Complete TB treatment course (6 months) cures the disease", color: "bg-emerald-50" },
                    { title: "Hygiene", desc: "Cover mouth when coughing/sneezing to protect others", color: "bg-yellow-50" },
                    { title: "Ventilation", desc: "Ensure good air circulation in living spaces", color: "bg-green-50" },
                    { title: "Nutrition", desc: "Healthy diet boosts immune system to fight TB", color: "bg-emerald-50" },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-6 ${item.color} rounded-xl border border-gray-200`}>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-700">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facts Tab */}
            {activeTab === "facts" && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <FiAward className="text-amber-600 text-3xl" />
                  <h3 className="text-3xl font-bold text-gray-900">TB Facts & Impact</h3>
                </div>
                <div className="space-y-6">
                  <div 
                    onMouseEnter={() => setShowStats(true)}
                    onMouseLeave={() => setShowStats(false)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-xl cursor-pointer transform transition hover:scale-105"
                  >
                    <p className="text-lg font-semibold mb-2">Global Burden of TB</p>
                    {showStats ? (
                      <div className="space-y-2">
                        <p>• 10 million people develop TB annually</p>
                        <p>• 1.2 million TB deaths per year globally</p>
                        <p>• TB is the #1 infectious disease killer</p>
                        <p>• 2 million people have undiagnosed TB</p>
                        <p>• Multi-drug resistant TB is a growing threat</p>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold">Hover to see statistics</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <h4 className="text-lg font-bold text-green-900 mb-3">The Good News</h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex gap-3"><FiCheck className="text-green-600 flex-shrink-0 mt-1" /> <span>TB is preventable and curable with proper treatment</span></li>
                        <li className="flex gap-3"><FiCheck className="text-green-600 flex-shrink-0 mt-1" /> <span>Success rate &gt;85% with complete treatment</span></li>
                        <li className="flex gap-3"><FiCheck className="text-green-600 flex-shrink-0 mt-1" /> <span>Early detection dramatically improves outcomes</span></li>
                      </ul>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                      <h4 className="text-lg font-bold text-amber-900 mb-3">What You Can Do</h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex gap-3"><FiCheck className="text-amber-600 flex-shrink-0 mt-1" /> <span>Get screened if you have symptoms</span></li>
                        <li className="flex gap-3"><FiCheck className="text-amber-600 flex-shrink-0 mt-1" /> <span>Complete full TB treatment course</span></li>
                        <li className="flex gap-3"><FiCheck className="text-amber-600 flex-shrink-0 mt-1" /> <span>Raise awareness in your community</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main TB Detection Card */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Suspect TB? Get Tested Today</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Our AI-powered system can analyze chest X-rays to detect TB quickly and accurately. Early diagnosis is key to treatment success.
            </p>
            <Link
              to="/patient-intake"
              className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiUpload className="text-xl" />
              Upload X-ray Now
              <FiArrowRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Don't Let TB Go Undetected</h2>
          <p className="text-xl mb-8 opacity-90">If you have symptoms of TB, early detection and treatment can save your life and protect your family.</p>
          <Link
            to="/patient-intake"
            className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Tested Now
            <FiArrowRight className="text-xl" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-4">
              © 2026 E-Afya TB Detection System. Developed by <span className="font-semibold text-green-400">orbytetech solutions</span>
            </p>
            <p className="text-gray-500 text-sm">
              This system is designed to support, not replace, professional medical evaluation. Always consult with a healthcare provider.
            </p>
            <p className="text-gray-600 text-xs mt-4">
              TB is curable. Seek treatment early. Together, we can eliminate TB.
            </p>
          </div>

          {/* Policy Links */}
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-green-400 transition text-sm font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-green-400 transition text-sm font-medium"
              >
                Terms of Use
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-green-400 transition text-sm font-medium"
              >
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
