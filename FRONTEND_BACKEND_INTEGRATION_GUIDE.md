# Frontend-Backend Integration Guide

## Overview

This guide describes the complete integration between the React frontend and NestJS backend for the Tuberculosis Detection application. All frontend-backend communication is now configured with proper API services, authentication, and type-safe endpoints.

## 🎯 What Has Been Configured

### 1. ✅ Centralized API Configuration (`config/api.config.ts`)

A single source of truth for all API-related configuration:

```typescript
// Base URL configuration - auto-detects environment
export const API_BASE_URL = getApiBaseUrl(); // http://localhost:3000/api

// Type-safe endpoint mapping
export const API_ENDPOINTS = {
  AUTH: { REGISTER, LOGIN, REFRESH_TOKEN, ME, LOGOUT },
  PATIENTS: { CREATE, GET_ALL, GET_BY_ID, UPDATE, DELETE, GET_XRAYS, GET_RESULTS },
  XRAYS: { CREATE, GET_ALL, GET_BY_ID, UPDATE, DELETE, GET_BY_PATIENT, UPDATE_STATUS },
  RESULTS: { CREATE, GET_ALL, GET_BY_ID, UPDATE, DELETE, GET_BY_PATIENT },
  HEALTH: { CHECK },
};
```

**How to set the API base URL:**

- Development: Default is `http://localhost:3000/api`
- Production: Use environment variables:
  ```env
  VITE_API_BASE_URL=https://your-api-domain.com/api
  # OR
  VITE_API_PORT=3001
  ```

### 2. ✅ Authentication Service (`services/authService.ts`)

Professional authentication client with:

- **Automatic JWT token management** (access + refresh tokens)
- **Request interceptor** - Automatically adds Bearer token to requests
- **Response interceptor** - Handles 401 errors and refreshes tokens
- **Error handling** - Centralized error management
- **Token persistence** - localStorage integration

**Key Methods:**

```typescript
// Login
const response = await authService.login({ email, password });
// Returns: { id, email, firstName, lastName, role, accessToken, refreshToken, expiresIn }

// Register
const response = await authService.register({
  email, firstName, lastName, password,
  role?: 'PHYSICIAN' | 'ADMIN' | 'RADIOLOGIST' | 'SUPER_ADMIN',
  license?, specialization?, phone?
});

// Refresh Token
const response = await authService.refreshToken(refreshToken);
// Returns: { accessToken, expiresIn }

// Current User
const user = authService.getStoredUser();

// Check Authentication
const isAuth = authService.isAuthenticated();

// Logout
await authService.logout();
```

### 3. ✅ Patients Service (`services/patientsService.ts`)

Complete patient management with X-ray integration:

```typescript
// Create patient with X-ray (base64 or file)
const patient = await patientsService.createPatient({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 45,
  gender: 'MALE',
  medicalHistory: '...',
  imageBase64: 'data:image/jpeg;base64,...' // OR imageFile: File
});
// Returns patient with xrays[] and diagnosisResults[]

// Get all patients (physicians see own, admins see all)
const patients = await patientsService.getAllPatients();

// Get specific patient
const patient = await patientsService.getPatientById(patientId);

// Update patient
const patient = await patientsService.updatePatient(patientId, {
  firstName?, lastName?, email?, age?, gender?, medicalHistory?
});

// Delete patient (admin only)
await patientsService.deletePatient(patientId);

// Get patient's X-rays
const xrays = await patientsService.getPatientXRays(patientId);

// Get patient's diagnosis results
const results = await patientsService.getPatientDiagnosisResults(patientId);
```

### 4. ✅ Results Service (`services/resultsService.ts`)

Diagnosis results management:

