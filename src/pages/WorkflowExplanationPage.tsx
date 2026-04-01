import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";

function WorkflowExplanationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"normal" | "tuberculosis" | "failed">("normal");

  const workflows = {
    normal: {
      title: "Normal X-Ray Workflow",
      color: "green",
      description: "When X-ray is classified as Normal (No TB detected)",
      steps: [
        {
          number: 1,
          title: "Image Upload",
          detail: "Physician uploads chest X-ray",
          time: "Immediate"
        },
        {
          number: 2,
          title: "Format Validation",
          detail: "System validates image format (JPEG/PNG/WebP)",
          time: "< 1 second"
        },
        {
          number: 3,
          title: "ML Preprocessing",
          detail: "Image resized to 224x224, normalized, standardized",
          time: "1-2 seconds"
        },
        {
          number: 4,
          title: "TB Classification",
          detail: "ResNet18 model predicts: Normal (confidence > 80%)",
          time: "10-15 seconds"
        },
        {
          number: 5,
          title: "Result Storage",
          detail: "Diagnosis saved with confidence score",
          time: "< 1 second"
        },
        {
          number: 6,
          title: "Patient View",
          detail: "Results displayed on Patient Details page",
          time: "Immediate"
        },
        {
          number: 7,
          title: "Recommendation",
          detail: "Patient advised for routine follow-up in 12 months",
          time: "Display only"
        }
      ],
      database: ["Create X-Ray record", "Save Diagnosis Result", "Store confidence score", "Update X-Ray status: SUCCESS"]
    },
    tuberculosis: {
      title: "Tuberculosis Positive Workflow",
      color: "red",
      description: "When X-ray is classified as Tuberculosis Positive",
      steps: [
        {
          number: 1,
          title: "TB Detection",
          detail: "Model detects TB (confidence > 20% threshold)",
          time: "10-15 seconds"
        },
        {
          number: 2,
          title: "Trigger TB Workflow",
          detail: "System automatically creates TB workflow record",
          time: "< 1 second"
        },
        {
          number: 3,
          title: "Physician Notification",
          detail: "Physician receives alert: 'TB Suspected - Action Required'",
          time: "Real-time"
        },
        {
          number: 4,
          title: "Schedule Appointment",
          detail: "System automatically schedules urgent follow-up (48 hours)",
          time: "< 1 second"
        },
        {
          number: 5,
          title: "Create Medical Report",
          detail: "System generates comprehensive medical report with recommendations",
          time: "2-3 seconds"
        },
        {
          number: 6,
          title: "Treatment Protocol",
          detail: "TB Treatment Protocol card displayed to physician",
          time: "Display only"
        },
        {
          number: 7,
          title: "Enhanced Monitoring",
          detail: "Patient record flagged for enhanced clinical oversight",
          time: "Persistent"
        },
        {
          number: 8,
          title: "Follow-Up Actions",
          detail: "Recommendations: Sputum test, CT scan, Specialist consult",
          time: "Display only"
        }
      ],
      database: [
        "Create X-Ray record",
        "Save Diagnosis Result (TB Positive)",
        "Create TB Workflow record",
        "Create Follow-up Appointment",
        "Generate Medical Report",
        "Create Notification record",
        "Update Patient status: AT_RISK"
      ]
    },
    failed: {
      title: "Failed Analysis & Resubmission",
      color: "orange",
      description: "When X-ray analysis fails (timeout, model error, etc.)",
      steps: [
        {
          number: 1,
          title: "Analysis Failure",
          detail: "X-ray analysis times out or encounters error",
          time: "Varies"
        },
        {
          number: 2,
          title: "Status Update",
          detail: "X-Ray status marked as FAILED in database",
          time: "Immediate"
        },
        {
          number: 3,
          title: "Error Display",
          detail: "Physician sees error with resubmit button",
          time: "Real-time"
        },
        {
          number: 4,
          title: "Resubmit Selection",
          detail: "Physician can re-analyze stored X-ray OR upload new image",
          time: "User choice"
        },
        {
          number: 5,
          title: "Retry",
          detail: "System retries same image or processes new image",
          time: "10-15 seconds"
        },
        {
          number: 6,
          title: "Success or Retry",
          detail: "Results saved OR error shown again with retry option",
          time: "Real-time"
        },
        {
          number: 7,
          title: "Audit Logging",
          detail: "All retry attempts logged for audit trail",
          time: "< 1 second"
        }
      ],
      database: [
        "Mark X-Ray as FAILED",
        "Store error message",
        "Create X-Ray record (on resubmit)",
        "Log retry attempt",
        "Update analysis results"
      ]
    }
  };

  const currentWorkflow = workflows[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">TB Detection Workflows</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three distinct workflows based on X-ray analysis results
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {(["normal", "tuberculosis", "failed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? tab === "normal"
                    ? "bg-green-600 text-white shadow-lg"
                    : tab === "tuberculosis"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab === "normal" && "✓ Normal Workflow"}
              {tab === "tuberculosis" && "⚠️ TB Positive Workflow"}
              {tab === "failed" && "↻ Failed & Retry"}
            </button>
          ))}
        </div>

        {/* Workflow Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentWorkflow.title}
            </h2>
            <p className="text-gray-600 text-lg">{currentWorkflow.description}</p>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-6">
            {currentWorkflow.steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index !== currentWorkflow.steps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-24 bg-gradient-to-b from-gray-300 to-gray-200 hidden md:block" />
                )}

                <div className="flex gap-6">
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        activeTab === "normal"
                          ? "bg-gradient-to-br from-green-500 to-green-600"
                          : activeTab === "tuberculosis"
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-orange-500 to-orange-600"
                      }`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow pt-2">
                    <div
                      className={`bg-gradient-to-r ${
                        activeTab === "normal"
                          ? "from-green-50 to-emerald-50 border-l-4 border-green-500"
                          : activeTab === "tuberculosis"
                          ? "from-red-50 to-pink-50 border-l-4 border-red-500"
                          : "from-orange-50 to-yellow-50 border-l-4 border-orange-500"
                      } rounded-lg p-4`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {step.title}
                          </h3>
                          <p className="text-gray-700">{step.detail}</p>
                        </div>
                        <div
                          className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                            activeTab === "normal"
                              ? "bg-green-200 text-green-800"
                              : activeTab === "tuberculosis"
                              ? "bg-red-200 text-red-800"
                              : "bg-orange-200 text-orange-800"
                          }`}
                        >
                          {step.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Database Changes */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              💾 Database Operations & Schema Impact
            </h3>
            <div
              className={`${
                activeTab === "normal"
                  ? "bg-green-50 border-2 border-green-200"
                  : activeTab === "tuberculosis"
                  ? "bg-red-50 border-2 border-red-200"
                  : "bg-orange-50 border-2 border-orange-200"
              } rounded-lg p-6 mb-6`}
            >
              <ul className="space-y-3">
                {currentWorkflow.database.map((op, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`text-lg font-bold mt-0.5 ${
                        activeTab === "normal"
                          ? "text-green-600"
                          : activeTab === "tuberculosis"
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-gray-800 font-medium">{op}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed Database Schema Impact Diagram */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-6 font-mono text-xs overflow-x-auto mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4">📊 Table Relationships Affected:</h4>
              <pre className="text-gray-700 whitespace-pre-wrap">
{activeTab === "normal" ? `
NORMAL WORKFLOW - Database Impact:

┌─────────────────┐         ┌──────────────────┐         ┌─────────────────────┐
│   PATIENTS      │────────►│    X_RAYS        │────────►│ DIAGNOSIS_RESULTS   │
│   (Unchanged)   │  Create │  (Create with    │  Create │ (Store: Normal)     │
│                 │         │   Status: SUCCESS)│         │ (Confidence: >80%)  │
│                 │         │                  │         │                     │
│ id: 1           │         │ patientId: 1     │         │ xrayId: 1           │
│ physicianId: 5  │         │ uploadedAt: now  │         │ prediction: Normal  │
│ name: John Doe  │         │ fileSize: 2.5MB  │         │ confidence: 0.92    │
└─────────────────┘         └──────────────────┘         └─────────────────────┘
                                                                    │
                                                                    └──► (No TB Workflow created)

DATABASE WRITE OPERATIONS: 2 tables modified
├─ INSERT into x_rays (patientId, imageBase64, uploadedAt, status)
└─ INSERT into diagnosis_results (xrayId, prediction, confidence, modelName)

NO TB WORKFLOW CREATED (Normal result)` 
              : activeTab === "tuberculosis" ? `
TB POSITIVE WORKFLOW - Database Impact:

┌─────────────────┐         ┌──────────────────┐         ┌─────────────────────┐
│   PATIENTS      │────────►│    X_RAYS        │────────►│ DIAGNOSIS_RESULTS   │
│   (Updated)     │  Create │  (Create with    │  Create │ (Store: TB+)        │
│                 │         │   Status: SUCCESS)│         │ (Confidence: >20%)  │
│ id: 1           │         │                  │         │                     │
│ status: AT_RISK │         │ patientId: 1     │         │ xrayId: 1           │
│ tbFlag: true    │         │ uploadedAt: now  │         │ prediction: TB+     │
└────────┬────────┘         └──────────────────┘         │ confidence: 0.75    │
         │                                               └────────┬────────────┘
         │                                                         │
         │                   ┌─────────────────────────────────────┘
         │                   │ Triggers TB Workflow → Cascade operations:
         │                   │
         ▼                   ▼
    ┌──────────────────────────────────┐
    │    TB_WORKFLOWS                  │
    │ (Create new workflow)            │
    │                                  │
    │ patientId: 1                     │
    │ diagnosisId: 1                   │
    │ severity: MODERATE               │
    │ status: ACTIVE                   │
    │ startedAt: now                   │
    └────┬─────────────────────────────┘
         │
         ├─► FOLLOW_UPS (Auto-schedule 4-5 appointments, months 2-5)
         ├─► NOTIFICATIONS (Alert physician + radiologist)
         ├─► MEDICAL_REPORTS (Generate WHO-standard report)
         └─► AUDIT_LOGS (Log TB detection event)

DATABASE WRITE OPERATIONS: 7 tables modified
├─ UPDATE patients SET status='AT_RISK', tbFlag=true WHERE id=1
├─ INSERT into x_rays (patientId, imageBase64, uploadedAt, status)
├─ INSERT into diagnosis_results (xrayId, prediction, confidence, heatmapBase64)
├─ INSERT into tb_workflows (patientId, diagnosisId, severity, status)
├─ INSERT into follow_ups (workflowId, appointmentDate, appointmentType)
├─ INSERT into notifications (userId, workflowId, message, type)
└─ INSERT into medical_reports (workflowId, patientId, content, docType)`
              : `
FAILED ANALYSIS WORKFLOW - Database Impact:

┌─────────────────┐         ┌──────────────────┐         ┌─────────────────────┐
│   PATIENTS      │────────►│    X_RAYS        │────────►│ DIAGNOSIS_RESULTS   │
│   (Unchanged)   │  Create │  (Create with    │  Failed │ (Not created)       │
│                 │         │   Status: FAILED)│         │                     │
│                 │         │  errorMsg: ...   │         │                     │
│ id: 1           │         │  retryCount: 1   │         │                     │
└─────────────────┘         └────────┬─────────┘         └─────────────────────┘
                                     │
                        (User decision: Retry?)
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
          ▼ Option 1                           ▼ Option 2
    RE-ANALYZE STORED                    UPLOAD NEW IMAGE
         X-RAY                              & ANALYZE
         │                                  │
         └──────────────────┬───────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │    X_RAYS        │
                   │ (Update status)  │
                   │ status: SUCCESS  │
                   │ errorMsg: null   │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ DIAGNOSIS_RESULTS│
                   │ (Create after    │
                   │ successful retry)│
                   └──────────────────┘

DATABASE WRITE OPERATIONS: 2-3 tables modified
├─ INSERT into x_rays (patientId, imageBase64, uploadedAt, status) [on resubmit]
├─ UPDATE x_rays SET status='FAILED', errorMessage='timeout' WHERE id=x
├─ UPDATE x_rays SET status='SUCCESS', errorMessage=null WHERE id=x [on retry success]
└─ INSERT into diagnosis_results (xrayId, prediction, confidence)
           [only after successful re-analysis]

AUDIT TRAIL:
    └─ INSERT into audit_logs (action, resource, details) for each attempt`
              }
              </pre>
            </div>

            {/* Data Persistence Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
                <h5 className="font-bold text-blue-900 mb-2">📋 Key Database Fields Updated</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  {activeTab === "normal" && (
                    <>
                      <li>• x_rays.status = 'SUCCESS'</li>
                      <li>• diagnosis_results.prediction = 'Normal'</li>
                      <li>• diagnosis_results.confidence = 0.92</li>
                      <li>• x_rays.validationScore = 0.98</li>
                    </>
                  )}
                  {activeTab === "tuberculosis" && (
                    <>
                      <li>• patients.status = 'AT_RISK'</li>
                      <li>• diagnosis_results.prediction = 'Tuberculosis'</li>
                      <li>• tb_workflows.status = 'ACTIVE'</li>
                      <li>• notifications.isRead = false</li>
                      <li>• medical_reports.docType = 'ASSESSMENT'</li>
                    </>
                  )}
                  {activeTab === "failed" && (
                    <>
                      <li>• x_rays.status = 'FAILED'</li>
                      <li>• x_rays.errorMessage = 'timeout'</li>
                      <li>• x_rays.retryCount = 1</li>
                      <li>• audit_logs.action = 'ANALYSIS_FAILED'</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 rounded p-4">
                <h5 className="font-bold text-purple-900 mb-2">⏱️ Processing Timings</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Frontend validation: ~500ms</li>
                  <li>• Backend validation: ~1s</li>
                  <li>• ML preprocessing: ~2s</li>
                  <li>• Model inference: ~12-15s</li>
                  <li>• Database writes: ~200ms</li>
                  <li>• Total end-to-end: ~15-20s</li>
                  <li>• Timeout threshold: 90s</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {currentWorkflow.steps.length}
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              Steps in Workflow
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              15-20s
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              Total Processing Time
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 border-2 border-indigo-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {currentWorkflow.database.length}
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              Database Tables Involved
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-100 to-teal-50 border-2 border-teal-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">
              3
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              Distinct Workflows
            </div>
          </div>
        </div>

        {/* Error Handling Section */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 mb-12">
          <div className="flex gap-4 items-start">
            <FiAlertCircle className="text-yellow-600 text-3xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-yellow-900 mb-3">Error Handling & Resilience</h3>
              <ul className="space-y-2 text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">→</span>
                  <span><strong>Timeout Protection:</strong> 90-second timeout with automatic retry suggestion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">→</span>
                  <span><strong>Image Validation:</strong> 3-stage validation (format, size, content)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">→</span>
                  <span><strong>Graceful Degradation:</strong> User-friendly error messages with clear next steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">→</span>
                  <span><strong>Audit Trail:</strong> All analysis attempts logged for clinical compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">→</span>
                  <span><strong>Data Persistence:</strong> No data loss even if analysis fails</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate("/system-architecture")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiArrowLeft size={20} />
            Previous
          </button>

          <div className="text-sm text-gray-600 font-medium">
            Page 3 of 4: TB Detection Workflows
          </div>

          <button
            onClick={() => navigate("/technology-stack")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Next
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkflowExplanationPage;
