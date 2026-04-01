# Complete End-to-End Testing Guide

## 🚀 Quick Start - Test Everything Once

This guide will help you test the complete frontend-backend integration in 10 minutes.

## Prerequisites

1. **Backend Running**
```bash
cd Eafia/api
npm install
npm run start:dev
```
Backend should be running on: `http://localhost:3000`

2. **Frontend Setup**
```bash
cd Eafia/client
npm install
```

3. **Environment Configuration**

Create `.env.local` in `Eafia/client/`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG=false
```

## 🧪 Testing Procedure

### Phase 1: Test API Configuration (2 min)

Run in `Eafia/client/`:
```bash
npm run dev
```

Open browser console and run:
```typescript
// Import the config
import { API_BASE_URL, API_ENDPOINTS } from './src/config/api.config';

// Check that URLs are correct
console.log('API Base URL:', API_BASE_URL);
console.log('Auth Endpoints:', API_ENDPOINTS.AUTH);
// Should show: http://localhost:3000/api and auth paths
```

**Expected Result:** Console shows correct base URL and endpoints

---

### Phase 2: Test Authentication (3 min)

#### A. Test Registration

In browser console or using curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testphysician@hospital.com",
    "firstName":"Dr. Test",
    "lastName":"Physician",
    "password":"TestPassword@123456",
    "role":"PHYSICIAN",
    "license":"LIC-TEST-001",
    "specialization":"Pulmonology",
    "phone":"+1234567890"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "testphysician@hospital.com",
    "firstName": "Dr. Test",
    "lastName": "Physician",
    "role": "PHYSICIAN",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": "24h"
  },
  "message": "User registered successfully",
  "statusCode": 201
}
```

**Check:** 
- ✅ User created in database
- ✅ Tokens generated
- ✅ localStorage has `authToken`, `refreshToken`, and `user`

#### B. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testphysician@hospital.com",
    "password":"TestPassword@123456"
  }'
```

**Expected Response:** Same as registration response with new tokens

**Check:**
- ✅ Same tokens returned
- ✅ localStorage updated
- ✅ Can use token for authenticated requests

---

### Phase 3: Test Patient Creation (3 min)

#### Step 1: Get X-ray Image (Base64)

Use any chest X-ray image (JPEG/PNG). Convert to base64 or use file upload.

#### Step 2: Create Patient with X-ray

```bash
TOKEN="<accessToken from login>"

curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"TestPatient",
    "email":"john@testpat.com",
    "age":45,
    "gender":"MALE",
    "medicalHistory":"No known allergies, previous lung infection 2022",
    "imageBase64":"data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

**Expected Response:**
```json
{
  "data": {
    "id": "patient-uuid",
    "firstName": "John",
    "lastName": "TestPatient",
    "email": "john@testpat.com",
    "age": 45,
    "gender": "MALE",
    "medicalHistory": "...",
    "physicianId": "physician-uuid",
    "createdAt": "2024-03-31T10:00:00Z",
    "xrays": [
      {
        "id": "xray-uuid",
        "status": "COMPLETED",
        "validationConfidence": 0.95
      }
    ],
    "diagnosisResults": [
      {
        "id": "diagnosis-uuid",
        "prediction": "TB detected",
        "confidence": 0.87,
        "affectedAreas": ["upper left lobe"],
        "tbIntensity": "MODERATE",
        "affectedPercentage": 25,
        "recommendations": ["Immediate TB testing", "Consult pulmonologist"]
      }
    ]
  },
  "message": "Patient registered successfully with X-ray validation",
  "statusCode": 201
}
```

**Check:**
- ✅ Patient created in database
- ✅ X-ray validated (COMPLETED status)
- ✅ TB diagnosis generated with confidence score
- ✅ Affected areas identified
- ✅ TB intensity determined
- ✅ Recommendations provided

---

### Phase 4: Test Patient Retrieval (1 min)

#### Get All Patients

```bash
TOKEN="<accessToken>"

curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "patient-uuid",
      "firstName": "John",
      "lastName": "TestPatient",
      // ... full patient data
    }
  ],
  "message": "Patients retrieved successfully",
  "statusCode": 200
}
```

#### Get Specific Patient

```bash
curl -X GET http://localhost:3000/api/patients/<patient-id> \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Patient's X-rays

```bash
curl -X GET http://localhost:3000/api/patients/<patient-id>/xrays \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Patient's Diagnosis Results

```bash
curl -X GET http://localhost:3000/api/patients/<patient-id>/results \
  -H "Authorization: Bearer $TOKEN"
```

