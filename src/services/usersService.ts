/**
 * Users API Service
 * Handles all user-related API calls
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, apiConfig } from '../config/api.config';
import {
  UserResponseDto,
  ApiResponse,
} from '../types/api.types';

/**
 * Users API Service Class
 * Provides methods for user management with proper error handling and auth tokens
 */
export class UsersService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: apiConfig.timeout,
      headers: apiConfig.headers,
    });

    // Request interceptor: Add auth token
    this.apiClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(apiConfig.tokenKey);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );

    // Response interceptor: Handle errors
    this.apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
          // Don't show error toast for 404 - empty data is expected
          if (error.response?.status === 404) {
            return Promise.reject(error);
          }

          let errorMessage = 'An unexpected error occurred.';
          
          if (error.response?.status === 401) {
            localStorage.removeItem(apiConfig.tokenKey);
            errorMessage = 'Session expired. Please login again.';
            window.location.href = '/login';
          } else if (error.response?.data) {
            // Extract message from backend response
            const responseData = error.response.data;
            errorMessage = 
              responseData.message || 
              responseData.error || 
              (typeof responseData === 'string' ? responseData : `Error: ${error.response.status}`);
            console.error('Users API error:', errorMessage);
          } else if (error.request) {
            errorMessage = 'Network error. Please check your connection.';
            console.error('Network error:', errorMessage);
          } else if (error.message) {
            errorMessage = error.message;
            console.error('API error:', errorMessage);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all users (Admin/SuperAdmin only)
   */
  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserResponseDto[]>>(
        API_ENDPOINTS.USERS.GET_ALL
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponseDto | null> {
    try {
      const response = await this.apiClient.get<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.USERS.GET_BY_ID(userId)
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get all physicians and radiologists
   */
  async getPhysicians(): Promise<UserResponseDto[]> {
    try {
      const allUsers = await this.getAllUsers();
      return allUsers.filter(
        (u) => u.role === 'PHYSICIAN' || u.role === 'RADIOLOGIST'
      );
    } catch (error) {
      console.error('Failed to fetch physicians:', error);
      return [];
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<UserResponseDto | null> {
    try {
      const response = await this.apiClient.patch<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.USERS.DEACTIVATE(userId)
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error(`Failed to deactivate user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<UserResponseDto | null> {
    try {
      const response = await this.apiClient.patch<ApiResponse<UserResponseDto>>(
        API_ENDPOINTS.USERS.ACTIVATE(userId)
      );
      return response.data.data ?? null;
    } catch (error) {
      console.error(`Failed to activate user ${userId}:`, error);
      throw error;
    }
  }
}
