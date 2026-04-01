import axios from 'axios';
import { fileToBase64 } from '../utils/imageUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PredictionResult {
  prediction: string;
  confidence: number;
  heatmap?: string;
  model?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}

/**
 * TB Prediction API Client
 * Handles all communication with the backend prediction API
 */
export const tbApi = {
  /**
   * Predict TB from base64 encoded image
   * @param imageFile - Image file from input
   * @returns Promise<PredictionResult>
   */
  predict: async (imageFile: File): Promise<PredictionResult> => {
    try {
      const base64Image = await fileToBase64(imageFile);

      const response = await apiClient.post('/predict/tuberculosis', {
        image_base64: base64Image,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  },

  /**
   * Predict TB using FormData (alternative method)
   * @param imageFile - Image file from input
   * @returns Promise<PredictionResult>
   */
  predictWithFile: async (imageFile: File): Promise<PredictionResult> => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await apiClient.post('/predict/tuberculosis/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  },

  /**
   * Get health status of the API
   * @returns Promise<HealthResponse>
   */
  getHealth: async (): Promise<HealthResponse> => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Health check failed: ' + error.message);
      }
      throw error;
    }
  },

  /**
   * Get information about available models
   * @returns Promise<any>
   */
  getModelsInfo: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/info/models');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Failed to get models info: ' + error.message);
      }
      throw error;
    }
  },

  /**
   * Get API version and endpoints
   * @returns Promise<any>
   */
  getApiInfo: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('Failed to get API info: ' + error.message);
      }
      throw error;
    }
  },

  /**
   * Predict Pneumonia
   * @param imageFile - Image file
   * @returns Promise<PredictionResult>
   */
  predictPneumonia: async (imageFile: File): Promise<PredictionResult> => {
    try {
      const base64Image = await fileToBase64(imageFile);

      const response = await apiClient.post('/predict/pneumonia', {
        image_base64: base64Image,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  },

  /**
   * Predict Bone Fracture
   * @param imageFile - Image file
   * @returns Promise<PredictionResult>
   */
  predictBoneFracture: async (imageFile: File): Promise<PredictionResult> => {
    try {
      const base64Image = await fileToBase64(imageFile);

      const response = await apiClient.post('/predict/bone_fracture', {
        image_base64: base64Image,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  },

  /**
   * Predict Lung Cancer
   * @param imageFile - Image file
   * @returns Promise<PredictionResult>
   */
  predictLungCancer: async (imageFile: File): Promise<PredictionResult> => {
    try {
      const base64Image = await fileToBase64(imageFile);

      const response = await apiClient.post('/predict/lung_cancer', {
        image_base64: base64Image,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || error.message);
      }
      throw error;
    }
  },
};

export default apiClient;
