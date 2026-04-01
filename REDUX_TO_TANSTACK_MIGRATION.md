# Redux to TanStack Query Migration Guide

## Summary of Changes

You've successfully migrated from Redux Toolkit to TanStack Query. This guide shows how to update your existing components.

## Step 1: Update main.tsx

**Before:**
```typescript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**After:**
```typescript
import { QueryProvider } from './providers/QueryProvider';

root.render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>
);
```

## Step 2: Update App.tsx

**Before:**
```typescript
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        {/* routes */}
      </AuthProvider>
    </Provider>
  );
}
```

**After:**
```typescript
function App() {
  return (
    <AuthProvider>
      {/* routes */}
    </AuthProvider>
  );
}
```

## Step 3: Update Components

### Pattern 1: Simple Data Fetching

**Before (Redux + thunk):**
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { getAllPatients } from '../redux/slices/patientsSlice';

function PatientList() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.patients);

  useEffect(() => {
    dispatch(getAllPatients());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data.map(p => <p key={p.id}>{p.name}</p>)}</div>;
}
```

**After (TanStack Query):**
```typescript
import { useGetAllPatients } from '../hooks/usePatients';

function PatientList() {
  const { data: patients, isLoading, error } = useGetAllPatients();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{patients?.map(p => <p key={p.id}>{p.name}</p>)}</div>;
}
```

**Benefits:**
- ✅ No useEffect needed (automatic fetching)
- ✅ Shorter code
- ✅ Better TypeScript types
- ✅ Built-in caching and deduplication

### Pattern 2: Create/Update Operations

**Before (Redux + thunk):**
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { createPatient } from '../redux/slices/patientsSlice';

function CreatePatientForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.patients);
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    dispatch(createPatient(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
    </form>
  );
}
```

**After (TanStack Query):**
```typescript
import { useCreatePatient } from '../hooks/usePatients';

function CreatePatientForm() {
  const { mutate: createPatient, isPending, error } = useCreatePatient();
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    createPatient(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>{isPending ? 'Creating...' : 'Create'}</button>
    </form>
  );
}
```

**Key Differences:**
- `loading` → `isPending`
- `dispatch(action)` → `mutate(data)`
- Cache updates happen automatically
- No need to handle success/failure manually (optional onSuccess/onError callbacks)

### Pattern 3: Dependent Queries

**Before (Redux):**
```typescript
function PatientDetails({ patientId }) {
  const dispatch = useDispatch();
  const patient = useSelector(state => 
    state.patients.data.find(p => p.id === patientId)
  );
  const xrays = useSelector(state => state.xrays.data);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatient(patientId));
      dispatch(getPatientXRays(patientId));
    }
  }, [patientId, dispatch]);

  return <div>{patient && <p>{patient.name}</p>}</div>;
}
```

**After (TanStack Query):**
```typescript
function PatientDetails({ patientId }) {
  const { data: patient } = useGetPatientById(patientId);
  const { data: xrays } = useGetPatientXRays(patientId);

  return <div>{patient && <p>{patient.name}</p>}</div>;
}
```

**Advantages:**
- ✅ Cleaner code
- ✅ Automatic dependency tracking
- ✅ Queries only run when patientId exists
- ✅ No manual dispatch management

### Pattern 4: Form with Validation

**Before:**
```typescript
function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/dashboard');
    }
  };
}
```

**After:**
```typescript
function LoginForm() {
  const { mutate: login, isPending, error } = useAuthLogin();
  const navigate = useNavigate();

  const handleLogin = (credentials) => {
    login(credentials, {
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };
}
```

**The hook automatically:**
- Updates localStorage with tokens
- Invalidates user queries
- Handles auth state updates

## Complete Component Migration Example

### Before (Redux)
```typescript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllResults, deleteResult } from '../redux/slices/resultsSlice';

function ResultsList() {
  const dispatch = useDispatch();
  const { data: results, loading, error, success } = useSelector(state => state.results);
  const [toDelete, setToDelete] = React.useState(null);

  useEffect(() => {
    dispatch(getAllResults());
  }, [dispatch, success]); // Re-fetch after delete

  const handleDelete = (id: string) => {
    if (confirm('Delete?')) {
      dispatch(deleteResult(id));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td>{result.patientId}</td>
              <td>{result.prediction}</td>
              <td>
                <button onClick={() => handleDelete(result.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### After (TanStack Query)
```typescript
import React from 'react';
import { useGetAllResults, useDeleteResult } from '../hooks/useResults';

function ResultsList() {
  const { data: results, isLoading, error } = useGetAllResults();
  const { mutate: deleteResult, isPending } = useDeleteResult();

  const handleDelete = (id: string) => {
    if (confirm('Delete?')) {
      deleteResult(id); // Cache automatically updated
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <table>
        <tbody>
          {results?.map(result => (
            <tr key={result.id}>
              <td>{result.patientId}</td>
              <td>{result.prediction}</td>
              <td>
                <button 
                  disabled={isPending}
                  onClick={() => handleDelete(result.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**What changed:**
- ✅ Removed useEffect and dispatch logic
- ✅ Removed redux imports
- ✅ Removed success state dependency
- ✅ Cache automatically refetches after delete
- ✅ 40% less code
- ✅ Better error handling

## State Management Differences

| Feature | Redux | TanStack Query |
|---------|-------|---|
| Data Fetching | Manual dispatch | Automatic |
| Caching | Manual | Built-in |
| Refetch | Manual invalidation | Automatic |
| Loading State | `loading` boolean | `isLoading` / `isPending` |
| Error Handling | Error string | Error object |
| Token Management | Manual | Interceptor-based |
| Code Size | Larger | Smaller |
| Learning Curve | Steep | Gentle |

## What Happened to Redux?

The Redux folder structure remains but is **no longer used**. You can safely delete:
- `src/redux/store.ts`
- `src/redux/slices/`
- `src/redux/hooks.ts`

These can be removed once you've migrated all components.

## Next Steps

1. **Identify all components using Redux**: Look for `useSelector` and `useDispatch`
2. **Replace with TanStack hooks**: Update each component following patterns above
3. **Remove Redux imports**: Once component is updated
4. **Test thoroughly**: Ensure data fetches and mutations work
5. **Delete Redux folder**: Once all components are migrated

## Common Migration Issues

### Issue: "Cannot find module 'axios'"
**Solution**: Run `pnpm install` to ensure all dependencies are installed

### Issue: "Query not updating after mutation"
**Solution**: The mutation hook automatically invalidates related queries. If not working:
```typescript
// Manual cache invalidation
const { mutate } = useMutation({
  mutationFn: deleteResult,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['results'] });
  }
});
```

### Issue: "Token not included in requests"
**Solution**: Handled by interceptors in service classes. Ensure token is in localStorage with key `authToken`.

### Issue: "Multiple requests being sent"
**Solution**: TanStack Query deduplicates identical requests automatically. Check for double-rendering in React 18 strict mode (expected during development).

## Performance Improvements

After migration, you'll notice:
- ⚡ Faster data fetching (deduplication)
- ⚡ Better caching (stale-while-revalidate)
- ⚡ Less network requests (request coalescing)
- ⚡ Reduced bundle size (Redux removed)
- ⚡ Automatic background refetching
- ⚡ Better TypeScript inference

## DevTools

### React Query DevTools (Optional)

```bash
pnpm add -D @tanstack/react-query-devtools
```

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryProvider>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
}
```

Then use the floating icon to inspect queries, mutations, and cache.

---

**Need help?** Check the TANSTACK_QUERY_GUIDE.md for API reference and examples.
