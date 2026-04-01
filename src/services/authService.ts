/**
 * Authentication API Service
 * Handles all authentication-related API calls (register, login, refresh token, logout)
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL, API_ENDPOINTS, apiConfig } from '../config/api.config';

/**
 * DTOs and Interfaces from Backend
 */
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: 'PHYSICIAN' | 'RADIOLOGIST' | 'ADMIN' | 'SUPER_ADMIN';
  license?: string;
  specialization?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}

/**
 * Authentication API Service Class
 * Provides methods for auth operations with proper error handling
 */
export class AuthService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: apiConfig.timeout,
      headers: apiConfig.headers,
    });

    // Request interceptor: Add auth token to requests
    this.apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );

    // Response interceptor: Handle 401 and refresh token
    this.apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error);
        }

        const axiosError = error as AxiosError<ApiErrorResponse>;
        const originalRequest = axiosError.config as any;

        // If 401 and we haven't already retried
        if (axiosError.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              this.setAccessToken(response.accessToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.apiClient(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            this.clearAuth();
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Extract and show backend error message
        let errorMessage = 'An unexpected error occurred.';
        
        if (axiosError.response?.data) {
          // Try to get message from backend response - backend ALWAYS sends a response
          const responseData = axiosError.response.data;
          
          // Priority: message > error > status code fallback
          if (responseData.message && typeof responseData.message === 'string') {
            errorMessage = responseData.message;
          } else if (responseData.error && typeof responseData.error === 'string') {
            errorMessage = responseData.error;
          } else if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else {
            errorMessage = `Error: ${axiosError.response.status}`;
          }
        } else if (axiosError.request) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (axiosError.message) {
          // Only use axios message if it's not a JavaScript error
          if (!axiosError.message.includes('Cannot read') && !axiosError.message.includes('undefined')) {
            errorMessage = axiosError.message;
          }
        }

        // Always show the backend message or extracted error
        toast.error(errorMessage);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<{
        success: boolean;
        data: AuthResponse;
        message: string;
        statusCode: number;
      }>(API_ENDPOINTS.AUTH.REGISTER, data);

      // Extract the nested auth data from response
      const authData = response.data.data;
      
      // Validate that we have required auth fields
      if (!authData?.accessToken || !authData?.refreshToken) {
        throw new Error('Invalid auth response structure from server');
      }

      // Store tokens and user
      this.setAccessToken(authData.accessToken);
      this.setRefreshToken(authData.refreshToken);
      this.setUser(authData);

      return authData;
    } catch (error) {
      // Re-throw error (message already shown by response interceptor)
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<{
        success: boolean;
        data: AuthResponse;
        message: string;
        statusCode: number;
      }>(API_ENDPOINTS.AUTH.LOGIN, data);

      // Extract the nested auth data from response
      const authData = response.data.data;
      
      // Validate that we have required auth fields
      if (!authData?.accessToken || !authData?.refreshToken) {
        throw new Error('Invalid auth response structure from server');
      }

      // Store tokens and user
      this.setAccessToken(authData.accessToken);
      this.setRefreshToken(authData.refreshToken);
      this.setUser(authData);

      return authData;
    } catch (error) {
      // Re-throw error (message already shown by response interceptor)
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Create a temporary client without interceptors for refresh
      const tempClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: apiConfig.timeout,
        headers: apiConfig.headers,
      });

      const response = await tempClient.post<{
        data: RefreshTokenResponse;
        message: string;
        statusCode: number;
      }>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });

      const refreshData = response.data.data;

      // Update stored tokens
      this.setAccessToken(refreshData.accessToken);

      return refreshData;
    } catch (error) {
      // Clear auth on refresh failure
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getMe(): Promise<User> {
    try {
      const response = await this.apiClient.get<{
        data: User;
        message: string;
        statusCode: number;
      }>(API_ENDPOINTS.AUTH.ME);

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(apiConfig.tokenKey);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(apiConfig.refreshTokenKey);
  }

  /**
   * Get stored user
   */
  getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem(apiConfig.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Store access token
   */
  private setAccessToken(token: string): void {
    localStorage.setItem(apiConfig.tokenKey, token);
  }

  /**
   * Store refresh token
   */
  private setRefreshToken(token: string): void {
    localStorage.setItem(apiConfig.refreshTokenKey, token);
  }

  /**
   * Store user data
   */
  private setUser(user: AuthResponse): void {
    localStorage.setItem(apiConfig.userKey, JSON.stringify(user));
  }

  /**
   * Clear all auth data
   */
  private clearAuth(): void {
    localStorage.removeItem(apiConfig.tokenKey);
    localStorage.removeItem(apiConfig.refreshTokenKey);
    localStorage.removeItem(apiConfig.userKey);
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown, fallbackMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        fallbackMessage;
      return new Error(message);
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error(fallbackMessage);
  }
}

// Export singleton instance
export const authService = new AuthService();
