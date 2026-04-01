/**
 * X-Rays API Service
 * Handles all X-ray-related API calls including validation and resubmission
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL, API_ENDPOINTS, apiConfig } from '../config/api.config';
import {
  XRayResponseDto,
  ApiResponse,
} from '../types/api.types';

/**
 * X-Rays API Service Class
 * Provides methods for X-ray management with proper error handling and auth tokens
 */
export class XRaysService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: apiConfig.timeout,
      headers: apiConfig.headers,
    });

    // Request interceptor: Add auth token to all requests
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

    // Response interceptor: Handle errors globally
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
            toast.error(errorMessage);
            window.location.href = '/login';
          } else if (error.response?.data) {
            // Extract message from backend response
            const responseData = error.response.data;
            errorMessage =
              responseData.message ||
              responseData.error ||
              (typeof responseData === 'string' ? responseData : `Error: ${error.response.status}`);
            toast.error(errorMessage);
          } else if (error.request) {
            errorMessage = 'Network error. Please check your connection.';
            toast.error(errorMessage);
          } else if (error.message) {
            errorMessage = error.message;
            toast.error(errorMessage);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all X-rays for the current user
   */
  async getAllXrays(): Promise<XRayResponseDto[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<XRayResponseDto[]>>(
        API_ENDPOINTS.XRAYS.GET_ALL
      );
      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch X-rays');
    }
  }

  /**
   * Get a specific X-ray by ID
   */
  async getXrayById(xrayId: string): Promise<XRayResponseDto> {
    try {
      const response = await this.apiClient.get<ApiResponse<XRayResponseDto>>(
        API_ENDPOINTS.XRAYS.GET_BY_ID(xrayId)
      );
      return response.data.data || ({} as XRayResponseDto);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch X-ray');
    }
  }

  /**
   * Get all X-rays for a specific patient
   */
  async getXraysByPatient(patientId: string): Promise<XRayResponseDto[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<XRayResponseDto[]>>(
        API_ENDPOINTS.XRAYS.GET_BY_PATIENT(patientId)
      );
      return response.data.data || [];
    } catch (error) {
      // Return empty array if patient has no X-rays
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw this.handleError(error, 'Failed to fetch patient X-rays');
    }
  }

  /**
   * Get all X-rays that failed validation
   * This is used to display X-rays that need to be resubmitted
   */
  async getFailedValidations(): Promise<XRayResponseDto[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<XRayResponseDto[]>>(
        API_ENDPOINTS.XRAYS.GET_FAILED
      );
      return response.data.data || [];
    } catch (error) {
      // Return empty array if there are no failed X-rays
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw this.handleError(error, 'Failed to fetch failed X-rays');
    }
  }

  /**
   * Upload/Resubmit an X-ray image
   */
  async uploadXray(
    patientId: string,
    imageBase64: string,
    fileName?: string,
    fileType?: string
  ): Promise<XRayResponseDto> {
    try {
      const response = await this.apiClient.post<ApiResponse<XRayResponseDto>>(
        API_ENDPOINTS.XRAYS.CREATE,
        {
          patientId,
          imageBase64,
          fileName: fileName || `xray_${Date.now()}`,
          fileType: fileType || 'image/png',
          xrayType: 'chest',
        }
      );
      toast.success('X-ray uploaded successfully. Validation in progress...');
      return response.data.data || ({} as XRayResponseDto);
    } catch (error) {
      throw this.handleError(error, 'Failed to upload X-ray');
    }
  }

  /**
   * Update X-ray details (notes, type, etc.)
   */
  async updateXray(
    xrayId: string,
    updates: {
      xrayType?: string;
      notes?: string;
    }
  ): Promise<XRayResponseDto> {
    try {
      const response = await this.apiClient.put<ApiResponse<XRayResponseDto>>(
        API_ENDPOINTS.XRAYS.UPDATE(xrayId),
        updates
      );
      toast.success('X-ray updated successfully');
      return response.data.data || ({} as XRayResponseDto);
    } catch (error) {
      throw this.handleError(error, 'Failed to update X-ray');
    }
  }

  /**
   * Delete an X-ray
   */
  async deleteXray(xrayId: string): Promise<void> {
    try {
      await this.apiClient.delete(API_ENDPOINTS.XRAYS.DELETE(xrayId));
      toast.success('X-ray deleted successfully');
    } catch (error) {
      throw this.handleError(error, 'Failed to delete X-ray');
    }
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
export const xraysService = new XRaysService();
