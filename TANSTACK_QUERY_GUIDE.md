# TanStack Query Integration Guide

## Overview
TanStack Query (formerly React Query) has replaced Redux Toolkit as the primary state management solution. This guide explains the new architecture and how to use the custom hooks.

## Architecture Changes

### Before (Redux Toolkit)
```typescript
// Using Redux slices and useSelector/useDispatch
const dispatch = useDispatch();
const { data, loading, error } = useSelector(state => state.tb);
dispatch(createPatientWithTBDiagnosis(data));
```

### After (TanStack Query)
```typescript
// Using custom hooks with useQuery/useMutation
const { data, isLoading, error } = useGetAllPatients();
const { mutate: createPatient } = useCreatePatient();
```

## Setup

### 1. QueryClientProvider
The app is now wrapped with `QueryProvider` in `main.tsx`:
```typescript
<QueryProvider>
  <App />
</QueryProvider>
```

### 2. Query Client Configuration
Configured in `src/config/queryClient.ts`:
- Stale time: 5 minutes for queries
- Retry policy: 1 retry for queries, 0 for mutations
- Auto refetch on window focus enabled

## Custom Hooks

### Authentication Hooks (`useAuth.ts`)

#### useAuthLogin
```typescript
const { mutate: login, isPending, error } = useAuthLogin();

// Usage
login({ email: 'user@example.com', password: 'password' });
```

#### useAuthRegister
```typescript
const { mutate: register, isPending, error } = useAuthRegister();

// Usage
register({
  email: 'user@example.com',
  password: 'password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'physician'
});
```

#### useAuthRefreshToken
```typescript
const { mutate: refreshToken } = useAuthRefreshToken();

// Used internally by interceptors
```

#### useAuthLogout
```typescript
const { mutate: logout } = useAuthLogout();

// Usage
logout();
```

#### useAuthUser
```typescript
const { data: user, isLoading } = useAuthUser();

// Returns current authenticated user from localStorage
```

#### useIsAuthenticated
```typescript
const isAuthenticated = useIsAuthenticated();

// Returns boolean
```

### Patients Hooks (`usePatients.ts`)

#### useGetAllPatients
```typescript
const { data: patients, isLoading, error } = useGetAllPatients();

// Returns array of PatientResponse[]
```

#### useGetPatientById
```typescript
const { data: patient, isLoading, error } = useGetPatientById(patientId);

// Returns single PatientResponse
```

#### useCreatePatient
```typescript
const { mutate: createPatient, isPending, error } = useCreatePatient();

// Usage
createPatient({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 35,
  gender: 'MALE',
  imageFile: file // or imageBase64
});
```

#### useUpdatePatient
```typescript
const { mutate: updatePatient, isPending } = useUpdatePatient();

// Usage
updatePatient({
  patientId: 'patient-id',
  data: { firstName: 'Jane', age: 36 }
});
```

#### useDeletePatient
```typescript
const { mutate: deletePatient, isPending } = useDeletePatient();

// Usage
deletePatient('patient-id');
```

#### useGetPatientXRays
```typescript
const { data: xrays, isLoading } = useGetPatientXRays(patientId);

// Returns array of XRayData[]
```

#### useGetPatientDiagnosisResults
```typescript
const { data: results, isLoading } = useGetPatientDiagnosisResults(patientId);

// Returns array of DiagnosisResult[]
```

### Results Hooks (`useResults.ts`)

#### useGetAllResults
```typescript
const { data: results, isLoading, error } = useGetAllResults();

// Returns all diagnosis results
```

#### useGetResultById
```typescript
const { data: result, isLoading } = useGetResultById(resultId);

// Returns single ResultResponse
```

#### useGetResultsByPatientId
```typescript
const { data: results, isLoading } = useGetResultsByPatientId(patientId);

// Returns results for specific patient
```

#### useCreateResult
```typescript
const { mutate: createResult, isPending } = useCreateResult();

// Usage
createResult({
  patientId: 'patient-id',
  diseaseType: 'TB',
  prediction: 'positive',
  confidence: 0.95
});
```

#### useCreateTBDiagnosis
```typescript
const { mutate: createTBDiagnosis, isPending } = useCreateTBDiagnosis();

// Usage specific for TB (calls TB-specific endpoint)
createTBDiagnosis({
  patientId: 'patient-id',
  diseaseType: 'TB',
  // ... other fields
});
```