```typescript
// Create result
const result = await resultsService.createResult({
  patientId, diseaseType, prediction, confidence,
  affectedAreas?, severity?, recommendations?, notes?
});

// Get all results
const results = await resultsService.getAllResults();

// Get specific result
const result = await resultsService.getResultById(resultId);

// Get patient's results
const results = await resultsService.getPatientResults(patientId);

// Update result
const result = await resultsService.updateResult(resultId, { /* changes */ });

// Delete result
await resultsService.deleteResult(resultId);
```

### 5. ✅ Updated AuthContext (`context/AuthContext.tsx`)

Complete rewrite using real API calls:

```typescript
// Usage in components
const { user, login, register, logout, isLoggedIn, isAdmin, isPhysician, error } = useAuth();

// Login
await login(email, password);

// Register
await register(
  email, firstName, lastName, password,
  'PHYSICIAN', // role
  license, specialization, phone
);

// Logout
await logout();
```

**Automatic token refresh:**
- If access token expires (401 response), system automatically refreshes using refresh token
- No need to handle token refresh in components!

### 6. ✅ Updated Redux TB Slice (`redux/slices/tbSlice.ts`)

TB prediction workflow now uses real API:

```typescript
// Create patient with TB diagnosis in one call
const response = await dispatch(createPatientWithTBDiagnosis({
  firstName, lastName, email, age, gender,
  imageFile: File, // OR imageBase64: string
  medicalHistory?
}));
// Backend automatically:
// 1. Stores patient
// 2. Validates X-ray (calls Python ML API)
// 3. Generates TB prediction
// 4. Stores diagnosis result
// 5. Returns everything

// Get TB diagnosis for existing patient
const response = await dispatch(getTBDiagnosis(patientId));

// Get all TB results
const results = await dispatch(getAllTBResults());
```

**Redux state structure:**

```typescript
state.tb = {
  loading: boolean,
  diagnosis: {
    patient: PatientResponse,
    diagnosis: ResultResponse,
    prediction: string,
    confidence: number,
    affectedAreas?: string[],
    recommendations: string[]
  },
  patient: PatientResponse,
  allResults: ResultResponse[],
  error: string | null,
  success: boolean
}
```

## 📋 Data Flow Diagrams

### User Registration & Login Flow

```
User Input (Email, Password, etc.)
           ↓
    AuthContext (useAuth hook)
           ↓
    authService.register()
           ↓
    Axios HTTP Request → Backend /auth/register
           ↓
    Interceptor adds JWT to future requests
           ↓
    Response stored in localStorage (authToken, user)
           ↓
    AuthContext updates global state
           ↓
    Components (useAuth hook) re-render with user data
```

### Patient Creation with TB Diagnosis Flow

```
User uploads X-ray file & enters patient info
           ↓
    TBPredictionComponent triggers dispatch()
           ↓
    Redux thunk: createPatientWithTBDiagnosis()
           ↓
    Convert image to base64 (if file)
           ↓
    patientsService.createPatient()
           ↓
    Axios HTTP (multipart/form-data or JSON)
           ↓
    Interceptor adds Authorization: Bearer TOKEN
           ↓
    Backend: NestJS Patient Controller
           ↓
    Backend: Validate X-ray (calls Python ML API)
           ↓
    Backend: Generate TB diagnosis (calls Python ML API)
           ↓
    Backend: Store patient + results in database
           ↓
    Response with patient + diagnosis
           ↓
    Redux thunk resolves with TBDiagnosisResponse
           ↓
    Redux state updates (diagnosis, patient, allResults)
           ↓
    Component displays results (confidence, predictions, heat map)
```

### Authentication & Protected Requests Flow

```
All API Requests
           ↓
    Axios Interceptor (Request level)
           ↓
    Read authToken from localStorage
           ↓
    Add "Authorization: Bearer TOKEN" header
           ↓
    Send request to backend
           ↓
    Backend receives and validates JWT
           ↓
    If token valid → Process request
    If token expired → Return 401
           ↓
    Response received by Axios Interceptor (Response level)
           ↓
    If 401 → Call refreshToken()
           ↓
    Refresh endpoint returns new accessToken
           ↓
    Update localStorage with new token
           ↓
    Retry original request with new token
           ↓
    If refresh fails → Clear auth, redirect to /login
```

