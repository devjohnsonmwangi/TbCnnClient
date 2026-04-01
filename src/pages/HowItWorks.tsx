import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiZap, FiBarChart2, FiCheckCircle } from "react-icons/fi";

function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Upload X-ray Images",
      description: "Select and upload chest X-ray images in JPEG, PNG, or WebP format. Our system supports multiple images for comprehensive analysis.",
      icon: FiUpload,
      details: [
        "Supports up to 5 images per analysis",
        "Maximum 10MB per image",
        "Drag and drop or browse from device"
      ]
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our advanced CNN model analyzes the images in real-time, identifying patterns and signs of tuberculosis infection.",
      icon: FiZap,
      details: [
        "Deep learning neural networks",
        "Trained on thousands of medical images",
        "92%+ diagnostic accuracy"
      ]
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive detailed diagnostic reports with confidence scores, affected areas, and visual heatmap analysis.",
      icon: FiBarChart2,
      details: [
        "Confidence score for each image",
        "Affected lung regions identified",
        "Risk level assessment",
        "Heatmap visualization"
      ]
    },
    {
      number: "04",
      title: "Medical Recommendations",
      description: "Get evidence-based recommendations and next steps for patient care and follow-up procedures.",
      icon: FiCheckCircle,
      details: [
        "Specialist consultation guidance",
        "Recommended tests and procedures",
        "Follow-up care instructions",
        "Printable medical report"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered system analyzes chest X-rays to detect tuberculosis with high accuracy.
            Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-12 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Vertical Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-8 top-24 h-32 w-1 bg-gradient-to-b from-emerald-600 to-teal-600 hidden md:block" />
                )}

                <div className="grid md:grid-cols-[100px_1fr] gap-8">
                  {/* Number Circle */}
                  <div className="flex items-start justify-center">
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <IconComponent className="text-3xl text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                    </div>

                    <p className="text-gray-700 text-lg mb-6">{step.description}</p>

                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-600">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why Choose Our System?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 mb-3">92%+</div>
              <p className="text-gray-700 font-semibold">Diagnostic Accuracy</p>
              <p className="text-gray-600 text-sm mt-2">Trained on thousands of medical images</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-3">30s</div>
              <p className="text-gray-700 font-semibold">Analysis Time</p>
              <p className="text-gray-600 text-sm mt-2">Real-time results within seconds</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-3">100%</div>
              <p className="text-gray-700 font-semibold">Confidential</p>
              <p className="text-gray-600 text-sm mt-2">HIPAA-compliant data handling</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-3">⚠️ For Physicians Only</h3>
            <p className="text-blue-800">
              This system is designed exclusively for use by licensed healthcare professionals. 
              Results should be used to support clinical judgment, not replace professional medical evaluation.
            </p>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-3">🔒 Data Privacy</h3>
            <p className="text-emerald-800">
              All patient data and medical images are encrypted and stored securely. 
              We comply with HIPAA and international data protection standards.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transition text-lg"
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
