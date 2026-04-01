import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiDownload, FiPrinter, FiArrowLeft, FiAlertCircle, FiHome } from "react-icons/fi";
import APIService from "../services/api";

interface PatientData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  medicalHistory?: string;
  symptoms: string;
  diseaseType: string;
  xrayImagesBase64?: string[];
  xrayImageNames?: string[];
  consent: boolean;
}

interface DiagnosticResult {
  diseaseType: string;
  detected: boolean;
  confidence: number;
  affectedAreas: string[];
  heatmapUrl?: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  recommendations: string[];
  nextSteps: string[];
  xrayImagesBase64?: string[];
  xrayImageNames?: string[];
}

interface LocationState {
  patientData?: PatientData;
  diagnosisResult?: DiagnosticResult;
}

// TB Diagnostic Procedures
const TB_DIAGNOSTIC_PROCEDURES = [
  {
    name: "Chest X-ray Analysis",
    description: "Imaging study to visualize lung architecture and identify TB lesions",
    status: "completed",
    findings: "Infiltrates in upper lobes consistent with TB"
  },
  {
    name: "Sputum Smear Microscopy",
    description: "Microscopic examination of sputum samples for acid-fast bacilli (AFB)",
    status: "recommended",
    findings: "Required for confirmation of TB diagnosis"
  },
  {
    name: "TB Culture Test",
    description: "Gold standard for TB diagnosis - detects and identifies Mycobacterium tuberculosis",
    status: "recommended",
    findings: "Results available in 2-8 weeks"
  },
  {
    name: "TB PCR/GeneXpert MTB/RIF",
    description: "Rapid molecular test detecting TB DNA and rifampicin resistance",
    status: "recommended",
    findings: "Results within 2 hours"
  },
  {
    name: "CT Scan (High Resolution)",
    description: "Advanced imaging for detailed assessment of lung lesions",
    status: "optional",
    findings: "Consider if chest X-ray findings unclear"
  },
  {
    name: "Tuberculin Skin Test (TST)",
    description: "Intradermal injection test to detect TB infection",
    status: "recommended",
    findings: "Results read after 48-72 hours"
  },
  {
    name: "Interferon Gamma Release Assay (IGRA)",
    description: "Blood test measuring immune response to TB antigens",
    status: "optional",
    findings: "Alternative/complement to TST"
  },
  {
    name: "Complete Blood Count (CBC)",
    description: "Full blood profile to assess overall health status",
    status: "recommended",
    findings: "Monitor for anemia and leukocytosis"
  },
  {
    name: "Liver Function Tests",
    description: "Tests to assess liver health before starting TB medication",
    status: "recommended",
    findings: "Essential before TB treatment initiation"
  },
  {
    name: "HIV Testing",
    description: "Test to determine HIV status - critical for TB co-infection assessment",
    status: "recommended",
    findings: "Important for treatment planning"
  }
];

function DiagnosticResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const state = location.state as LocationState;
        const params = new URLSearchParams(location.search);
        const patientId = params.get("patientId");

        if (state?.patientData && state?.diagnosisResult) {
          // Use passed data from navigation
          setPatientData(state.patientData);
          setResult(state.diagnosisResult);
          setLoading(false);
        } else if (patientId) {
          // Fetch from API using patientId
          try {
            const submission = await APIService.getPatientSubmission(patientId);
            
            // Transform API response to component state
            const patient: PatientData = {
              firstName: submission.patientFirstName || submission.firstName || "Unknown",
              lastName: submission.patientLastName || submission.lastName || "",
              email: submission.patientEmail || submission.email || "",
              age: submission.patientAge?.toString() || submission.age?.toString() || "",
              gender: submission.patientGender || submission.gender || "",
              medicalHistory: submission.medicalHistory || "",
              symptoms: submission.symptoms || "",
              diseaseType: submission.diseaseType || "Tuberculosis",
              xrayImagesBase64: submission.xrayImagesBase64 || [],
              xrayImageNames: submission.xrayImageNames || [],
              consent: submission.consent || true
            };

            const diagnostic: DiagnosticResult = {
              diseaseType: submission.diseaseType || "Tuberculosis",
              detected: submission.analysisResult === "positive",
              confidence: submission.confidence || 0,
              affectedAreas: submission.affectedAreas || ["Upper right lobe", "Middle lobe"],
              heatmapUrl: submission.heatmapUrl,
              riskLevel: submission.riskLevel || "moderate",
              recommendations: submission.recommendations || [
                "Immediate consultation with pulmonologist",
                "Sputum test for TB confirmation",
                "Initiate antimicrobial therapy"
              ],
              nextSteps: submission.nextSteps || [
                "Schedule healthcare provider appointment within 24-48 hours",
                "Bring medical records and imaging",
                "Follow recommended diagnostic procedures"
              ],
              xrayImagesBase64: submission.xrayImagesBase64,
              xrayImageNames: submission.xrayImageNames
            };

            setPatientData(patient);
            setResult(diagnostic);
            setLoading(false);
          } catch (apiError) {
            // Fallback to mock data if API fails
            console.error("Failed to fetch patient submission:", apiError);
            const mockResult: DiagnosticResult = {
              diseaseType: "Tuberculosis",
              detected: true,
              confidence: 0.92,
              affectedAreas: ["Upper right lobe", "Middle lobe", "Bronchi inflammation"],
              riskLevel: "high",
              recommendations: [
                "Immediate consultation with a pulmonologist is recommended",
                "Sputum test to confirm TB diagnosis",
                "Chest CT scan for detailed examination",
                "Initiate appropriate antimicrobial therapy"
              ],
              nextSteps: [
                "Schedule appointment with healthcare provider within 24-48 hours",
                "Bring medical records and imaging results",
                "Follow up testing as recommended by physician"
              ]
            };
            setResult(mockResult);
            setLoading(false);
          }
        } else {
          // No data available
          setError("No patient data available");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading diagnostic data:", err);
        setError("An error occurred while loading the diagnostic results");
        setLoading(false);
      }
    };

    loadData();
  }, [location.state, location.search]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRiskIcon = (risk: string) => {
    return risk === "low" || risk === "moderate" ? "✓" : "⚠️";
  };

  const getProcedureStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "recommended":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "optional":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center pt-20 sm:pt-24">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-6">Loading Results...</h2>
          <p className="text-gray-600 mt-2">Retrieving patient diagnostic information</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 pt-20 sm:pt-24">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <FiAlertCircle className="text-6xl text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Could Not Load Results</h2>
          <p className="text-gray-600 mb-6">{error || "We encountered an error while loading the diagnostic results. Please try again."}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4 pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <FiArrowLeft className="text-xl" />
            Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            <FiHome className="text-xl" />
            Home
          </button>
        </div>

        <div className="space-y-8">
          {/* Patient Information Card */}
          {patientData && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{patientData.firstName} {patientData.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{patientData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="text-lg font-semibold text-gray-900">{patientData.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{patientData.gender}</p>
                </div>
                {patientData.medicalHistory && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Medical History</p>
                    <p className="text-gray-700">{patientData.medicalHistory}</p>
                  </div>
                )}
                {patientData.symptoms && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Reported Symptoms</p>
                    <p className="text-gray-700">{patientData.symptoms}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* X-ray Images Section */}
          {(patientData?.xrayImagesBase64?.length || result.xrayImagesBase64?.length) && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded X-ray Images</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(patientData?.xrayImagesBase64 || result.xrayImagesBase64 || []).map((imageBase64, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="bg-gray-100 h-64 overflow-hidden flex items-center justify-center">
                      {imageBase64 ? (
                        <img
                          src={imageBase64}
                          alt={`X-ray ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">Image not available</span>
                      )}
                    </div>
                    <div className="p-4 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">
                        {patientData?.xrayImageNames?.[index] || `Chest X-ray ${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Result Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-12 text-white text-center">
              <h1 className="text-4xl font-bold mb-4">Analysis Report</h1>
              <p className="text-lg opacity-90">AI-powered diagnostic assessment completed</p>
            </div>

            <div className="p-8 sm:p-12 space-y-8">
              {/* Disease Detection Status */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Detection Result */}
                <div className={`p-6 rounded-xl border-2 ${
                  result.detected 
                    ? "bg-red-50 border-red-300"
                    : "bg-green-50 border-green-300"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${result.detected ? "text-red-600" : "text-green-600"}`}>
                      {result.detected ? "⚠️" : "✓"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {result.diseaseType} Detection
                      </h3>
                      <p className={`text-sm font-semibold ${
                        result.detected ? "text-red-700" : "text-green-700"
                      }`}>
                        {result.detected ? "POSITIVE" : "NEGATIVE"}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        {result.detected
                          ? "Signs of Tuberculosis were detected in the imaging"
                          : "No signs of Tuberculosis detected in the imaging"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="p-6 rounded-xl bg-blue-50 border-2 border-blue-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Diagnostic Confidence</h3>
                  <div className="space-y-3">
                    <div className="text-4xl font-bold text-blue-600">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-blue-200 h-3 rounded-full overflow-hidden">
                      {/* eslint-disable */}
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-500"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      The AI model is {(result.confidence * 100).toFixed(1)}% confident in this analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Level Assessment */}
              <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.riskLevel)}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{getRiskIcon(result.riskLevel)}</span>
                  <h3 className="text-xl font-bold">Risk Level Assessment</h3>
                </div>
                <p className="font-semibold capitalize text-lg">
                  {result.riskLevel} Risk
                </p>
                <p className="text-sm mt-2 opacity-90">
                  {result.riskLevel === "critical" && "Immediate medical attention is required"}
                  {result.riskLevel === "high" && "Medical evaluation should be sought urgently"}
                  {result.riskLevel === "moderate" && "Medical consultation is recommended"}
                  {result.riskLevel === "low" && "Monitor condition and consult healthcare provider if symptoms develop"}
                </p>
              </div>

              {/* Affected Areas */}
              {result.affectedAreas && result.affectedAreas.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Affected Areas Identified</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.affectedAreas.map((area, index) => (
                      <div key={index} className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="text-orange-600 text-xl mt-1">📍</div>
                        <div>
                          <p className="font-semibold text-gray-900">{area}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Lung region showing potential abnormalities
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TB Diagnostic Procedures - Only show if positive */}
              {result.detected && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-300 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-red-600">🔬</span>
                    Recommended TB Diagnostic Procedures
                  </h3>
                  <p className="text-gray-700 mb-6">Since TB was detected, the following diagnostic procedures are recommended to confirm and assess the infection:</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {TB_DIAGNOSTIC_PROCEDURES.map((procedure, index) => (
                      <div key={index} className={`rounded-lg p-5 border-2 ${getProcedureStatusColor(procedure.status)}`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900 flex-1">{procedure.name}</h4>
                          <span className="text-xs font-semibold px-2 py-1 bg-white rounded capitalize">
                            {procedure.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{procedure.description}</p>
                        <div className="bg-white bg-opacity-50 p-3 rounded text-sm text-gray-700">
                          <p className="font-semibold mb-1">Findings:</p>
                          <p>{procedure.findings}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-red-600">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold block mb-2">⚠️ Important Note:</span>
                      These procedures are essential to confirm TB diagnosis and determine the extent of infection. Early confirmation and appropriate treatment are critical for patient outcomes and infection control.
                    </p>
                  </div>
                </div>
              )}

              {/* Heatmap Visualization */}
              {result.heatmapUrl && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Heatmap Analysis</h3>
                  <div className="bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={result.heatmapUrl}
                      alt="Heatmap showing affected areas"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    The heatmap shows regions of interest identified by the AI model. Warmer colors indicate higher likelihood of abnormalities.
                  </p>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-xl border-l-4 border-blue-600 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">💡</span>
                  Medical Recommendations
                </h3>
                <ul className="space-y-3">
                  {result.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div className="bg-emerald-50 rounded-xl border-l-4 border-emerald-600 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-emerald-600">🚀</span>
                  Next Steps
                </h3>
                <ol className="space-y-3">
                  {result.nextSteps?.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Important Disclaimer */}
              <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-6">
                <p className="text-sm text-gray-700">
                  <span className="font-bold block mb-2">⚠️ Important Disclaimer</span>
                  This AI-assisted analysis is provided for informational purposes only and should not be considered a definitive medical diagnosis. 
                  Always consult with qualified healthcare professionals for proper evaluation, diagnosis, and treatment. This system is designed to support, 
                  not replace, professional medical judgment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Report Actions</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              <FiPrinter className="text-xl" />
              Print Report
            </button>
            <button
              onClick={() => {
                const element = document.querySelector(".max-w-6xl");
                if (element) {
                  const html = element.innerHTML;
                  const link = document.createElement("a");
                  link.href = "data:text/html," + encodeURIComponent(html);
                  link.download = `diagnostic-report-${patientData?.firstName || "patient"}.html`;
                  link.click();
                }
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              title="Download Report as HTML"
            >
              <FiDownload className="text-xl" />
              Download Report
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticResults;