## 🔧 Environment Configuration

### Development Setup

1. **Create `.env.local` in `/Eafia/client/`:**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
# OR use port-based (if running on different port)
# VITE_API_PORT=3001

# Other environment variables
VITE_DEBUG=true
```

2. **Start Backend:**

```bash
cd Eafia/api
npm install
npm run start:dev
```

3. **Start Frontend:**

```bash
cd Eafia/client
npm install
npm run dev
```

### Production Setup

1. **Build Frontend:**

```bash
cd Eafia/client
npm run build
```

2. **Set Production API URL:**

```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

3. **Serve built frontend and backend on same domain or handle CORS**

## ✅ Testing Endpoints

### 1. Test Authentication Flow

```bash
# Register a new physician
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"physician@hospital.com",
    "firstName":"Dr. John",
    "lastName":"Smith",
    "password":"SecurePass@123456",
    "role":"PHYSICIAN",
    "license":"LIC-2024-001",
    "specialization":"Pulmonology"
  }'

# Response:
# {
#   "data": {
#     "id": "uuid",
#     "email": "physician@hospital.com",
#     "firstName": "Dr. John",
#     "lastName": "Smith",
#     "role": "PHYSICIAN",
#     "accessToken": "eyJhbGc...",
#     "refreshToken": "eyJhbGc...",
#     "expiresIn": "24h"
#   },
#   "message": "User registered successfully",
#   "statusCode": 201
# }
```

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"physician@hospital.com",
    "password":"SecurePass@123456"
  }'
```

### 2. Test Patient Creation with X-ray

```bash
TOKEN="<token from login>"

# Create patient (JSON with base64 image)
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Pneumonia Patient",
    "email":"john@testpatient.com",
    "age":45,
    "gender":"MALE",
    "medicalHistory":"Previous lung infection",
    "imageBase64":"data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'

# OR Create patient (Multipart with file)
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -F "firstName=John" \
  -F "lastName=Pneumonia Patient" \
  -F "email=john@testpatient.com" \
  -F "age=45" \
  -F "gender=MALE" \
  -F "imageFile=@/path/to/chest-xray.jpg"
```

### 3. Test Patient Retrieval

```bash
# Get all patients
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN"

# Get specific patient
curl -X GET http://localhost:3000/api/patients/<patient-id> \
  -H "Authorization: Bearer $TOKEN"

# Get patient's X-rays
curl -X GET http://localhost:3000/api/patients/<patient-id>/xrays \
  -H "Authorization: Bearer $TOKEN"

# Get patient's diagnosis results
curl -X GET http://localhost:3000/api/patients/<patient-id>/results \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test Results Retrieval

```bash
# Get all TB results
curl -X GET http://localhost:3000/api/results \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Get specific result
curl -X GET http://localhost:3000/api/results/<result-id> \
  -H "Authorization: Bearer $TOKEN"

# Get patient's results
curl -X GET http://localhost:3000/api/results/patient/<patient-id> \
  -H "Authorization: Bearer $TOKEN"
```

## 🎯 Common Component Usage Examples

### Login Component

```typescript
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Auto-redirected by component login logic
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### TB Diagnosis Component

```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createPatientWithTBDiagnosis } from '../redux/slices/tbSlice';

