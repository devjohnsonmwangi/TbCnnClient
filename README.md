# 🩺 Eafia TB Detection Client - Comprehensive Documentation

A modern **React 18 + TypeScript** frontend for the TB Detection System with role-based dashboards, real-time patient management, X-ray uploads, and comprehensive system administration. Powered by Redux for state management, Vite for fast builds, and Tailwind CSS for responsive design.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Core Features & Pages](#-core-features--pages)
- [State Management](#-state-management-with-redux)
- [Service Layer](#-service-layer)
- [Authentication & Routing](#-authentication--routing)
- [Styling & Components](#-styling--components)
- [Configuration](#-configuration)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Performance](#-performance)
- [Support & Resources](#-support--resources)

---

## Overview

The Eafia Client is a production-ready healthcare application that provides:
- **Role-Based Dashboards** - Customized views for admins, physicians, and radiologists
- **Patient Management** - Complete patient registry with medical history tracking
- **X-Ray Uploads** - Drag-and-drop image upload for TB analysis
- **Real-Time Analytics** - System metrics, trends, and health indicators
- **Secure Authentication** - JWT-based login with persistent sessions
- **System Audit Logs** - Comprehensive activity tracking for compliance

**Status**: ✅ Production Ready | **Version**: 0.1.0 | **React**: 18.2.0 | **TypeScript**: 5.0+

---

## 🎯 Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Role-Based Access** | Separate dashboards for Admin/Physician/Radiologist | ✅ |
| **JWT Authentication** | Secure login with token refresh mechanism | ✅ |
| **State Persistence** | Redux with localStorage for session survival | ✅ |
| **Patient Registry** | Complete CRUD operations for patient management | ✅ |
| **X-Ray Management** | Upload, view, and manage medical images | ✅ |
| **TB Analysis Results** | Prediction display with confidence scores | ✅ |
| **System Logging** | Admin dashboard showing activity audit trails | ✅ |
| **Responsive Design** | Mobile, tablet, and desktop optimization | ✅ |
| **Real-Time Updates** | React Query for efficient data synchronization | ✅ |
| **Error Handling** | Comprehensive toast notifications and error display | ✅ |
| **Accessibility** | WCAG 2.1 compliant with proper ARIA labels | ✅ |
| **Service Worker** | Offline support with smart caching strategy | ✅ |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────┐
│        Browser / React Application (Vite)           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─ Redux Store ──────────────────────────────────┐ │
│  │ • Auth State (user, tokens, loading)           │ │
│  │ • UI State (modal visibility, notifications)   │ │
│  │ • Application State (shared data)              │ │
│  └────────────────────────────────────────────────┘ │
│                      △                               │
│                      │                               │
│  ┌─ React Router ─────┼──────────────────────────┐ │
│  │ • Public Routes    │  ┌─ Protected Routes ──┐ │ │
│  │   - Login          │  │ - /admin-dashboard  │ │ │
│  │   - Register       │  │ - /physician-dash   │ │ │
│  │                    │  │ - /patient-mgmt     │ │ │
│  │                    │  └─────────────────────┘ │ │
│  └────────────────────────────────────────────────┘ │
│                      △                               │
│                      │ (HTTP Requests)              │
├──────────────────────┼──────────────────────────────┤
│  • Service Layer     │                              │
│    - Auth Service    │                              │
│    - Patients Svc    │                              │
│    - Users Svc       │                              │
│    - Results Svc     │                              │
│    - Logs Svc        │                              │
└──────────────────────┼──────────────────────────────┘
                      │
        ┌─────────────▼──────────────┐
        │   NestJS Backend API      │
        │   (Port 3000)             │
        └───────────────────────────┘
                      │
        ┌─────────────▼──────────────┐
        │  PostgreSQL Database      │
        │  + Python ML Service      │
        └───────────────────────────┘
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js** v18.0.0 or higher
- **npm** v9+ or **pnpm** v8+
- **Modern Browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **4GB RAM** minimum (for development)

### Required Services
- NestJS API running on `http://localhost:3000`
- PostgreSQL database available
- Python ML service on `http://localhost:8000`

---

## 🚀 Installation & Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/devjohnsonmwangi/TbCnnClient.git
cd client
```

### Step 2: Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Step 3: Configure Environment
Create `.env.local` file in project root:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Authentication - tokens
VITE_TOKEN_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_USER_KEY=user_data

# Application Settings
VITE_APP_NAME=Eafia TB Detection
VITE_APP_VERSION=0.1.0

# Feature Flags
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_OFFLINE_MODE=true
```

### Step 4: Start Development Server
```bash
pnpm dev
```

Application available at: `http://localhost:5173`

⚠️ **Important**: Ensure backend API is running before starting the client

---

## 💾 Project Structure

```
client/
├── src/
│   ├── main.tsx                             # React entry point
│   ├── App.tsx                              # Root component
│   │
│   ├── redux/                               # Redux store & slices
│   │   ├── store.ts                         # Redux store config
│   │   └── slices/
│   │       ├── authSlice.ts                 # Auth state (user, tokens)
│   │       ├── uiSlice.ts                   # UI state (modals, notifications)
│   │       └── dataSlice.ts                 # Application data state
│   │
│   ├── hooks/                               # Custom React hooks
│   │   ├── useAuthContext.ts                # Auth state hook
│   │   ├── useNotification.ts               # Toast notification hook
│   │   └── useApi.ts                        # API call wrapper
│   │
│   ├── context/                             # React Context
│   │   ├── AuthContext.tsx                  # Auth context provider
│   │   └── ThemeContext.tsx                 # Theme provider
│   │
│   ├── services/                            # API integration layer
│   │   ├── api.config.ts                    # API base URL & config
│   │   ├── authService.ts                   # Auth endpoints
│   │   ├── usersService.ts                  # User management
│   │   ├── patientsService.ts               # Patient CRUD
│   │   ├── resultsService.ts                # Diagnosis results
│   │   ├── logsService.ts                   # System logs
│   │   └── xrayService.ts                   # X-ray upload
│   │
│   ├── pages/                               # Page components
│   │   ├── Login.tsx                        # Login page
│   │   ├── Register.tsx                     # Registration page
│   │   ├── AdminDashboard.tsx               # Admin 9-section dashboard
│   │   ├── PhysicianDashboard.tsx           # Physician filtered dashboard
│   │   ├── ProfessionDetailsPage.tsx        # Professional profile page
│   │   ├── MissingXraysManagementPage.tsx  # X-ray upload for missing
│   │   └── NotFound.tsx                     # 404 page
│   │
│   ├── components/                          # Reusable components
│   │   ├── Navigation/
│   │   │   ├── Header.tsx                   # Top navigation bar
│   │   │   ├── Sidebar.tsx                  # Side navigation
│   │   │   └── ProtectedRoute.tsx           # Route guard
│   │   │
│   │   ├── Modals/
│   │   │   ├── PatientDetailsModal.tsx      # Patient info modal
│   │   │   ├── ResultDetailsModal.tsx       # Diagnosis result modal
│   │   │   └── ConfirmDialog.tsx            # Confirmation dialogs
│   │   │
│   │   ├── Forms/
│   │   │   ├── LoginForm.tsx                # Login form
│   │   │   ├── PatientForm.tsx              # Patient registration
│   │   │   └── XRayUploadForm.tsx           # X-ray upload form
│   │   │
│   │   ├── Tables/
│   │   │   ├── PatientsTable.tsx            # Patients table
│   │   │   ├── UsersTable.tsx               # Users table
│   │   │   ├── ResultsTable.tsx             # Results table
│   │   │   └── LogsTable.tsx                # System logs table
│   │   │
│   │   └── Common/
│   │       ├── LoadingSpinner.tsx           # Loading indicator
│   │       ├── DataEmpty.tsx                # Empty state
│   │       └── ErrorBoundary.tsx            # Error fallback
│   │
│   ├── types/                               # TypeScript type definitions
│   │   ├── api.types.ts                     # API response types
│   │   ├── user.types.ts                    # User related types
│   │   ├── patient.types.ts                 # Patient types
│   │   └── diagnosis.types.ts               # Diagnosis result types
│   │
│   ├── utils/                               # Utility functions
│   │   ├── api-client.ts                    # Axios instance
│   │   ├── auth-helpers.ts                  # Auth utility functions
│   │   ├── formatters.ts                    # Data formatting
│   │   └── validators.ts                    # Form validators
│   │
│   ├── styles/                              # Global styles
│   │   └── globals.css                      # Tailwind imports
│   │
│   ├── public/                              # Static assets
│   │   ├── service-worker.js                # Offline caching
│   │   └── favicon.ico                      # App icon
│   │
│   └── index.css                            # Root styles
│
├── index.html                               # HTML entry point
├── package.json                             # Dependencies & scripts
├── pnpm-lock.yaml                           # Dependency lock file
├── vite.config.ts                           # Vite build config
├── tsconfig.json                            # TypeScript config
├── tailwind.config.js                       # Tailwind styling config
├── postcss.config.js                        # PostCSS config
├── .env.example                             # Environment template
├── .eslintrc.json                           # ESLint config
└── README.md                                # This file
```

---

## 🎨 Core Features & Pages

### 1. **Login & Authentication** (`Login.tsx`)
- Email/password authentication
- Role-based dashboard redirect
- Session persistence via Redux
- Error message display
- Remember me functionality

**Workflow:**
```
User Input → Auth Service → Redux Store → Route Redirect
```

### 2. **Admin Dashboard** (`AdminDashboard.tsx`)
Comprehensive 9-section dashboard for system administration:

**Section 1: Healthcare Professionals**
- Table of all physicians and radiologists
- Actions: View professional profile
- Navigates to `/profession-details/{id}`

**Section 2: Patient Registry**
- Searchable patient list
- Fields: name, email, gender, registration date
- Filter and sort capabilities

**Section 3: Diagnosis Results**
- All TB analysis results
- Filter by status (positive, negative, pending)
- View predictions and confidence scores

**Section 4: Daily Summary**
- Statistics cards (today's analyses, healthy, at-risk)
- Real-time metrics

**Section 5: Recent Activities**
- Timeline of latest diagnoses
- 8 most recent entries
- Timestamp tracking

**Section 6: Patient Demographics**
- Gender distribution breakdown
- Visual pie/bar chart
- Demographic insights

**Section 7: System Health & Metrics**
- Completion rate percentage
- Positive rate statistics
- Average confidence scores

**Section 8: 7-Day Diagnostic Trends**
- Bar chart showing daily analysis volume
- Trend visualization
- Historical data

**Section 9: System Activity Logs**
- Audit trail table
- Color-coded severity levels (info, warning, error, critical)
- Timestamp and message details

### 3. **Professional Details Page** (`ProfessionDetailsPage.tsx`)
- Healthcare professional profile information
- All patients managed by professional
- Sticky header with professional info
- Searchable patients table

### 4. **Physician Dashboard** (`PhysicianDashboard.tsx`)
- Customized dashboard for physicians
- Shows only physician's own patients
- Real-time floating info card:
  - Current physician info
  - Live date/time (updates every second)
- Missing X-rays button (clickable)
- Filtered statistics

### 5. **Missing X-rays Management Page** (`MissingXraysManagementPage.tsx`)
- Lists patients without X-rays assigned to physician
- **Edit Mode**: Inline editing of patient details
  - First name, last name, phone, address
  - Medical history, allergies
- **X-Ray Upload**: 
  - File picker for image
  - Base64 encoding
  - Submit for TB diagnosis
- Auto-remove from list after successful upload

---

## 🔐 State Management with Redux

### Auth Slice (`authSlice.ts`)

**State Structure:**
```typescript
{
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "SUPER_ADMIN" | "PHYSICIAN" | "RADIOLOGIST";
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

**Actions:**
- `loginUser` - Async thunk for login
- `registerUser` - Async thunk for registration
- `logout` - Clear auth state
- `refreshAccessToken` - Refresh token logic
- `autoLogin` - Restore from localStorage

**Example Usage:**
```typescript
const { user, isAuthenticated, loading } = useSelector(state => state.auth);
const dispatch = useDispatch();

const handleLogin = (email: string, password: string) => {
  dispatch(loginUser({ email, password }));
};
```

### UI Slice (Optional)
For managing modal visibility, toast notifications, sidebar state

**State Structure:**
```typescript
{
  modals: {
    patientDetailsOpen: boolean;
    resultDetailsOpen: boolean;
    uploadOpen: boolean;
  };
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>;
}
```

---

## 🔌 Service Layer

All API communication through service classes with error handling.

### Auth Service (`authService.ts`)
```typescript
async login(email: string, password: string)
async register(userData: RegisterData)
async logout()
async refreshToken()
async validateToken()
```

### Patients Service (`patientsService.ts`)
```typescript
async getPatients(filters?)
async getPatientById(id: string)
async createPatient(data: PatientInput)
async updatePatient(id: string, data: Partial<PatientInput>)
async deletePatient(id: string)
async uploadXRay(patientId: string, file: File)
```

### Users Service (`usersService.ts`)
```typescript
async getAllUsers(role?: UserRole)
async getUserById(id: string)
async getPhysicians()
async getRadiologists()
```

### Results Service (`resultsService.ts`)
```typescript
async getDiagnosisResults(filters?)
async getResultById(id: string)
async getPatientResults(patientId: string)
```

### Logs Service (`logsService.ts`)
```typescript
async getLogs(pagination?)
async getRecentLogs()
async getErrorLogs()
async getAuditLogs()
```

---

## 🔐 Authentication & Routing

### Protected Routes (`ProtectedRoute.tsx`)

```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Role-Protected Routes */}
  <Route element={<RoleProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']} />}>
    <Route path="/admin-dashboard" element={<AdminDashboard />} />
  </Route>
  
  <Route element={<RoleProtectedRoute requiredRoles={['PHYSICIAN']} />}>
    <Route path="/physician-dashboard" element={<PhysicianDashboard />} />
    <Route path="/missing-xrays" element={<MissingXraysManagementPage />} />
  </Route>
  
  {/* Catch-All */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Role-Based Redirects

**After Login:**
- `ADMIN` / `SUPER_ADMIN` → `/admin-dashboard`
- `PHYSICIAN` / `RADIOLOGIST` → `/physician-dashboard`
- Unknown role → `/login`

### Token Management
- **Access Token**: 1 hour expiration
- **Refresh Token**: 7 days expiration
- **Auto-Refresh**: Before token expires
- **Persistence**: Redux + localStorage

---

## 🎨 Styling & Components

### Tailwind CSS Configuration
- Custom color palette
- Responsive breakpoints
- Component class utilities
- Dark mode support (optional)

### Key Styling Patterns

**Sticky Headers:**
```typescript
<div className="sticky top-0 z-10 bg-white shadow-sm">
  {/* Header content */}
</div>
```

**Responsive Tables:**
```typescript
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

**Modal Overlay:**
```typescript
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  {/* Modal content */}
</div>
```

### Toast Notifications (Sonner)
```typescript
import { toast } from 'sonner';

toast.success('Patient added successfully');
toast.error('Failed to upload X-ray');
toast.info('Processing...');
```

---

## ⚙️ Configuration

### Environment Variables

**File:** `.env.local`

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `30000` |
| `VITE_ENABLE_SERVICE_WORKER` | Enable offline support | `true` |
| `VITE_APP_NAME` | Application title | `Eafia TB Detection` |

### API Configuration (`api.config.ts`)

```typescript
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refresh: '/auth/refresh'
    },
    patients: '/patients',
    users: '/users',
    results: '/predictions',
    logs: '/logs'
  }
};
```

---

## 🛠️ Development Workflow

### Start Development Server
```bash
pnpm dev
```

Server runs at `http://localhost:5173` with hot module reload.

### Build for Production
```bash
pnpm build
```

Creates optimized build in `dist/` directory.

### Type Checking
```bash
pnpm type-check
```

Validate all TypeScript types without building.

### Preview Production Build
```bash
pnpm preview
```

Test production build locally.

### Formatting & Linting
```bash
# Format code
pnpm format

# Check linting
pnpm lint

# Fix linting issues
pnpm lint --fix
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_URL
```

### Netlify
1. Connect GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables in UI

### Docker
```bash
# Build image
docker build -t eafia-client:latest .

# Run container
docker run -p 3000:3000 eafia-client:latest
```

### Traditional Hosting
1. Run `pnpm build`
2. Upload `dist/` folder to web server
3. Configure server for SPA routing (404s → index.html)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Module not found errors** | Run `pnpm install` to install all dependencies |
| **API connection refused** | Ensure backend API is running on http://localhost:3000 |
| **CORS errors** | Update `VITE_API_URL` in `.env.local` to match backend |
| **Redux state not persisting** | Check localStorage is not disabled in browser |
| **Service worker issues** | Clear browser cache and hard refresh (Ctrl+Shift+R) |
| **Build fails** | Run `pnpm clean` then `pnpm install` and retry |
| **Type errors** | Run `pnpm type-check` for full diagnostic |
| **Slow performance** | Check Network tab in DevTools for large payloads |

---

## ⚡ Performance

### Optimization Techniques
- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Responsive images with srcset
- **Caching Strategy** - Service Worker with network-first approach
- **Bundle Analysis** - Monitor bundle size growth

### Best Practices
```bash
# Check bundle size
npm run build -- --analyze

# Monitor performance
pnpm dev -- --debug

# Profile component rendering
React DevTools Profiler
```

### Performance Targets
- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Bundle Size**: < 300KB gzipped
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

---

## 📞 Support & Resources

### Documentation
- **[API_REFERENCE.md](../api/TB_DETECTION_API_GUIDE.md)** - Backend endpoint documentation
- **[SETUP_GUIDE.md](../api/SETUP_GUIDE.md)** - Detailed setup instructions
- **[DATABASE_SCHEMA.md](../api/DATABASE_SCHEMA_GUIDE.md)** - Database structure

### External Resources
- [React Documentation](https://react.dev)
- [Redux Toolkit Guide](https://redux-toolkit.js.org)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

### Community
- GitHub Issues - Report bugs
- GitHub Discussions - Ask questions
- Email Support - contact@eafia.com

---

## 📝 License

Part of the Eafia TB Detection System

## 🎓 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18.2.0 |
| **Language** | TypeScript 5.0+ |
| **State Management** | Redux Toolkit 2.11.2 |
| **HTTP Client** | Axios 1.14.0 |
| **Router** | React Router v7.9.4 |
| **Styling** | Tailwind CSS 3.4.18 |
| **Data Fetching** | React Query 5.96.0 |
| **Build Tool** | Vite 5.2.0 |
| **Icons** | React Icons 5.6.0 |
| **Notifications** | Sonner 2.0.7 |

---

**🎯 Ready to diagnose TB with confidence!**

For questions or issues, check the documentation or open an issue on GitHub.

Get started by running:
```bash
pnpm install && pnpm dev
```

Then open `http://localhost:5173` in your browser. 🚀
