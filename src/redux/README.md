// Redux store configuration and setup guide

// 1. STORE STRUCTURE
// ==================
// The Redux store is organized as follows:
//
// store/
// ├── store.ts              - Main store configuration
// ├── hooks.ts              - Pre-typed Redux hooks
// └── slices/
//     └── tbSlice.ts        - TB prediction state and thunks

// 2. STORE STATE SHAPE
// ====================
// RootState {
//   tb: {
//     loading: boolean,
//     prediction: {
//       prediction: string,
//       confidence: number,
//       heatmap?: string
//     } | null,
//     error: string | null,
//     success: boolean
//   }
// }

// 3. REDUX INTEGRATIONS
// ======================
// - ReduxDevTools: Enabled by default (dev mode only)
// - Async Thunks: Using createAsyncThunk for API calls
// - Immer: Included with Redux Toolkit for immutable updates
// - Serialization Checks: Enabled for debugging

// 4. USAGE EXAMPLES
// =================

// In your components:
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { predictTB, resetPrediction } from '@/redux/slices/tbSlice';

export function MyComponent() {
  const dispatch = useAppDispatch();
  const { loading, prediction, error, success } = useAppSelector(state => state.tb);

  const handlePredict = async (file: File) => {
    const result = await dispatch(predictTB(file));
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('Prediction successful:', prediction);
    }
  };

  const handleReset = () => {
    dispatch(resetPrediction());
  };

  return (
    <div>
      {loading && <p>Analyzing...</p>}
      {error && <p>Error: {error}</p>}
      {prediction && <p>Result: {prediction.prediction}</p>}
    </div>
  );
}

// 5. ADDING NEW FEATURES TO REDUX
// ================================

// To add a new feature slice:
// 1. Create src/redux/slices/featureName.ts
// 2. Define initial state, reducers, and async thunks
// 3. Import and add to store.ts reducer object
// 4. Use in components with custom hooks

// Example structure for new slice:
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 
// const initialState = { /* ... */ };
// export const fetchData = createAsyncThunk('feature/fetch', /* ... */);
// 
// const featureSlice = createSlice({
//   name: 'feature',
//   initialState,
//   reducers: { /* ... */ },
//   extraReducers: (builder) => { /* ... */ },
// });
//
// export default featureSlice.reducer;
