/**
 * API Configuration
 * Centralized configuration for all API endpoints
 * This file defines the base URL and provides utilities for API calls
 */

/**
 * Get the API base URL from environment variables or use default
 * Priority:
 * 1. VITE_API_BASE_URL - Full base URL (e.g., http://localhost:3000)
 * 2. VITE_API_PORT - Port number with http://localhost:PORT
 * 3. VITE_API_URL - Legacy URL
 * 4. Default - http://localhost:3000
 */
export const getApiBaseUrl = (): string => {
  // Check for full base URL first
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (baseUrl) {
    return baseUrl;
  }

  // Check for port-based configuration
  const port = import.meta.env.VITE_API_PORT;
  if (port) {
    return `http://localhost:${port}`;
  }

  // Check for legacy VITE_API_URL
  const legacyUrl = import.meta.env.VITE_API_URL;
  if (legacyUrl) {
    return legacyUrl;
  }

  // Default development URL
  return 'http://localhost:3000';
};

/**
 * API Base URL - used by all API services
 * Set via environment variables:
 * - VITE_API_BASE_URL=http://your-api.com/api (full URL)
 * - VITE_API_PORT=3001 (port-based)
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints mapping
 * Used for type-safe endpoint references
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
  },
  PATIENTS: {
    CREATE: '/patients',
    GET_ALL: '/patients',
    GET_BY_ID: (id: string) => `/patients/${id}`,
    UPDATE: (id: string) => `/patients/${id}`,
    DELETE: (id: string) => `/patients/${id}`,
    GET_XRAYS: (id: string) => `/patients/${id}/xrays`,
    GET_RESULTS: (id: string) => `/patients/${id}/results`,
  },
  XRAYS: {
    CREATE: '/xrays',
    GET_ALL: '/xrays',
    GET_BY_ID: (id: string) => `/xrays/${id}`,
    UPDATE: (id: string) => `/xrays/${id}`,
    DELETE: (id: string) => `/xrays/${id}`,
    GET_BY_PATIENT: (patientId: string) => `/xrays/patient/${patientId}`,
    GET_FAILED: '/xrays/status/failed',
    UPDATE_STATUS: (id: string) => `/xrays/${id}/status`,
  },
  RESULTS: {
    CREATE: '/results',
    GET_ALL: '/results',
    GET_BY_ID: (id: string) => `/results/${id}`,
    UPDATE: (id: string) => `/results/${id}`,
    DELETE: (id: string) => `/results/${id}`,
    GET_BY_PATIENT: (patientId: string) => `/results/patient/${patientId}`,
  },
  HEALTH: {
    CHECK: '/health',
  },
} as const;

/**
 * API Configuration object
 * Contains all API-related settings
 */
export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  tokenKey: 'authToken',
  refreshTokenKey: 'refreshToken',
  userKey: 'user',
} as const;

/**
 * Helper to build full endpoint URLs
 * @param endpoint - The endpoint path
 * @returns Full URL
 */
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
