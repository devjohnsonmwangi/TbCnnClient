/**
 * Results API Service
 * Handles all disease prediction results (TB, Pneumonia, Lung Cancer, etc.)
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL, API_ENDPOINTS, apiConfig } from '../config/api.config';
import {
  DiagnosisResultResponseDto,
  CreateDiagnosisResultDto,
  DiseaseType,
  ConfidenceLevel,
  TBIntensity,
  ApiResponse,
} from '../types/api.types';

// Re-export types for backward compatibility
export type ResultResponse = DiagnosisResultResponseDto;
export type CreateResultRequest = CreateDiagnosisResultDto;

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: unknown;
}

/**
 * Results API Service Class
 * Provides methods for managing diagnosis results
 */
export class ResultsService {
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
   * Create a new diagnosis result
   */
  async createResult(data: CreateResultRequest): Promise<ResultResponse> {
    try {
      const response = await this.apiClient.post<ApiResponse<ResultResponse>>(
        API_ENDPOINTS.RESULTS.CREATE,
        data
      );

      if (response.data.data) {
        toast.success(response.data.message || 'Diagnosis result created successfully');
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create result');
    } catch (error) {
      throw this.handleError(error, 'Failed to create result');
    }
  }

  /**
   * Get all results (physicians see own patients, admins see all)
   */
  async getAllResults(): Promise<ResultResponse[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<ResultResponse[]>>(
        API_ENDPOINTS.RESULTS.GET_ALL
      );

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch results');
    }
  }

  /**
   * Get result by ID
   */
  async getResultById(resultId: string): Promise<ResultResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<ResultResponse>>(
        API_ENDPOINTS.RESULTS.GET_BY_ID(resultId)
      );

      if (!response.data.data) {
        throw new Error('Result not found');
      }
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch result ${resultId}`);
    }
  }

  /**
   * Get all results for a specific patient
   */
  async getPatientResults(patientId: string): Promise<ResultResponse[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<ResultResponse[]>>(
        API_ENDPOINTS.RESULTS.GET_BY_PATIENT(patientId)
      );

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to fetch results for patient ${patientId}`
      );
    }
  }

  /**
   * Alias for getPatientResults for consistency with useResults hooks
   */
  async getResultsByPatientId(patientId: string): Promise<ResultResponse[]> {
    return this.getPatientResults(patientId);
  }

  /**
   * Get TB diagnosis for a specific patient
   */
  async getTBDiagnosis(patientId: string): Promise<ResultResponse | null> {
    try {
      const results = await this.getPatientResults(patientId);
      // Find the first TB result
      const tbResult = results.find(r => r.diseaseType === DiseaseType.TUBERCULOSIS);
      return tbResult || null;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch TB diagnosis for patient ${patientId}`);
    }
  }

  /**
   * Create TB diagnosis result
   */
  async createTBDiagnosis(data: CreateResultRequest): Promise<ResultResponse> {
    // Ensure diseaseType is tuberculosis
    const tbData = { ...data, diseaseType: DiseaseType.TUBERCULOSIS };
    return this.createResult(tbData);
  }

  /**
   * Update a diagnosis result
   */
  async updateResult(
    resultId: string,
    data: Partial<CreateResultRequest>
  ): Promise<ResultResponse> {
    try {
      const response = await this.apiClient.put<ApiResponse<ResultResponse>>(
        API_ENDPOINTS.RESULTS.UPDATE(resultId),
        data
      );

      if (response.data.data) {
        toast.success(response.data.message || 'Diagnosis result updated successfully');
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update result');
    } catch (error) {
      throw this.handleError(error, `Failed to update result ${resultId}`);
    }
  }

  /**
   * Delete a diagnosis result (admin only)
   */
  async deleteResult(resultId: string): Promise<void> {
    try {
      await this.apiClient.delete(API_ENDPOINTS.RESULTS.DELETE(resultId));
      toast.success('Diagnosis result deleted successfully');
    } catch (error) {
      throw this.handleError(error, `Failed to delete result ${resultId}`);
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
export const resultsService = new ResultsService();