export function TBDiagnosisComponent() {
  const dispatch = useAppDispatch();
  const { loading, diagnosis, error, success } = useAppSelector(state => state.tb);
  const [xrayFile, setXrayFile] = useState<File | null>(null);

  const handleSubmit = async (patientData: PatientFormData) => {
    if (!xrayFile) {
      alert('Please upload X-ray image');
      return;
    }

    const result = await dispatch(createPatientWithTBDiagnosis({
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      email: patientData.email,
      age: patientData.age,
      gender: patientData.gender,
      imageFile: xrayFile,
      medicalHistory: patientData.medicalHistory
    }));

    if (result.type.endsWith('fulfilled')) {
      console.log('Patient created successfully:', diagnosis);
      // Display diagnosis results to user
    }
  };

  return (
    <div>
      {/* Form inputs */}
      <input type="file" accept="image/*" onChange={e => setXrayFile(e.target.files?.[0] || null)} />
      <button onClick={handleSubmit} disabled={loading || !xrayFile}>
        {loading ? 'Analyzing...' : 'Analyze X-ray'}
      </button>

      {error && <div className="error">{error}</div>}
      
      {success && diagnosis && (
        <div className="diagnosis-result">
          <h3>TB Prediction: {diagnosis.prediction}</h3>
          <p>Confidence: {(diagnosis.confidence * 100).toFixed(2)}%</p>
          <ul>
            {diagnosis.recommendations?.map(rec => <li key={rec}>{rec}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Patient List Component

```typescript
import { useEffect, useState } from 'react';
import { patientsService, PatientResponse } from '../services/patientsService';

export function PatientListComponent() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await patientsService.getAllPatients();
        setPatients(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Patients</h2>
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            {patient.firstName} {patient.lastName} - {patient.email}
            <p>Created: {new Date(patient.createdAt).toLocaleDateString()}</p>
            {patient.diagnosisResults && patient.diagnosisResults.length > 0 && (
              <p>Diagnosis Results: {patient.diagnosisResults.length}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔒 Security Features Implemented

1. **JWT Token Management**
   - Access token stored in localStorage
   - Refresh token for token renewal
   - Auto-refresh on 401 response

2. **CORS Protected**
   - Backend validates origin
   - Credentials sent with requests

3. **Authorization**
   - Physician: Sees own patients only
   - Admin: Sees all patients
   - Role-based endpoint access

4. **Request Validation**
   - DTOs validate all inputs
   - Backend type checking

5. **Error Handling**
   - Sanitized error messages
   - No sensitive data in responses

## 🚀 Next Steps

1. **Test all endpoints** using the curl examples above
2. **Update UI components** to use new services instead of static data
3. **Replace hardcoded data** with API calls from patientsService and resultsService
4. **Add error boundaries** for better error handling
5. **Implement loading states** in all async operations
6. **Add toast notifications** for success/error feedback
7. **Handle token expiration** gracefully in UI

## 📚 API Documentation

For complete backend API documentation, visit:
- **Swagger UI**: http://localhost:3000/api (when backend is running)
- **Backend Docs**: `Eafia/api/TB_DETECTION_API_GUIDE.md`
- **Database Schema**: `Eafia/api/DATABASE_SCHEMA_GUIDE.md`

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution:** Ensure backend is running on the correct port and CORS is enabled

```typescript
// In backend main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
});
```

### Issue: 401 Unauthorized

**Solution:** Check that:
1. Token is stored in localStorage with key 'authToken'
2. Backend has correct JWT_SECRET in .env
3. Token hasn't expired

### Issue: Tokens not being sent

**Solution:** Verify interceptor is working:

```typescript
// Check in browser DevTools → Network → Headers
// Should see: Authorization: Bearer eyJhbGc...
```

### Issue: Token not refreshing

**Solution:** Ensure refresh token is stored and valid:

```typescript
// Check localStorage
console.log(localStorage.getItem('authToken'));
console.log(localStorage.getItem('refreshToken'));
```

## 📞 Support

For issues with the integration:
1. Check the error message in the console
2. Verify API_BASE_URL in config/api.config.ts
3. Test endpoints with curl
4. Check backend logs for detailed errors
5. Ensure JWT_SECRET is set correctly in backend .env

---

**Last Updated**: March 31, 2026  
**Backend**: NestJS v11+ with TypeORM  
**Frontend**: React v19+ with Redux Toolkit  
**Version**: 1.0.0
