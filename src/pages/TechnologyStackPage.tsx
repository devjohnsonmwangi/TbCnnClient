import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiDownload, FiSettings, FiZap, FiLock, FiTrendingUp, FiAward } from "react-icons/fi";

function TechnologyStackPage() {
  const navigate = useNavigate();

  const techStack = [
    {
      category: "Frontend",
      icon: FiSettings,
      color: "blue",
      technologies: [
        { name: "React 18", desc: "UI Library", version: "18.2+" },
        { name: "TypeScript", desc: "Type Safety", version: "5.0+" },
        { name: "Vite", desc: "Build Tool", version: "4.0+" },
        { name: "Tailwind CSS", desc: "Styling", version: "3.3+" },
        { name: "Redux", desc: "State Management", version: "4.2+" },
        { name: "Axios", desc: "HTTP Client", version: "1.4+" },
        { name: "React Router", desc: "Navigation", version: "6.0+" },
        { name: "React Icons", desc: "Icon Library", version: "4.11+" }
      ]
    },
    {
      category: "Backend",
      icon: FiZap,
      color: "green",
      technologies: [
        { name: "NestJS", desc: "REST Framework", version: "9.0+" },
        { name: "TypeScript", desc: "Type Safety", version: "5.0+" },
        { name: "TypeORM", desc: "ORM", version: "0.3+" },
        { name: "JWT", desc: "Authentication", version: "Built-in" },
        { name: "PostgreSQL Driver", desc: "Database", version: "8.0+" },
        { name: "Class Validator", desc: "Validation", version: "0.14+" },
        { name: "Axios", desc: "HTTP Client", version: "1.4+" },
        { name: "Class Transformer", desc: "DTOs", version: "0.5+" }
      ]
    },
    {
      category: "Machine Learning",
      icon: FiTrendingUp,
      color: "purple",
      technologies: [
        { name: "PyTorch", desc: "Deep Learning", version: "2.0+" },
        { name: "Flask", desc: "Web Framework", version: "2.3+" },
        { name: "ResNet18", desc: "Model Architecture", version: "Pretrained" },
        { name: "GradCAM", desc: "Explainability", version: "Custom" },
        { name: "OpenCV", desc: "Image Processing", version: "4.8+" },
        { name: "NumPy", desc: "Computation", version: "1.24+" },
        { name: "Pillow", desc: "Image Library", version: "10.0+" },
        { name: "SciPy", desc: "Scientific Computation", version: "1.11+" }
      ]
    },
    {
      category: "Database",
      icon: FiDownload,
      color: "red",
      technologies: [
        { name: "PostgreSQL", desc: "RDBMS", version: "12.0+" },
        { name: "TypeORM", desc: "Migrations", version: "0.3+" },
        { name: "pg", desc: "Driver", version: "8.10+" },
        { name: "Pg Migrations", desc: "Schema Versioning", version: "Built-in" },
        { name: "Connection Pooling", desc: "Performance", version: "Native" },
        { name: "JSON Storage", desc: "Flexible Fields", version: "Native" },
        { name: "Full-Text Search", desc: "Search", version: "Native" },
        { name: "Transactions", desc: "ACID Compliance", version: "Native" }
      ]
    }
  ];

  const databases = [
    {
      name: "Patients",
      records: "Patient demographic data, medical history, physician assignment",
      fields: "id, firstName, lastName, email, age, medicalHistory, physicianId"
    },
    {
      name: "X-Rays",
      records: "Uploaded chest X-ray images stored as Base64",
      fields: "id, patientId, imageBase64, fileSize, uploadedAt, status"
    },
    {
      name: "Diagnosis Results",
      records: "TB classification predictions and confidence scores",
      fields: "id, xrayId, prediction, confidence, heatmap, model, analyzedAt"
    },
    {
      name: "TB Workflows",
      records: "TB-positive case management and follow-up tracking",
      fields: "id, patientId, severity, status, appointmentDate, notes"
    }
  ];

  const getBgColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "from-blue-100 to-blue-50 border-blue-200",
      green: "from-emerald-100 to-emerald-50 border-emerald-200",
      purple: "from-purple-100 to-purple-50 border-purple-200",
      red: "from-red-100 to-red-50 border-red-200"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Technology Stack</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete overview of all technologies, frameworks, and tools used in the E-Afya TB detection platform
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {techStack.map((stack, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${getBgColor(
                stack.color
              )} border-2 rounded-2xl p-8 hover:shadow-lg transition-all duration-300`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <stack.icon size={28} />
                {stack.category}
              </h2>

              <div className="space-y-3">
                {stack.technologies.map((tech, i) => (
                  <div
                    key={i}
                    className="bg-white/70 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{tech.name}</h3>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-700 whitespace-nowrap">
                        {tech.version}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Database Schema */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📊 Complete Database Schema</h2>
          <p className="text-lg text-gray-600 mb-8">
            11 interconnected PostgreSQL tables with comprehensive relationships and constraints
          </p>

          {/* Detailed Schema Diagram */}
          <div className="bg-gradient-to-b from-slate-50 to-purple-50 rounded-xl p-8 mb-8 overflow-x-auto border-2 border-purple-200 font-mono text-xs">
            <pre className="text-gray-700 whitespace-pre-wrap">
{`═══════════════════════════════════════════════════════════════════════════════════════
                        E-AFYA DATABASE SCHEMA (PostgreSQL)
═══════════════════════════════════════════════════════════════════════════════════════

TABLE 1: USERS (Authentication & Access Control)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ Serial | Auto-increment
│ email (UNIQUE, NOT NULL)                │ String | HIPAA-relevant audit field
│ firstName (NOT NULL)                    │ String | Healthcare professional name
│ lastName (NOT NULL)                     │ String | Healthcare professional surname
│ passwordHash (NOT NULL)                 │ String (bcrypt) | Encrypted password
│ role (ENUM)                             │ ADMIN / PHYSICIAN / RADIOLOGIST
│ isActive (Boolean, default: true)       │ Account status
│ lastLogin (Timestamp)                   │ Login tracking for audit
│ createdAt (Timestamp)                   │ Auto-generated on insert
│ updatedAt (Timestamp)                   │ Auto-updated on modify
│ deletedAt (Timestamp, nullable)         │ Soft delete for audit trail
└─────────────────────────────────────────┘
INDEXES: email (UNIQUE), id (PRIMARY)

TABLE 2: ROLES (Role-Based Access Control)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ Serial
│ name (UNIQUE)                           │ ADMIN / PHYSICIAN / RADIOLOGIST
│ permissions (JSON)                      │ {"read_patients": true, "upload_xray": true, ...}
│ description (Text)                      │ Role documentation
│ createdAt (Timestamp)                   │ Creation timestamp
│ updatedAt (Timestamp)                   │ Update timestamp
└─────────────────────────────────────────┘
REFERENCES: users.role → FOREIGN KEY

TABLE 3: PATIENTS (Core Clinical Data)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Unique patient identifier
│ firstName (NOT NULL)                    │ String | Patient first name
│ lastName (NOT NULL)                     │ String | Patient last name
│ email (Unique, Nullable)                │ String | Patient contact
│ age (Integer)                           │ Integer | Patient age in years
│ medicalHistory (JSON)                   │ {allergies: [], conditions: [], ...}
│ physicianId (FK → users.id)             │ Foreign Key | Patient's assigned physician
│ status (ENUM)                           │ HEALTHY / AT_RISK / TB_POSITIVE / RECOVERED
│ tbFlag (Boolean, default: false)        │ TB detection flag
│ createdAt (Timestamp)                   │ Registration timestamp
│ updatedAt (Timestamp)                   │ Last update timestamp
└─────────────────────────────────────────┘
INDEXES: physicianId (FK), id (PRIMARY)
CONSTRAINTS: physicianId REFERENCES users(id) ON DELETE SET NULL

TABLE 4: X_RAYS (Image Storage & Metadata)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | X-ray identifier
│ patientId (FK → patients.id, NOT NULL)  │ Foreign Key | Which patient
│ imageBase64 (LONGTEXT, NOT NULL)        │ Base64-encoded image (~500KB-10MB)
│ fileSize (Integer)                      │ File size in bytes
│ mimeType (String)                       │ image/jpeg, image/png, image/webp
│ uploadedAt (Timestamp)                  │ Upload timestamp
│ status (ENUM)                           │ PENDING / SUCCESS / FAILED / VALIDATING
│ validationScore (Float 0-1)             │ Image quality score
│ errorMessage (Text, Nullable)           │ Error description if analysis failed
│ retryCount (Integer, default: 0)        │ Number of retry attempts
│ createdAt (Timestamp)                   │ Creation timestamp
│ updatedAt (Timestamp)                   │ Last update timestamp
└─────────────────────────────────────────┘
INDEXES: patientId (FK), id (PRIMARY)
CONSTRAINTS: patientId REFERENCES patients(id) ON DELETE CASCADE

TABLE 5: DIAGNOSIS_RESULTS (ML Analysis Output)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Result identifier
│ xrayId (FK → x_rays.id, NOT NULL)       │ Foreign Key | Which X-ray
│ prediction (String, NOT NULL)           │ "Tuberculosis" / "Normal"
│ confidence (Float 0-1, NOT NULL)        │ 0.95 (95% confidence)
│ heatmapBase64 (LONGTEXT)                │ GradCAM heatmap visualization
│ modelName (String)                      │ "ResNet18-TB-V1.0"
│ modelVersion (String)                   │ Model version identifier
│ analyzedAt (Timestamp)                  │ Analysis completion time
│ processingTime (Integer)                │ Milliseconds taken
│ createdAt (Timestamp)                   │ Result creation timestamp
└─────────────────────────────────────────┘
INDEXES: xrayId (FK, UNIQUE), id (PRIMARY)
CONSTRAINTS: xrayId REFERENCES x_rays(id) ON DELETE CASCADE

TABLE 6: TB_WORKFLOWS (TB Case Management)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Workflow identifier
│ patientId (FK → patients.id, NOT NULL)  │ Foreign Key | Affected patient
│ diagnosisId (FK → diagnosis_results.id) │ Foreign Key | Triggering diagnosis
│ severity (ENUM)                         │ MILD / MODERATE / SEVERE
│ status (ENUM)                           │ ACTIVE / PAUSED / COMPLETE / RECOVERED
│ clinicalNotes (Text)                    │ Doctor notes on TB case
│ protocolVersion (String)                │ WHO treatment protocol version
│ startedAt (Timestamp)                   │ Workflow start date
│ completedAt (Timestamp, Nullable)       │ Workflow completion date
│ createdAt (Timestamp)                   │ Creation timestamp
│ updatedAt (Timestamp)                   │ Last update timestamp
└─────────────────────────────────────────┘
INDEXES: patientId (FK), diagnosisId (FK), id (PRIMARY)
CONSTRAINTS: patientId REFERENCES patients(id) ON DELETE CASCADE
             diagnosisId REFERENCES diagnosis_results(id) ON DELETE RESTRICT

TABLE 7: FOLLOW_UPS (Appointment Scheduling)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Appointment identifier
│ workflowId (FK → tb_workflows.id)       │ Foreign Key | Which TB workflow
│ appointmentDate (Timestamp)             │ Scheduled date&time
│ appointmentType (ENUM)                  │ SPUTUM_TEST / CT_SCAN / SPECIALIST / REVIEW
│ status (ENUM)                           │ SCHEDULED / COMPLETED / MISSED / CANCELLED
│ clinicianAssigned (String)              │ Assigned healthcare professional
│ clinicianNotes (Text)                   │ Post-appointment notes
│ reminderSent (Boolean)                  │ Reminder notification sent flag
│ createdAt (Timestamp)                   │ Creation timestamp
│ updatedAt (Timestamp)                   │ Update timestamp
└─────────────────────────────────────────┘
INDEXES: workflowId (FK), appointmentDate, id (PRIMARY)
CONSTRAINTS: workflowId REFERENCES tb_workflows(id) ON DELETE CASCADE

TABLE 8: NOTIFICATIONS (Alert System)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Notification identifier
│ userId (FK → users.id, NOT NULL)        │ Foreign Key | Recipient user
│ workflowId (FK → tb_workflows.id)       │ Foreign Key | Related workflow (nullable)
│ type (ENUM)                             │ ALERT / NOTIFICATION / REMINDER / INFO
│ priority (ENUM)                         │ LOW / MEDIUM / HIGH / CRITICAL
│ message (Text, NOT NULL)                │ Notification message
│ isRead (Boolean, default: false)        │ Read status
│ readAt (Timestamp, Nullable)            │ When user read it
│ actionRequired (Boolean)                │ Requires physician action
│ actionUrl (String, Nullable)            │ URL to take action
│ createdAt (Timestamp)                   │ Creation timestamp
└─────────────────────────────────────────┘
INDEXES: userId (FK), workflowId (FK), createdAt, isRead, id (PRIMARY)
CONSTRAINTS: userId REFERENCES users(id) ON DELETE CASCADE
             workflowId REFERENCES tb_workflows(id) ON DELETE CASCADE

TABLE 9: MEDICAL_REPORTS (Clinical Documentation)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Report identifier
│ workflowId (FK → tb_workflows.id)       │ Foreign Key | Related TB workflow
│ patientId (FK → patients.id)            │ Foreign Key | Patient for report
│ docType (ENUM)                          │ ASSESSMENT / TREATMENT_PLAN / PROGRESS_NOTE
│ content (LONGTEXT)                      │ Report HTML/PDF content
│ attachments (JSON)                      │ [{filename: "lab_results.pdf", url: "..."}]
│ signedBy (String)                       │ Physician name who signed
│ signedAt (Timestamp, Nullable)          │ Signature timestamp
│ createdAt (Timestamp)                   │ Report generation timestamp
│ updatedAt (Timestamp)                   │ Last update timestamp
└─────────────────────────────────────────┘
INDEXES: patientId (FK), workflowId (FK), docType, id (PRIMARY)
CONSTRAINTS: workflowId REFERENCES tb_workflows(id) ON DELETE CASCADE
             patientId REFERENCES patients(id) ON DELETE CASCADE

TABLE 10: AUDIT_LOGS (Compliance & Audit Trail)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ BigSerial | Log entry ID
│ userId (FK → users.id)                  │ Foreign Key | User who performed action
│ action (String)                         │ LOGIN / UPLOAD_XRAY / CREATE_DIAGNOSIS / ...
│ resource (String)                       │ PATIENT / XRAY / DIAGNOSIS
│ resourceId (String)                     │ ID of affected resource
│ details (JSON)                          │ {patientId: "123", oldValue: "...", ...}
│ ipAddress (String)                      │ Source IP for security
│ userAgent (String)                      │ Browser/client info
│ timestamp (Timestamp)                   │ When action occurred
└─────────────────────────────────────────┘
INDEXES: userId (FK), timestamp, action, id (PRIMARY)
CONSTRAINTS: userId REFERENCES users(id) ON DELETE SET NULL

TABLE 11: USER_SESSIONS (Authentication & Sessions)
┌─────────────────────────────────────────┐
│ id (PRIMARY KEY)                        │ UUID | Session identifier
│ userId (FK → users.id, NOT NULL)        │ Foreign Key | Session user
│ token (String, UNIQUE, NOT NULL)        │ JWT token
│ ipAddress (String)                      │ Session IP address
│ userAgent (String)                      │ Browser/device info
│ expiresAt (Timestamp)                   │ Token expiration time
│ isActive (Boolean, default: true)       │ Session active flag
│ createdAt (Timestamp)                   │ Session creation
│ lastActivityAt (Timestamp)              │ Last activity timestamp
└─────────────────────────────────────────┘
INDEXES: userId (FK), token (UNIQUE), expiresAt, id (PRIMARY)
CONSTRAINTS: userId REFERENCES users(id) ON DELETE CASCADE

═══════════════════════════════════════════════════════════════════════════════════════
KEY RELATIONSHIPS SUMMARY:
═══════════════════════════════════════════════════════════════════════════════════════

USERS ──1:M──► PATIENTS (Physician assigned to multiple patients)
PATIENTS ──1:M──► X_RAYS (Patient has multiple X-rays)
X_RAYS ──1:1──► DIAGNOSIS_RESULTS (Each X-ray has one diagnosis)
DIAGNOSIS_RESULTS ──1:1──► TB_WORKFLOWS (TB diagnosis triggers workflow)
TB_WORKFLOWS ──1:M──► FOLLOW_UPS (Workflow has multiple follow-ups)
TB_WORKFLOWS ──1:M──► NOTIFICATIONS (Notifications for workflow)
TB_WORKFLOWS ──1:M──► MEDICAL_REPORTS (Multiple reports per workflow)

USERS ──1:M──► AUDIT_LOGS (Track user actions)
USERS ──1:M──► NOTIFICATIONS (Notifications to users)
USERS ──1:M──► USER_SESSIONS (Multiple active sessions per user)

CASCADE DELETE: X_RAYS → DIAGNOSIS_RESULTS, TB_WORKFLOWS → FOLLOW_UPS
SOFT DELETE: USERS has deletedAt field for audit trail
UNIQUE CONSTRAINTS: email, token
═══════════════════════════════════════════════════════════════════════════════════════`}
            </pre>
          </div>

          {/* Detailed Table Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { name: "USERS", fields: 11, relationships: 4, type: "Authentication", highlight: "email (UNIQUE)" },
              { name: "ROLES", fields: 4, relationships: 1, type: "RBAC", highlight: "permissions (JSON)" },
              { name: "PATIENTS", fields: 11, relationships: 2, type: "Clinical", highlight: "physicianId (FK)" },
              { name: "X_RAYS", fields: 11, relationships: 2, type: "Images", highlight: "imageBase64 (Longtext)" },
              { name: "DIAGNOSIS_RESULTS", fields: 10, relationships: 2, type: "Analytics", highlight: "heatmapBase64" },
              { name: "TB_WORKFLOWS", fields: 10, relationships: 4, type: "Management", highlight: "status (ENUM)" },
              { name: "FOLLOW_UPS", fields: 9, relationships: 1, type: "Scheduling", highlight: "appointmentDate" },
              { name: "NOTIFICATIONS", fields: 11, relationships: 2, type: "Alerts", highlight: "priority (ENUM)" },
              { name: "MEDICAL_REPORTS", fields: 10, relationships: 2, type: "Documentation", highlight: "docType (ENUM)" },
              { name: "AUDIT_LOGS", fields: 9, relationships: 1, type: "Compliance", highlight: "timestamp" },
              { name: "USER_SESSIONS", fields: 9, relationships: 1, type: "Sessions", highlight: "token (UNIQUE)" }
            ].map((table, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-4">
                <h4 className="text-lg font-bold text-blue-900 mb-2">{table.name}</h4>
                <div className="text-xs space-y-1 text-gray-700">
                  <p><span className="font-bold">Type:</span> {table.type}</p>
                  <p><span className="font-bold">Fields:</span> {table.fields}</p>
                  <p><span className="font-bold">Relations:</span> {table.relationships}</p>
                  <p className="mt-2 px-2 py-1 bg-yellow-100 rounded text-yellow-900">
                    <span className="font-bold">↳</span> {table.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border-l-4 border-green-500 rounded p-6">
              <h4 className="text-lg font-bold text-green-900 mb-4">✓ Data Integrity Features</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Foreign Key Constraints (Referential Integrity)</li>
                <li>• CASCADE DELETE for dependent records</li>
                <li>• UNIQUE Constraints (email, token)</li>
                <li>• NOT NULL Constraints on critical fields</li>
                <li>• ENUM types for fixed value sets</li>
                <li>• Soft Deletes (deletedAt) for audit trail</li>
                <li>• Automatic createdAt/updatedAt timestamps</li>
                <li>• UUID primary keys for distributed systems</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 rounded p-6">
              <h4 className="text-lg font-bold text-purple-900 mb-4">📈 Performance Optimizations</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Indexes on all Foreign Keys</li>
                <li>• Indexes on frequently queried fields</li>
                <li>• Composite indexes for multi-field queries</li>
                <li>• Connection pooling for concurrent access</li>
                <li>• JSON fields for flexible schema</li>
                <li>• LONGTEXT for large Base64 images</li>
                <li>• Timestamp indexes for date range queries</li>
                <li>• Query optimization ready</li>
              </ul>
            </div>
          </div>
        </div>


        {/* Architecture Overview */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">System Deployment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Development Environment</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-500">React Frontend</div>
                  <div className="font-bold">localhost:5173</div>
                  <div className="text-xs text-gray-600">Vite Dev Server</div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-500">NestJS Backend</div>
                  <div className="font-bold">localhost:3000</div>
                  <div className="text-xs text-gray-600">REST API</div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-500">Flask ML API</div>
                  <div className="font-bold">localhost:5000</div>
                  <div className="text-xs text-gray-600">TB Classifier</div>
                </div>
                <div className="bg-white rounded p-3 border border-gray-200">
                  <div className="text-gray-500">PostgreSQL</div>
                  <div className="font-bold">localhost:5432</div>
                  <div className="text-xs text-gray-600">Database Server</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Production Specifications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span><strong>Containerized:</strong> Docker support for all services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span><strong>Orchestration:</strong> Kubernetes-ready (future)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span><strong>Load Balancing:</strong> Nginx/HAProxy compatible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span><strong>SSL/TLS:</strong> HTTPS capable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span><strong>Database:</strong> PostgreSQL 12+ with backups</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">✓</span>
                  <span><strong>Monitoring:</strong> Ready for ELK/Datadog integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features by Layer */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-cyan-100 to-blue-50 border-2 border-cyan-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-cyan-900 mb-6">Frontend Features</h3>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">→</span>
                <span>Responsive design (Mobile, Tablet, Desktop)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">→</span>
                <span>Real-time notifications & toasts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">→</span>
                <span>Base64 image rendering & display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">→</span>
                <span>Timeline visualization (4-stage progress)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">→</span>
                <span>Role-based dashboard display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold">→</span>
                <span>PWA support (installable)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-100 to-green-50 border-2 border-emerald-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-emerald-900 mb-6">Backend Features</h3>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <span>JWT Authentication & Authorization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Role-Based Access Control (RBAC)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Physician-scoped data filtering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Transaction management & rollback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Comprehensive error handling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">→</span>
                <span>Database migrations & versioning</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-rose-50 border-2 border-pink-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-pink-900 mb-6">ML Features</h3>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">→</span>
                <span>ResNet18 TB classifier (42.71 MB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">→</span>
                <span>GradCAM heatmap visualization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">→</span>
                <span>2-class classification (Normal/TB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">→</span>
                <span>Image preprocessing (224x224)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">→</span>
                <span>Confidence scoring (0-1 scale)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">→</span>
                <span>Base64 image support</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-amber-50 border-2 border-orange-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-orange-900 mb-6">Database Features</h3>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Full ACID compliance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Connection pooling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Base64 image storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>JSON field support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Full-text search ready</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Indexed queries for performance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Development Tools */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Development & Tooling</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <FiAward className="text-2xl text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-2">VS Code</h3>
              <p className="text-sm text-gray-600">Editor with TypeScript support</p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <FiDownload className="text-2xl text-gray-900 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-2">Git</h3>
              <p className="text-sm text-gray-600">Version control & CI/CD ready</p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <FiDownload className="text-2xl text-red-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-2">pnpm</h3>
              <p className="text-sm text-gray-600">Fast package manager</p>
            </div>
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <FiAward className="text-2xl text-yellow-600 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 mb-2">ESLint</h3>
              <p className="text-sm text-gray-600">Code quality & standards</p>
            </div>
          </div>
        </div>

        {/* Final Summary */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">🎯 Complete Solution</h2>
          <p className="text-lg mb-6">
            E-Afya is a fully integrated TB detection platform combining modern web technologies, 
            deep learning AI, and clinical workflows in a secure, scalable architecture designed for 
            healthcare deployment.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold mb-2">4 Tiers</div>
              <div className="text-sm">Frontend, Backend, ML, Database</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">11 Tables</div>
              <div className="text-sm">Complete data model with relationships</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">3 Workflows</div>
              <div className="text-sm">Normal, TB-Positive, Failed & Retry</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <button
            onClick={() => navigate("/workflow-explanation")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiArrowLeft size={20} />
            Previous
          </button>

          <div className="text-sm text-gray-600 font-medium">
            Page 4 of 4: Technology Stack
          </div>

          <button
            onClick={() => navigate("/how-it-works")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Start
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TechnologyStackPage;
