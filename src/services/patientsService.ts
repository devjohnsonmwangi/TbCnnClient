/**
 * Patients API Service
 * Handles all patient-related API calls (CRUD operations)
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL, API_ENDPOINTS, apiConfig } from '../config/api.config';
import {
  PatientResponseDto,
  CreatePatientDto,
  UpdatePatientDto,
  XRayResponseDto,
  DiagnosisResultResponseDto,
  ApiResponse,
} from '../types/api.types';

// Re-export types for backward compatibility
export type PatientResponse = PatientResponseDto;
export type CreatePatientRequest = CreatePatientDto;
export type UpdatePatientRequest = UpdatePatientDto;
export type XRayData = XRayResponseDto;
export type DiagnosisResult = DiagnosisResultResponseDto;

/**
 * Patients API Service Class
 * Provides methods for patient management with proper error handling and auth tokens
 */
export class PatientsService {
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
   * Create a new patient with X-ray image
   */
  async createPatient(
    data: CreatePatientRequest
  ): Promise<PatientResponse> {
    try {
      // Handle multipart form data if imageFile is provided
      if (data.imageFile) {
        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('phone', data.phone || '');
        formData.append('dateOfBirth', data.dateOfBirth || '');
        formData.append('gender', data.gender);
        if (data.medicalHistory) formData.append('medicalHistory', data.medicalHistory);
        if (data.allergies) formData.append('allergies', data.allergies);
        if (data.medications) formData.append('medications', data.medications);
        if (data.address) formData.append('address', data.address);
        if (data.city) formData.append('city', data.city);
        if (data.state) formData.append('state', data.state);
        if (data.postalCode) formData.append('postalCode', data.postalCode);
        if (data.country) formData.append('country', data.country);
        if (data.xrayType) formData.append('xrayType', data.xrayType);
        if (data.xrayNotes) formData.append('xrayNotes', data.xrayNotes);
        formData.append('imageFile', data.imageFile);

        const response = await this.apiClient.post<ApiResponse<PatientResponse>>(
          API_ENDPOINTS.PATIENTS.CREATE,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.data) {
          toast.success(response.data.message || 'Patient registered successfully');
          return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to create patient');
      }

      // Handle JSON payload with base64 image
      const response = await this.apiClient.post<ApiResponse<PatientResponse>>(
        API_ENDPOINTS.PATIENTS.CREATE,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender,
          medicalHistory: data.medicalHistory,
          allergies: data.allergies,
          medications: data.medications,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          xrayType: data.xrayType,
          xrayNotes: data.xrayNotes,
          imageBase64: data.imageBase64,
        }
      );

      if (response.data.data) {
        toast.success(response.data.message || 'Patient registered successfully');
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create patient');
    } catch (error) {
      throw this.handleError(error, 'Failed to create patient');
    }
  }

  /**
   * Get all patients (physicians see own, admins see all)
   */
  async getAllPatients(): Promise<PatientResponse[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<PatientResponse[]>>(
        API_ENDPOINTS.PATIENTS.GET_ALL
      );

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch patients');
    }
  }

  /**
   * Get patient by ID
   */
  async getPatientById(patientId: string): Promise<PatientResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<PatientResponse>>(
        API_ENDPOINTS.PATIENTS.GET_BY_ID(patientId)
      );

      if (!response.data.data) {
        throw new Error('Patient not found');
      }
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch patient ${patientId}`);
    }
  }

  /**
   * Update patient information (with optional X-ray file upload)
   */
  async updatePatient(
    patientId: string,
    data: UpdatePatientRequest
  ): Promise<PatientResponse> {
    try {
      let requestData: any = data;

      // If imageFile is provided, use multipart form data
      if (data.imageFile) {
        const formData = new FormData();
        formData.append('firstName', data.firstName || '');
        formData.append('lastName', data.lastName || '');
        formData.append('phone', data.phone || '');
        if (data.medicalHistory)
          formData.append('medicalHistory', data.medicalHistory);
        if (data.allergies) formData.append('allergies', data.allergies);
        if (data.medications)
          formData.append('medications', data.medications);
        if (data.address) formData.append('address', data.address);
        if (data.city) formData.append('city', data.city);
        if (data.state) formData.append('state', data.state);
        if (data.postalCode) formData.append('postalCode', data.postalCode);
        if (data.country) formData.append('country', data.country);
        if (data.fileName) formData.append('fileName', data.fileName);
        if (data.xrayType) formData.append('xrayType', data.xrayType);
        if (data.xrayNotes) formData.append('xrayNotes', data.xrayNotes);
        formData.append('imageFile', data.imageFile);

        requestData = formData;
      }

      const response = await this.apiClient.put<ApiResponse<PatientResponse>>(
        API_ENDPOINTS.PATIENTS.UPDATE(patientId),
        requestData
      );

      if (response.data.data) {
        toast.success(response.data.message || 'Patient updated successfully');
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update patient');
    } catch (error) {
      throw this.handleError(error, `Failed to update patient ${patientId}`);
    }
  }

  /**
   * Delete patient (admin only)
   */
  async deletePatient(patientId: string): Promise<void> {
    try {
      await this.apiClient.delete(API_ENDPOINTS.PATIENTS.DELETE(patientId));
      toast.success('Patient deleted successfully');
    } catch (error) {
      throw this.handleError(error, `Failed to delete patient ${patientId}`);
    }
  }

  /**
   * Get all X-rays for a patient
   */
  async getPatientXRays(patientId: string): Promise<XRayData[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<XRayData[]>>(
        API_ENDPOINTS.PATIENTS.GET_XRAYS(patientId)
      );

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to fetch X-rays for patient ${patientId}`
      );
    }
  }

  /**
   * Get all diagnosis results for a patient
   */
  async getPatientDiagnosisResults(
    patientId: string
  ): Promise<DiagnosisResult[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<DiagnosisResult[]>>(
        API_ENDPOINTS.PATIENTS.GET_RESULTS(patientId)
      );

      return response.data.data || [];
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to fetch diagnosis results for patient ${patientId}`
      );
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
export const patientsService = new PatientsService();
