import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiSettings, FiUsers, FiZap, FiLock } from "react-icons/fi";

function SystemArchitecturePage() {
  const navigate = useNavigate();

  const architectureComponents = [
    {
      title: "Frontend Layer",
      icon: FiSettings,
      color: "blue",
      description: "React 18 + Vite SPA",
      technologies: ["React 18", "TypeScript", "Tailwind CSS", "Redux", "Axios"],
      responsibilities: [
        "User Interface & UX",
        "Patient intake forms",
        "Results visualization",
        "Timeline display",
        "Medical report generation"
      ]
    },
    {
      title: "Backend API Layer",
      icon: FiZap,
      color: "green",
      description: "NestJS REST API with JWT Auth",
      technologies: ["NestJS v9", "TypeScript", "TypeORM", "JWT", "PostgreSQL"],
      responsibilities: [
        "Authentication & Authorization",
        "Patient data management",
        "X-ray storage & retrieval",
        "Diagnosis result persistence",
        "TB workflow orchestration"
      ]
    },
    {
      title: "ML Inference Layer",
      icon: FiLock,
      color: "purple",
      description: "Flask API with PyTorch Models",
      technologies: ["Flask", "PyTorch", "ResNet18", "GradCAM", "OpenCV"],
      responsibilities: [
        "Image preprocessing",
        "TB classification",
        "Confidence scoring",
        "Heatmap generation (GradCAM)",
        "Model inference"
      ]
    },
    {
      title: "Data Layer",
      icon: FiUsers,
      color: "red",
      description: "PostgreSQL Database",
      technologies: ["PostgreSQL 12+", "TypeORM", "Migrations", "Transactions", "Indexing"],
      responsibilities: [
        "Patient records",
        "X-ray storage (Base64)",
        "Diagnosis results",
        "TB workflows",
        "Audit logs"
      ]
    }
  ];

  const getBgColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-100 to-blue-50",
      green: "from-emerald-100 to-emerald-50",
      purple: "from-purple-100 to-purple-50",
      red: "from-red-100 to-red-50"
    };
    return colors[color] || colors.blue;
  };

  const getBorderColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-blue-200",
      green: "border-emerald-200",
      purple: "border-purple-200",
      red: "border-red-200"
    };
    return colors[color] || colors.blue;
  };

  const getTextColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue-600",
      green: "text-emerald-600",
      purple: "text-purple-600",
      red: "text-red-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">System Architecture</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, scalable 4-tier architecture for TB detection and diagnosis
          </p>
        </div>

        {/* Architecture Diagram - Text-based visualization */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 font-mono text-sm overflow-x-auto border border-gray-200">
          <pre className="text-gray-700 text-center whitespace-pre-wrap break-words">
{`┌──────────────────────────────────────────────────────────────────┐
│                     USER PRESENTATION LAYER                      │
│              (Browser - React 18 SPA + Tailwind CSS)             │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                    (REST API via Axios)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    BACKEND API LAYER                             │
│        (NestJS v9 + TypeORM + JWT Authentication)               │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Controllers:                                           │   │
│  │  • Patients Controller      • X-Rays Controller         │   │
│  │  • Diagnosis Results        • TB Workflows              │   │
│  │  • Admin Management         • User Management           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                    (Service Layer)                               │
│                             │                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Services:                                              │   │
│  │  • Patient Service          • X-Ray Service             │   │
│  │  • Diagnosis Service        • TB Workflow Service       │   │
│  │  • Authentication Service   • Authorization Service     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
└────────────┬───────────────┼───────────────┬────────────────────┘
             │               │               │
    (HTTP POST/GET/PUT)  (FlaskAPI)   (Database Queries)
             │               │               │
             ▼               ▼               ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  FLASK API (5000)│  │  ML MODELS       │  │   PostgreSQL DB  │
│                  │  │  ResNet18 TB CLS │  │                  │
│ ┌──────────────┐ │  │  • Classes: 2    │  │  • Patients      │
│ │ /health      │ │  │  • 224x224 input │  │  • X-Rays        │
│ │ /predict/    │ │  │  • GradCAM hm    │  │  • Diagnoses     │
│ │ tuberculosis │ │  │  • 10-15s infer  │  │  • TB Workflows  │
│ │ /predict/    │ │  │  • 42.71 MB      │  │  • Users         │
│ │ tuberculosis │ │  │                  │  │  • Roles & Perms │
│ │ /file        │ │  │  (port 5000)     │  │  (port 5432)     │
│ └──────────────┘ │  └──────────────────┘  └──────────────────┘
└──────────────────┘

         ML INFERENCE LAYER              DATA PERSISTENCE LAYER
      (PyTorch + Flask)              (PostgreSQL + TypeORM)`}
          </pre>
        </div>

        {/* Component Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {architectureComponents.map((component, index) => {
            const IconComponent = component.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${getBgColor(
                  component.color
                )} border-2 ${getBorderColor(
                  component.color
                )} rounded-2xl p-8 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`p-3 rounded-lg ${getTextColor(
                      component.color
                    )} text-2xl`}
                  >
                    <IconComponent size={28} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${getTextColor(component.color)}`}>
                      {component.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{component.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {component.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          component.color === "blue"
                            ? "bg-blue-600"
                            : component.color === "green"
                            ? "bg-emerald-600"
                            : component.color === "purple"
                            ? "bg-purple-600"
                            : "bg-red-600"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3">Key Responsibilities:</h4>
                  <ul className="space-y-2">
                    {component.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className={`${getTextColor(component.color)} font-bold mt-1`}>
                          ✓
                        </span>
                        <span className="text-sm">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Flow Diagram */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Complete Data Flow</h2>
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-8 font-mono text-xs overflow-x-auto">
            <pre className="text-gray-700">
{`STEP 1: USER UPLOADS X-RAY
  Patient/Physician → React UI → Axios POST
  │
  └─► File converted to Base64
  
STEP 2: BACKEND RECEIVES & VALIDATES
  NestJS Controller (/xrays/upload)
  │
  ├─► XRayService: Validate format & size
  ├─► Check: physician access, patient ownership
  └─► Create X-Ray record (status: PENDING)
  
STEP 3: SEND TO ML MODEL
  PatientService.performTBDiagnosis()
  │
  └─► Flask API (localhost:5000)
      ├─► /predict/xray_validation (format check)
      └─► /predict/tuberculosis (TB classification)
      
STEP 4: ML MODEL INFERENCE
  Flask TB Classifier (ResNet18)
  │
  ├─► Image preprocessing (224x224)
  ├─► Forward pass through network
  ├─► Get prediction: "Tuberculosis" or "Normal"
  ├─► Get confidence: 0-1 score
  └─► Generate GradCAM heatmap
  
STEP 5: STORE RESULTS
  DiagnosisService.save()
  │
  ├─► Save prediction + confidence
  ├─► Save heatmap_base64 (GradCAM)
  ├─► Update X-Ray status: SUCCESS
  └─► IF TB-Positive: Trigger TB Workflow
  
STEP 6: TRIGGER TB WORKFLOW (if positive)
  TBWorkflowService.createWorkflow()
  │
  ├─► Create workflow record
  ├─► Send notification to physician
  ├─► Schedule follow-up appointment
  └─► Generate medical report
  
STEP 7: DISPLAY RESULTS TO USER
  React PatientDetailsPage
  │
  ├─► Query patient & X-rays
  ├─► Fetch diagnosis results
  ├─► Display Base64 images
  ├─► Show heatmap visualization
  ├─► Display Timeline (4 stages)
  └─► Display TB Treatment Protocol (if positive)
  
DATABASE TABLES INVOLVED:
  • patients (patient info + physician)
  • x_rays (image storage + metadata)
  • diagnosis_results (predictions)
  • tb_workflows (treatment tracking)
  • users (authentication)
  • roles (physician, radiologist, admin)`}
            </pre>
          </div>
        </div>

        {/* Database Schema Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border-2 border-purple-200">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📊 Database Schema & Relationships</h2>
          <p className="text-lg text-gray-600 mb-8">
            Complete PostgreSQL database structure with 11 tables and comprehensive relationships
          </p>

          {/* Visual Database Schema Diagram */}
          <div className="bg-gradient-to-b from-slate-50 to-blue-50 rounded-lg p-8 mb-8 overflow-x-auto font-mono text-xs">
            <pre className="text-gray-700 whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA - ENTITY RELATIONSHIPS                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ↓ (1 to Many)
┌──────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐
│      USERS TABLE         │      │    PATIENTS TABLE        │      │      X_RAYS TABLE        │
├──────────────────────────┤      ├──────────────────────────┤      ├──────────────────────────┤
│ id (PK)                  │●─────│ id (PK)                  │●─────│ id (PK)                  │
│ email (UNIQUE)           │  1:M │ firstName                │  1:M │ patientId (FK)           │
│ firstName                │      │ lastName                 │      │ imageBase64 (LONGTEXT)   │
│ lastName                 │      │ medicalHistory (JSON)    │      │ uploadedAt               │
│ role (ADMIN/PHYSICIAN)   │      │ physicianId (FK)●───────┐│      │ status (SUCCESS/FAILED)  │
│ passwordHash             │      │ createdAt                │      │ fileSize                 │
│ createdAt                │      │ updatedAt                │      │ validationScore          │
└──────────────────────────┘      └──────────────────────────┘      │ createdAt                │
          ▲                                   │                      │ updatedAt                │
          │                                   │                      └──────────────────────────┘
          │ (1 to Many)                       └──► (1 to Many)              │
          │                                      ┌──────────────────────────┘
          │ physicianId                          │
          │                                      ▼ (1 to Many)
          │                            ┌──────────────────────────┐
          │                            │ DIAGNOSIS_RESULTS TABLE  │
          │                            ├──────────────────────────┤
          │                            │ id (PK)                  │
          │                            │ xrayId (FK)●─────────────┘
          │                            │ prediction (String)      │
          │                            │ confidence (Float)       │
          │                            │ heatmapBase64 (LONGTEXT) │
          │                            │ modelName (String)       │
          │                            │ analyzedAt               │
          │                            │ createdAt                │
          │                            └──────────────────────────┘
          │                                      │
          │                                      │ (1 to 1) Triggers
          │                                      ▼
          │                            ┌──────────────────────────┐
          │                            │  TB_WORKFLOWS TABLE      │
          │                            ├──────────────────────────┤
          │                            │ id (PK)                  │
          │                            │ patientId (FK)●──────────┼──────────────────┐
          │                            │ diagnosisId (FK)         │                  │
          │                            │ severity (String)        │                  │
          │                            │ status (ACTIVE/COMPLETE) │                  │
          │                            │ startedAt                │                  │
          │                            │ createdAt                │                  │
          └────────────────────────────│ updatedAt                │                  │
                                       └──────────────────────────┘                  │
                                                                                      │
                                            ┌───────────────────────────────────────┘
                                            │
                                            ▼ (1 to Many)
                              ┌──────────────────────────┐
                              │ FOLLOW_UPS TABLE         │
                              ├──────────────────────────┤
                              │ id (PK)                  │
                              │ workflowId (FK)●─────────┘
                              │ appointmentDate          │
                              │ appointmentType          │
                              │ status                   │
                              │ notes (Text)             │
                              │ createdAt                │
                              └──────────────────────────┘

                    ┌──────────────────────────────────────────────────────────┐
                    │                 NOTIFICATION & REPORT TABLES              │
                    └──────────────────────────────────────────────────────────┘
                                            │
            ┌──────────────────────────────┼──────────────────────────────┐
            ▼                              ▼                               ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│  NOTIFICATIONS TABLE     │  │  MEDICAL_REPORTS TABLE   │  │     ROLES TABLE          │
├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
│ id (PK)                  │  │ id (PK)                  │  │ id (PK)                  │
│ userId (FK)             │  │ workflowId (FK)          │  │ name (ADMIN/PHYSICIAN)  │
│ workflowId (FK)         │  │ patientId (FK)           │  │ permissions (JSON)       │
│ type (ALERT/INFO)       │  │ docType (Assessment...)  │  │ description              │
│ message (Text)          │  │ content (Longtext)       │  │ createdAt                │
│ isRead (Boolean)        │  │ attachments (JSON)       │  │ updatedAt                │
│ readAt                  │  │ createdAt                │  └──────────────────────────┘
│ createdAt               │  │ updatedAt                │
└──────────────────────────┘  └──────────────────────────┘

                    ┌──────────────────────────────────────────────┐
                    │    ADDITIONAL TRACKING TABLES                │
                    └──────────────────────────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            ▼                      ▼                      ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   AUDIT_LOGS TABLE       │  │  USER_SESSIONS TABLE     │
├──────────────────────────┤  ├──────────────────────────┤
│ id (PK)                  │  │ id (PK)                  │
│ userId (FK)             │  │ userId (FK)              │
│ action (String)         │  │ token (String - Unique)  │
│ resource (String)       │  │ ipAddress                │
│ details (JSON)          │  │ userAgent                │
│ timestamp                │  │ expiresAt                │
│ ipAddress                │  │ createdAt                │
└──────────────────────────┘  │ updatedAt                │
                              └──────────────────────────┘`}
            </pre>
          </div>

          {/* Table Details Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "USERS",
                records: "Healthcare professionals (Physicians, Admins, Radiologists)",
                fields: "100+ users",
                relationships: "→ Patients (1:M), → Sessions, → Notifications, → Audit Logs"
              },
              {
                name: "PATIENTS",
                records: "Patient demographic data and medical information",
                fields: "firstName, lastName, age, medicalHistory (JSON), physicianId (FK)",
                relationships: "← Users, → X-Rays (1:M), → TB Workflows (1:M), → Medical Reports"
              },
              {
                name: "X_RAYS",
                records: "Uploaded chest X-ray images stored as Base64",
                fields: "imageBase64 (Longtext), uploadedAt, status, validationScore, fileSize",
                relationships: "← Patients, → Diagnosis Results (1:M)"
              },
              {
                name: "DIAGNOSIS_RESULTS",
                records: "ML analysis predictions with confidence scores",
                fields: "prediction, confidence (0-1), heatmapBase64, modelName, analyzedAt",
                relationships: "← X-Rays, → TB Workflows (1:1 trigger)"
              },
              {
                name: "TB_WORKFLOWS",
                records: "TB-positive case management and treatment tracking",
                fields: "severity, status, startedAt, clinicalNotes, protocolVersion",
                relationships: "← Patients, ← Diagnosis Results, → Follow-ups (1:M), → Notifications"
              },
              {
                name: "FOLLOW_UPS",
                records: "Scheduled follow-up appointments for TB patients",
                fields: "appointmentDate, appointmentType, status, notes, clinicianNotes",
                relationships: "← TB Workflows (1:M)"
              },
              {
                name: "NOTIFICATIONS",
                records: "System notifications for physicians about critical findings",
                fields: "type, message, isRead, readAt, priority, actionRequired",
                relationships: "← Users, ← TB Workflows"
              },
              {
                name: "MEDICAL_REPORTS",
                records: "WHO-standard medical reports generated for TB cases",
                fields: "docType, content (Longtext), attachments (JSON), signedBy",
                relationships: "← TB Workflows, ← Patients"
              },
              {
                name: "ROLES",
                records: "Role definitions for access control (ADMIN, PHYSICIAN, RADIOLOGIST)",
                fields: "name, permissions (JSON), description, permissions count",
                relationships: "Referenced by Users for RBAC"
              },
              {
                name: "AUDIT_LOGS",
                records: "Complete audit trail of system actions for compliance",
                fields: "action, resource, details (JSON), timestamp, ipAddress",
                relationships: "← Users (1:M)"
              },
              {
                name: "USER_SESSIONS",
                records: "Active user session tracking with authentication tokens",
                fields: "token, ipAddress, userAgent, expiresAt, isActive",
                relationships: "← Users (1:M)"
              }
            ].map((table, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4"
              >
                <h4 className="text-lg font-bold text-purple-900 mb-2">{table.name}</h4>
                <p className="text-sm text-gray-700 mb-2 font-semibold">📋 {table.records}</p>
                <p className="text-xs text-gray-600 mb-3 bg-purple-100 rounded px-2 py-1">
                  <span className="font-bold">Fields:</span> {table.fields}
                </p>
                <p className="text-xs text-gray-600 text-purple-800">
                  <span className="font-bold">Relationships:</span> {table.relationships}
                </p>
              </div>
            ))}
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t-2 border-purple-200">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h4 className="text-lg font-bold text-blue-900 mb-4">🔗 Relationship Types</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1:M</span>
                  <span>One-to-Many: Users → Patients, Patients → X-Rays</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1:1</span>
                  <span>One-to-One: Diagnosis Results → TB Workflows (Trigger)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">FK</span>
                  <span>Foreign Keys: Enforce referential integrity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">CASCADE</span>
                  <span>Delete cascade: Remove X-Ray → Remove Diagnoses automatically</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <h4 className="text-lg font-bold text-green-900 mb-4">💾 Data Characteristics</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">📸</span>
                  <span>X-Ray images: Base64 (Longtext), ~500KB-10MB per image</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">🗂️</span>
                  <span>JSON fields: Flexible schema for notes, permissions, attachments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">⏰</span>
                  <span>Timestamps: Automatic createdAt/updatedAt for audit trail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600">🔐</span>
                  <span>Unique constraints: Email, token for data integrity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Performance */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-4">🔐 Security Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">JWT Token Authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Role-Based Access Control (RBAC)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Physician-Scoped Patient Access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">CORS Configuration for API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Input Validation & Sanitization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Database Encryption Ready</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-orange-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">⚡ Performance Metrics</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span className="text-gray-700">API Startup: ~2-3 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span className="text-gray-700">Model Load Time: Instant (pre-loaded)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span className="text-gray-700">Single Inference: 10-15 seconds (CPU)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span className="text-gray-700">Heatmap Generation: 2-3 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span className="text-gray-700">End-to-End Processing: ~15-20 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span className="text-gray-700">Throughput: 1-2 images/second</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate("/how-it-works")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiArrowLeft size={20} />
            Previous
          </button>

          <div className="text-sm text-gray-600 font-medium">
            Page 2 of 4: System Architecture
          </div>

          <button
            onClick={() => navigate("/workflow-explanation")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Next
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemArchitecturePage;
