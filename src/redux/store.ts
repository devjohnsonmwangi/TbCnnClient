import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import tbReducer from './slices/tbSlice';
import authReducer from './slices/authSlice';

// Extend ImportMeta for Vite HMR support
interface ImportMetaHot {
  hot?: {
    accept: (path: string, callback: (module: any) => void) => void;
  };
}

declare global {
  interface ImportMeta extends ImportMetaHot {}
}

export const store = configureStore({
  reducer: {
    tb: tbReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore file objects which are not serializable
        ignoredActions: ['tb/predict/pending'],
        ignoredPaths: ['tb.loading'],
      },
    }),
  devTools: {
    // Enable Redux DevTools in development
    // Chrome extension: https://github.com/reduxjs/redux-devtools-extension
    name: 'TB CNN Detection Store',
    trace: true,
    traceLimit: 25,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Enable hot module replacement for store if available (Vite HMR)
if (import.meta.hot) {
  import.meta.hot.accept(
    ['./slices/tbSlice', './slices/authSlice'],
    (modules: any[]) => {
      // Import the new reducers with proper typing
      const newTbReducer: typeof tbReducer = modules[0]?.default ?? tbReducer;
      const newAuthReducer: typeof authReducer = modules[1]?.default ?? authReducer;

      // Create a properly typed root reducer using combineReducers
      const rootReducer = combineReducers({
        tb: newTbReducer,
        auth: newAuthReducer,
      });

      store.replaceReducer(rootReducer as any);
    }
  );
}
