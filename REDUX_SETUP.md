# Redux Store Configuration Guide

## ✅ Store Setup Complete

Your Redux store is fully configured and ready to use. Here's a complete overview:

---

## 1. Store Architecture

```
src/redux/
├── store.ts              # Main store configuration with middleware & DevTools
├── hooks.ts              # Pre-typed React-Redux hooks (useAppDispatch, useAppSelector)
└── slices/
    └── tbSlice.ts        # TB prediction state, reducers, and async thunks
```

---

## 2. Store Configuration Details

### store.ts
- **Redux Toolkit's `configureStore`** - Includes:
  - Built-in middleware (thunk by default)
  - Redux DevTools integration
  - Immutable state checks (development)
  - Serialization warnings
  
### Middleware Configuration:
- **Default Middleware**: Thunk middleware for async actions
- **Serialization Check**: Configured to handle non-serializable File objects
- **DevTools**: Enabled with action tracing and limit of 25 actions

### Hot Module Replacement (HMR):
- Store supports hot reloading for faster development

---

## 3. State Management (TB Slice)

### Initial State:
```typescript
{
  tb: {
    loading: boolean,       // Is prediction in progress?
    prediction: {           // Latest prediction result
      prediction: string,   // "Normal" or "Abnormal"
      confidence: number,   // 0-1 confidence score
      heatmap?: string      // Base64 encoded visualization
    } | null,
    error: string | null,   // Error message if failed
    success: boolean        // Was last prediction successful?
  }
}
```

### Available Actions:

#### Async Thunk:
- `predictTB(imageFile: File)` - Upload image and get prediction

#### Sync Actions:
- `resetPrediction()` - Clear prediction state
- `clearError()` - Remove error message

---

## 4. Using Redux in Components

### Import Pre-typed Hooks:
```typescript
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
```

### Dispatch Async Action:
```typescript
const dispatch = useAppDispatch();

// Dispatch and wait for result
const resultAction = await dispatch(predictTB(imageFile));

// Check result
if (resultAction.meta.requestStatus === 'fulfilled') {
  console.log('Success!');
} else {
  console.log('Failed!');
}
```

### Access State:
```typescript
const { loading, prediction, error, success } = useAppSelector(
  state => state.tb
);
```

### Full Component Example:
```typescript
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { predictTB, resetPrediction } from '@/redux/slices/tbSlice';

export const PredictionComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const { loading, prediction, error } = useAppSelector(state => state.tb);

  const handleAnalyze = async () => {
    if (file) {
      await dispatch(predictTB(file));
    }
  };

  const handleReset = () => {
    dispatch(resetPrediction());
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <p className="error">{error}</p>}
      {prediction && (
        <div className="results">
          <p>Result: {prediction.prediction}</p>
          <p>Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};
```

---

## 5. Adding New Redux Features

### Step 1: Create a New Slice
Create `src/redux/slices/featureName.ts`:

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define async thunk if needed
export const fetchFeature = createAsyncThunk(
  'feature/fetch',
  async (arg, { rejectWithValue }) => {
    try {
      // Your API call
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const featureSlice = createSlice({
  name: 'feature',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeature.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearData } = featureSlice.actions;
export default featureSlice.reducer;
```

### Step 2: Add to Store
Update `src/redux/store.ts`:

```typescript
import featureReducer from './slices/featureName';

export const store = configureStore({
  reducer: {
    tb: tbReducer,
    feature: featureReducer,  // Add here
  },
  // ... rest of config
});
```

### Step 3: Update RootState Type
TypeScript will automatically infer the new state shape from the updated store configuration.

### Step 4: Use in Components
```typescript
import { fetchFeature, clearData } from '@/redux/slices/featureName';

const { data, loading, error } = useAppSelector(state => state.feature);
const dispatch = useAppDispatch();

dispatch(fetchFeature());
```

---

## 6. Redux DevTools Integration

### Chrome Extension:
1. Install [Redux DevTools](https://github.com/reduxjs/redux-devtools-extension)
2. Open DevTools in Chrome dev console
3. You'll see:
   - All dispatched actions
   - State changes
   - Time travel debugging
   - Action replay capability

### Tips:
- Use action tracing to see where actions are dispatched
- Time travel: Jump to any previous state
- Dispatch: Manually dispatch actions for testing
- State diff: See exactly what changed

---

## 7. Environment Configuration

### .env File:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

This is used in `tbSlice.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## 8. API Integration

### API Endpoint:
- Endpoint: `POST /predict/tuberculosis`
- Content: `multipart/form-data` with `file` field
- Response:
```json
{
  "prediction": "Normal" | "Abnormal",
  "confidence": 0.95,
  "heatmap": "base64_encoded_image_optional"
}
```

### Error Handling:
The `predictTB` thunk automatically:
- Catches network errors
- Extracts error messages from responses
- Sets error state for display

---

## 9. Best Practices

1. **Always use typed hooks** (`useAppDispatch`, `useAppSelector`)
2. **Async thunks** for all API calls
3. **Normalize state** - Keep deeply nested structures flat
4. **Memoize selectors** - Use `useShallowEqual` for array/object selectors
5. **Error handling** - Always display error messages to users
6. **Loading states** - Show indicators during async operations
7. **Reset state** - Provide clear mechanisms to reset state

---

## 10. Troubleshooting

### "Cannot find module" errors:
- Verify slice is imported and added to `configureStore`
- Check file paths match your imports

### State not updating:
- Redux DevTools shows no action? Check dispatch is being called
- Check reducer logic - filters, maps, mutations

### TypeScript errors:
- `useAppSelector` not typed? Import from `redux/hooks.ts`
- Type mismatch? Check RootState type with actual state

---

## 11. Performance Optimization

### Selector Memoization:
```typescript
// Create reusable selector
const selectTBPrediction = (state: RootState) => state.tb.prediction;

// Use in component
const prediction = useAppSelector(selectTBPrediction);
```

### Prevent Re-renders:
```typescript
// Only subscribe to the specific data you need
const { loading } = useAppSelector(state => ({
  loading: state.tb.loading
}));
```

---

## 12. Checklist ✅

- ✅ Store created and configured
- ✅ TB slice with async thunk
- ✅ Pre-typed hooks ready
- ✅ Redux Provider in App.tsx
- ✅ DevTools enabled
- ✅ API integration
- ✅ Error handling
- ✅ Environment configuration
- ✅ TypeScript support

**Your Redux store is fully functional and production-ready!**

---

## 13. Useful Commands

```bash
# Start dev server with Redux DevTools
pnpm start

# Build for production
pnpm build

# Install Redux DevTools Chrome extension
# https://github.com/reduxjs/redux-devtools-extension
```

---

**Next Steps:**
1. Update API URL in `.env` if needed
2. Test TB prediction flow with sample images
3. Add more slices as features grow
4. Use Redux DevTools for debugging
5. Deploy to production
