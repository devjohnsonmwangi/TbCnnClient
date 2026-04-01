# E-Afya Frontend - Quick Reference Card

## 🗂️ File Locations

```
Landing Page:          src/pages/LandingPage.tsx
Patient Intake Form:   src/pages/PatientIntakeForm.tsx
X-ray Upload:          src/components/XrayUpload.tsx
Diagnostic Results:    src/pages/DiagnosticResults.tsx
API Service:           src/services/api.ts
App Router:            src/App.tsx
```

## 🛣️ Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | LandingPage | Home page with features |
| `/patient-intake` | PatientIntakeForm | Patient data & X-ray upload |
| `/results` | DiagnosticResults | AI analysis results |
| `/tuberculosis` | Tuberculosis | Legacy TB page |

## 🎨 Color Palette

| Usage | Color | Hex |
|-------|-------|-----|
| Primary | Emerald | #10B981 |
| Secondary | Teal | #14B8A6 |
| Success | Green | #10B981 |
| Warning | Orange | #F59E0B |
| Error | Red | #DC2626 |
| Info | Blue | #3B82F6 |

## 📦 Key Dependencies

```
react@19.2.0              - UI Framework
react-router-dom@7.9.4    - Routing
typescript@4.9.5          - Type Safety
tailwindcss@3.4.18        - Styling
axios@1.14.0              - HTTP Client
react-icons@5.6.0         - Icons
react-redux@9.2.0         - State Management
```

## 🔧 Common Tasks

### Add New Page
```typescript
// 1. Create file: src/pages/NewPage.tsx
// 2. Add route in App.tsx:
<Route path="/new-page" element={<NewPage />} />
// 3. Add navigation link
<Link to="/new-page">Go to Page</Link>
```

### Add New Icon
```typescript
import { FiIcon } from "react-icons/fi";
// Use: <FiIcon className="text-3xl" />
```

### Call API
```typescript
import apiService from "../services/api";

try {
  const result = await apiService.createPatient(data);
  console.log(result);
} catch (error) {
  console.error("Error:", error);
}
```

### Add Form Validation
```typescript
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### Style Component
```typescript
<div className="p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg hover:shadow-xl transition">
  Content
</div>
```

## 💻 Development Tips

### Hot Reload
- Auto-refreshes on file changes
- Save file → Changes appear instantly

### Browser DevTools
- React DevTools for debugging
- Network tab to inspect API calls
- Console for error messages

### TypeScript
- Hover over variables to see types
- Use Ctrl+Space for autocomplete
- Check src/services/api.ts for interfaces

### Debugging Forms
```typescript
console.log("Form Data:", formData);
```

### Debugging API Calls
```typescript
// In api.ts interceptor
.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  }
);
```

## 🎯 Component Props

### XrayUpload
```typescript
interface XrayUploadProps {
  onFilesSelected: (files: File[]) => void;
}
```

### PatientIntakeForm
No props - uses React Router navigation

### DiagnosticResults
No props - uses React Router location state

### LandingPage
No props - self-contained component

## 📐 Responsive Breakpoints

```
Mobile:   sm (320px - 640px)
Tablet:   md (640px - 1024px)
Desktop:  lg (1024px+)
```

**Usage:**
```typescript
<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2, Desktop: 3 */}
</div>
```

## 🔌 API Methods

```typescript
apiService.createPatient(data)          // Create patient
apiService.getPatient(id)               // Get patient
apiService.uploadXrayImages(...)        // Upload X-rays
apiService.getJobStatus(jobId)          // Check progress
apiService.pollJobStatus(jobId)         // Poll until done
apiService.getDiagnosticResults(jobId)  // Get results
apiService.predictXray(file, type)      // Predict instantly
apiService.getHealthStatus()            // Check health
apiService.submitPatientIntake(data)    // Full workflow
```

## ✅ Form Validation Rules

| Field | Rule |
|-------|------|
| firstName | Required, non-empty |
| lastName | Required, non-empty |
| email | Required, valid email format |
| age | Required, 0-150 range |
| gender | Required, select value |
| diseaseType | Required for Step 2 |
| symptoms | Required, min 10 chars |
| xrayImages | Required, min 1 file |
| consent | Must be checked |

## 📁 File Size Limits

- **Per File:** 10 MB
- **Total Upload:** 50 MB (5 files × 10 MB)
- **Accepted Types:** JPEG, PNG, WebP

## 🎬 Animation Classes

```
animate-fadeIn       - Fade in animation
animate-pulse        - Pulsing animation
hover:shadow-lg      - Shadow on hover
hover:-translate-y-1 - Lift effect
transition          - Smooth transition
```

## 🔐 Error Handling

**User Input Errors:** Display under field
**API Errors:** Show toast or alert
**File Upload Errors:** List invalid files
**Network Errors:** Show retry button

## 📋 Checklist for New Features

- [ ] Create component file
- [ ] Add TypeScript interfaces
- [ ] Write validation logic
- [ ] Add Tailwind styling
- [ ] Test responsiveness
- [ ] Add error handling
- [ ] Update API service if needed
- [ ] Add route if page
- [ ] Update navigation links
- [ ] Test on mobile/tablet/desktop

## 🧪 Quick Test Commands

```bash
# Check TypeScript errors
npm run build

# Start dev server
npm start

# Run tests
npm test
```

## 📊 Performance Tips

1. **Memoize Components**
   ```typescript
   export const MyComponent = React.memo(({props}) => {...})
   ```

2. **Lazy Load Routes**
   ```typescript
   const Page = lazy(() => import('./pages/Page'));
   ```

3. **Debounce Search**
   ```typescript
   useEffect(() => {
     const timer = setTimeout(() => search(), 300);
     return () => clearTimeout(timer);
   }, [query]);
   ```

## 🆘 Emergency Fixes

**App won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**Styling issues:**
- Clear browser cache (Cmd+Shift+R)
- Check Tailwind config
- Verify class names are spelled correctly

**API not connecting:**
- Check backend is running (port 3000)
- Check CORS is enabled
- Verify API_BASE_URL
- Check network tab in DevTools

## 📞 Key Contacts

- **Developer:** Jordan Musera
- **Frontend Lead:** [Your name]
- **Backend Lead:** [Backend dev name]
- **Issues:** Check GitHub Issues

---

**Version:** 1.0.0  
**Last Updated:** March 30, 2026  
**Keep this handy for quick reference! 📌**
