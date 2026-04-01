# Frontend to Backend Integration Guide

## 🔌 API Endpoint Integration Points

### 1. Patient Creation
**File:** `api.ts` → `createPatient()`
**Component:** `PatientIntakeForm.tsx` → `handleSubmit()`

```typescript
// Expected Backend Endpoint
POST /api/patients
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "age": 30,
  "gender": "male",
  "medicalHistory": "Optional text..."
}

// Expected Response
{
  "patientId": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "gender": "male",
  "createdAt": "2026-03-30T12:00:00Z"
}
```

### 2. X-ray Upload
**File:** `api.ts` → `uploadXrayImages()`
**Component:** `PatientIntakeForm.tsx` → `handleSubmit()`

```typescript
// Expected Backend Endpoint
POST /api/xray/upload/:patientId
Content-Type: multipart/form-data

FormData:
  - images[0]: File (binary)
  - images[1]: File (binary)
  - images[2]: File (binary)
  - diseaseType: "tuberculosis"
  - symptoms: "Persistent cough..."

// Expected Response
{
  "jobId": "job-uuid-string",
  "patientId": "patient-uuid-string",
  "status": "processing",
  "message": "X-rays uploaded successfully"
}
```

### 3. Job Status Polling
**File:** `api.ts` → `pollJobStatus()`
**Component:** `DiagnosticResults.tsx` → `useEffect`

```typescript
// Expected Backend Endpoint
GET /api/xray/status/:jobId

// Expected Response (In Progress)
{
  "jobId": "job-uuid",
  "status": "processing",
  "progress": 75,
  "result": null,
  "error": null,
  "createdAt": "2026-03-30T12:00:00Z"
}

// Expected Response (Completed)
{
  "jobId": "job-uuid",
  "status": "completed",
  "progress": 100,
  "result": {
    "diseaseType": "tuberculosis",
    "prediction": {
      "detected": true,
      "confidence": 0.92
    },
    "affectedAreas": ["Upper right lobe", "Middle lobe"],
    "heatmap_url": "http://...base64-or-url...",
    "riskLevel": "high",
    "recommendations": ["See doctor", "..."],
    "nextSteps": ["Schedule appointment", "..."]
  },
  "error": null,
  "completedAt": "2026-03-30T12:05:00Z"
}

// Expected Response (Failed)
{
  "jobId": "job-uuid",
  "status": "failed",
  "result": null,
  "error": "Invalid image format or processing error",
  "completedAt": "2026-03-30T12:05:00Z"
}
```

### 4. Get Results (Alternative to Polling)
**File:** `api.ts` → `getDiagnosticResults()`
**Optional:** Use if you don't want to poll

```typescript
// Expected Backend Endpoint
GET /api/results/:jobId

// Expected Response (Same as polling success)
{
  "jobId": "job-uuid",
  "patientId": "patient-id",
  "diseaseType": "tuberculosis",
  "prediction": {
    "detected": true,
    "confidence": 0.92,
    "affectedAreas": ["Upper right lobe", "Middle lobe"]
  },
  "heatmap": "base64-string-or-url",
  "riskLevel": "high",
  "recommendations": ["..."],
  "nextSteps": ["..."],
  "timestamp": "2026-03-30T12:05:00Z"
}
```

### 5. Real-time Prediction (Single Image)
**File:** `api.ts` → `predictXray()`
**Optional:** Use for instant feedback

```typescript
// Expected Backend Endpoint
POST /api/xray/predict
Content-Type: multipart/form-data

FormData:
  - image: File (binary)
  - diseaseType: "tuberculosis"

// Expected Response
{
  "prediction": "positive",  // or "negative"
  "confidence": 0.92,
  "heatmap": "base64-string-or-url"
}
```

### 6. Health Check
**File:** `api.ts` → `getHealthStatus()`
**Optional:** Use to verify system is ready

```typescript
// Expected Backend Endpoint
GET /api/health

// Expected Response
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "ml_service": "healthy",
    "storage": "healthy"
  }
}
```

## 📋 Implementation Checklist

### Backend Gateway Updates Required

- [ ] Create `/api/patients` POST endpoint
  - Input validation (firstName, lastName, email, age, gender)
  - Create patient record in database
  - Return patient with ID

- [ ] Create `/api/xray/upload/:patientId` POST endpoint
  - Accept form-data with multiple image files
  - Validate image types and sizes
  - Store images (S3/Supabase/local)
  - Create job queue entry
  - Return jobId and status
  - Call ML service asynchronously

