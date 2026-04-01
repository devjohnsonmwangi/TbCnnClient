import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiConfig } from '../../config/api.config';

// Auth State Type
interface AuthState {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'PHYSICIAN' | 'ADMIN' | 'RADIOLOGIST' | 'SUPER_ADMIN';
    license?: string;
    specialization?: string;
    phone?: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user and tokens after successful login/register
    setAuth: (
      state,
      action: PayloadAction<{
        user: AuthState['user'];
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;

      // Persist to localStorage
      localStorage.setItem(apiConfig.userKey, JSON.stringify(action.payload.user));
      localStorage.setItem(apiConfig.tokenKey, action.payload.accessToken);
      localStorage.setItem(apiConfig.refreshTokenKey, action.payload.refreshToken);
    },

    // Update tokens during refresh
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }

      // Persist to localStorage
      localStorage.setItem(apiConfig.tokenKey, action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem(apiConfig.refreshTokenKey, action.payload.refreshToken);
      }
    },

    // Clear auth on logout
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;

      // Clear from localStorage
      localStorage.removeItem(apiConfig.userKey);
      localStorage.removeItem(apiConfig.tokenKey);
      localStorage.removeItem(apiConfig.refreshTokenKey);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Restore auth from localStorage (for hydration)
    restoreAuth: (
      state,
      action: PayloadAction<{
        user: AuthState['user'];
        accessToken: string;
        refreshToken: string;
      } | null>
    ) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setAuth, setTokens, clearAuth, setLoading, setError, restoreAuth } =
  authSlice.actions;

export default authSlice.reducer;