**Check:**
- ✅ Can retrieve all patients
- ✅ Physician sees only own patients
- ✅ Admin sees all patients
- ✅ X-rays properly linked to patients
- ✅ Diagnosis results properly linked to patients

---

### Phase 5: Test Results API (1 min)

#### Get All Results

```bash
curl -X GET http://localhost:3000/api/results \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Specific Result

```bash
curl -X GET http://localhost:3000/api/results/<result-id> \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Patient's Results

```bash
curl -X GET http://localhost:3000/api/results/patient/<patient-id> \
  -H "Authorization: Bearer $TOKEN"
```

**Check:**
- ✅ Results retrievable
- ✅ Correct fields populated
- ✅ Access control enforced

---

## ✅ Final Checklist

After testing, verify:

- [ ] API Base URL correctly configured
- [ ] Registration creates user with valid token
- [ ] Login returns same user with new token
- [ ] Patient creation works with base64 image
- [ ] X-ray validation called (Python ML API)
- [ ] TB diagnosis generated with confidence score
- [ ] Affected areas/intensity determined
- [ ] Patient retrieval returns all linked data
- [ ] Results API works
- [ ] Tokens persist in localStorage
- [ ] 401 errors handled and redirect to login
- [ ] Physician access control enforced

## 🔧 Debugging Commands

### Check API Configuration
```bash
# In browser console
import { API_BASE_URL } from './src/config/api.config';
console.log(API_BASE_URL);
```

### Check Stored Tokens
```bash
# In browser console
console.log('Access Token:', localStorage.getItem('authToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
console.log('User:', localStorage.getItem('user'));
```

### Check Request Headers
```bash
# Chrome DevTools → Network tab
# Click any request and check Headers tab
# Should see: Authorization: Bearer TOKEN
```

### Verify Backend Logs
```bash
# Backend console should show:
# [Nest] ...... - 03/31/2024, 10:00:00 AM     LOG [AuthController] User registered
# [Nest] ...... - 03/31/2024, 10:00:01 AM     LOG [PatientsController] Patient created
```

## 🐛 Troubleshooting

### CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Ensure backend has CORS enabled
2. Check `http://localhost:3000/api` is accessible
3. Try: `curl http://localhost:3000/health`

### 401 Unauthorized
**Error:** `Authorization failed`

**Solution:**
1. Verify token in localStorage: `localStorage.getItem('authToken')`
2. Check token is being sent: DevTools → Network → Headers → Authorization
3. Check JWT_SECRET in backend .env matches

### Patient Creation Fails
**Error:** `Failed to create patient`

**Solution:**
1. Ensure imageBase64 has valid format: `data:image/jpeg;base64,`
2. Check image isn't corrupted
3. Try image under 5MB first
4. Check backend logs for detailed error

### No Diagnosis Generated
**Error:** Patient created but `diagnosisResults` empty

**Solution:**
1. Check Python ML API is running
2. Check backend logs for: `Error calling Python API`
3. Verify X-ray is valid medical image
4. Check Python service endpoints in backend config

## 📊 Performance Testing

### Measure Response Times

```bash
# Register
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/auth/register

# Create Patient (with X-ray processing)
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/patients
```

**Expected Performance:**
- Register: < 200ms
- Login: < 200ms
- Create Patient: 500ms - 2s (depends on ML processing)
- Get Patient: < 100ms
- Get Results: < 100ms

## 🎓 Learning Resources

- **Full Integration Guide**: `Eafia/client/FRONTEND_BACKEND_INTEGRATION_GUIDE.md`
- **Backend API Docs**: Visit `http://localhost:3000/api` (Swagger UI)
- **Database Schema**: `Eafia/api/DATABASE_SCHEMA_GUIDE.md`
- **Configuration Guide**: `Eafia/api/COMPLETE_SETUP_GUIDE.md`

## 📝 Next Steps After Testing

1. **Update UI Components** to use new API services
2. **Remove Hardcoded Data** from components
3. **Add Loading States** to all async operations
4. **Implement Error Boundaries** for better UX
5. **Add Toast Notifications** for user feedback
6. **Create Protected Routes** that check authentication
7. **Test Role-Based Access Control** (Physician vs Admin)
8. **Set up CI/CD** for automated testing

## ✨ Pro Tips

1. **Use Redux DevTools** to inspect state changes
2. **Use Network Tab** to inspect API requests/responses
3. **Use Console** to debug errors
4. **Set breakpoints** in debugger for step-through debugging
5. **Use curl with -v** flag for verbose request/response info

---

**Your complete frontend-backend integration is ready for testing!**

Start with Phase 1 and work through each phase systematically. All should pass without errors.

Good luck! 🚀