#### useUpdateResult
```typescript
const { mutate: updateResult, isPending } = useUpdateResult();

// Usage
updateResult({
  resultId: 'result-id',
  data: { recommendation: 'Follow-up required' }
});
```

#### useDeleteResult
```typescript
const { mutate: deleteResult, isPending } = useDeleteResult();

// Usage
deleteResult('result-id');
```

## Common Patterns

### Loading State
```typescript
const { isLoading, isPending } = useGetAllPatients();

if (isLoading) return <div>Loading...</div>;
```

### Error Handling
```typescript
const { error } = useGetAllPatients();

if (error instanceof Error) {
  return <div>Error: {error.message}</div>;
}
```

### Mutation with Loading
```typescript
const { mutate: createPatient, isPending } = useCreatePatient();

<button 
  onClick={() => createPatient(data)} 
  disabled={isPending}
>
  {isPending ? 'Creating...' : 'Create Patient'}
</button>
```

### Optimistic Updates
TanStack Query handles cache updates automatically:
- `onSuccess`: Updates cache after successful mutation
- `onError`: Rolls back cache on error
- `invalidateQueries`: Refetch data after mutation

```typescript
const { mutate: updatePatient } = useUpdatePatient();

// When mutation succeeds:
// 1. Cache is updated immediately
// 2. Related queries are invalidated
// 3. Data automatically refetches
```

### Dependent Queries
Use `enabled` option to conditionally run queries:

```typescript
const { data: patient } = useGetPatientById(patientId);
const { data: xrays } = useGetPatientXRays(
  patient?.id || '', // Won't run if patient not yet loaded
  { enabled: !!patient?.id }
);
```

## Migration from Redux

### Old Redux Pattern
```typescript
// In component
const dispatch = useDispatch();
const { data } = useSelector(state => state.tb);

useEffect(() => {
  dispatch(getAllTBResults());
}, [dispatch]);
```

### New TanStack Query Pattern
```typescript
// In component
const { data } = useGetAllResults();

// Automatic refetching, caching, and synchronization
```

## Cache Management

### Automatic Cache Invalidation
Mutations automatically invalidate related queries:
- `createPatient` invalidates `['patients', 'all']`
- `updatePatient` invalidates `['patients', 'all']` and specific patient
- `deletePatient` removes from cache and invalidates list

### Manual Cache Updates
```typescript
import { queryClient } from '@/config/queryClient';

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['patients', patientId] });

// Remove from cache
queryClient.removeQueries({ queryKey: ['results', resultId] });

// Update cache directly
queryClient.setQueryData(['patients', patientId], newPatientData);
```

## Best Practices

1. **Always use hooks**: Never import services directly in components
2. **Handle loading states**: Check `isLoading` or `isPending` before rendering
3. **Error handling**: Always check and display error messages
4. **Dependency arrays**: Use enabled option instead of useEffect for conditional queries
5. **Cache keys**: Follow the pattern `['resource', 'action', 'id']`
6. **Token management**: Handled automatically by interceptors in services

## Performance Tips

1. **Stale time**: Set appropriate stale times to reduce API calls
2. **Caching**: TanStack Query caches by default (5-minute stale time)
3. **Pagination**: Use offset/limit query parameters
4. **Batch requests**: TanStack Query deduplicates identical requests
5. **DevTools**: Install React Query DevTools browser extension for debugging

## Troubleshooting

### Queries not updating
- Check if `enabled` condition is correct
- Verify cache invalidation in mutation onSuccess
- Use `refetchQueries` if automatic invalidation doesn't work

### Mutations not working
- Check network tab for API errors
- Verify `onSuccess` callback is being called
- Check error state: `error` contains the error

### Token expiration
- Handled automatically by interceptors in services
- Interceptors refresh token on 401 response
- User is redirected to login if token refresh fails

---

## File Reference

- **Configuration**: `src/config/queryClient.ts`
- **Auth Hooks**: `src/hooks/useAuth.ts`
- **Patients Hooks**: `src/hooks/usePatients.ts`
- **Results Hooks**: `src/hooks/useResults.ts`
- **Provider**: `src/providers/QueryProvider.tsx`
- **Services**: `src/services/{authService,patientsService,resultsService}.ts`