- [ ] Create `/api/xray/status/:jobId` GET endpoint
  - Return job status (processing, completed, failed)
  - Include progress percentage
  - Return results when complete
  - Return error message if failed

- [ ] Create `/api/results/:jobId` GET endpoint
  - Return final diagnostic results
  - Include all analysis data
  - Include heatmap URL/data

- [ ] Create `/api/xray/predict` POST endpoint
  - Accept single image file
  - Call ML service for real-time prediction
  - Return instant prediction results

- [ ] Create `/api/health` GET endpoint
  - Check database connectivity
  - Check ML service connectivity
  - Check storage service connectivity
  - Return status of all services

### Frontend Testing Steps

1. **Manually test landing page**
   ```bash
   npm start
   # Navigate to http://localhost:3000
   # Verify all sections load
   ```

2. **Test patient intake form**
   ```bash
   # Click "Start Diagnosis"
   # Fill Step 1 → Click Next
   # Fill Step 2 → Click Next
   # Upload X-rays → Submit
   ```

3. **Test with mock API**
   ```typescript
   // Temporarily mock in api.ts if backend not ready
   submitPatientIntake: async (data) => {
     return {
       patientId: "test-123",
       jobId: "job-456",
       message: "Success"
     }
   }
   ```

4. **Test with real API**
   ```bash
   # Update API_BASE_URL in api.ts
   const API_BASE_URL = "http://localhost:3000/api";
   # Run full workflow
   ```

5. **Verify results page**
   ```bash
   # Check results display correctly
   # Test print functionality
   # Test download functionality
   ```

## 🔄 Request/Response Flow Diagram

```
User Submits Form
        ↓
PatientIntakeForm.handleSubmit()
        ↓
submitPatientIntake() [api.ts]
        ↓
    ┌───────────────────────┐
    │ 1. createPatient()    │
    │    POST /api/patients │
    └───────────────────────┘
            ↓
        Returns patientId
            ↓
    ┌──────────────────────────────────┐
    │ 2. uploadXrayImages()            │
    │    POST /api/xray/upload/:id     │
    └──────────────────────────────────┘
            ↓
        Returns jobId
            ↓
    Navigate to /results
            ↓
    DiagnosticResults.useEffect()
            ↓
    ┌────────────────────────────────┐
    │ 3. pollJobStatus() [Loop]      │
    │    GET /api/xray/status/:id    │
    │    Check every 2 seconds       │
    └────────────────────────────────┘
            ↓
    Status: completed?
            ↓ YES
    ┌────────────────────────────┐
    │ 4. getDiagnosticResults()  │
    │    GET /api/results/:jobId │
    └────────────────────────────┘
            ↓
    Display Results Page
            ↓
    User can:
    - View analysis
    - Print report
    - Download report
    - Start new analysis
```

## 🛠️ Common Issues & Solutions

### Issue: 404 Not Found
**Cause:** Endpoint doesn't exist on backend
**Solution:** Check backend is running on port 3000 and endpoints are implemented

### Issue: CORS Error
**Cause:** Backend not configured for CORS
**Solution:** Add CORS middleware to NestJS app:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Issue: File Upload Fails
**Cause:** File size limit or type validation
**Solution:** Check backend validates same types (JPEG, PNG, WebP) and size < 10MB

### Issue: Job Status Returns null
**Cause:** Job not found or processing hasn't started
**Solution:** Verify jobId is correct and ML service is running

### Issue: Heatmap Not Displaying
**Cause:** Heatmap URL is invalid or backend returning base64 instead of URL
**Solution:** Check if base64 is prefixed with data:image/png;base64, or return proper URL

## 📚 Environment Variables

Add to root `.env` file if not already present:

```env
# React App
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENVIRONMENT=development

# Optional: For production
# REACT_APP_API_URL=https://api.example.com
```

## 🚀 Deployment Checklist

- [ ] Update API_BASE_URL to production URL
- [ ] Enable HTTPS
- [ ] Configure production CORS
- [ ] Set secure cookie flags
- [ ] Add request rate limiting
- [ ] Implement request logging
- [ ] Configure error tracking (Sentry)
- [ ] Set up CDN for static assets
- [ ] Configure database backups
- [ ] Set up monitoring and alerts

## 📞 Troubleshooting Commands

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Check network requests in browser
# Open DevTools → Network tab
# Submit form and watch requests

# Check API response
# Open DevTools → Network tab
# Click on request
# View Response tab for data

# Check console for errors
# Open DevTools → Console
# Look for fetch/Axios errors
```

---

This integration guide provides all the information needed to connect the frontend UI with the backend API Gateway.
