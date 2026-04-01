import axios, { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface PatientIntakeData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  medicalHistory?: string;
  symptoms: string;
  diseaseType: string;
  xrayImages: File[];
}

interface PatientResponse {
  patientId: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  createdAt: string;
}

interface XrayUploadResponse {
  jobId: string;
  patientId: string;
  status: string;
  message: string;
}

interface JobStatusResponse {
  jobId: string;
  status: string;
  progress?: number;
  result?: any;
  error?: string;
  createdAt?: string;
  completedAt?: string;
}

interface DiagnosticResultResponse {
  jobId: string;
  patientId: string;
  diseaseType: string;
  prediction: {
    detected: boolean;
    confidence: number;
    affectedAreas?: string[];
  };
  heatmap?: string;
  riskLevel: string;
  recommendations: string[];
  nextSteps: string[];
  timestamp: string;
}

class APIService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a new patient record
   */
  async createPatient(patientData: {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    gender: string;
    medicalHistory?: string;
  }): Promise<PatientResponse> {
    try {
      const response = await this.apiClient.post<PatientResponse>(
        "/patients",
        patientData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create patient");
    }
  }

  /**
   * Get patient information
   */
  async getPatient(patientId: string): Promise<PatientResponse> {
    try {
      const response = await this.apiClient.get<PatientResponse>(
        `/patients/${patientId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch patient");
    }
  }

  /**
   * Upload X-ray images and submit for analysis
   */
  async uploadXrayImages(
    patientId: string,
    files: File[],
    diseaseType: string,
    symptoms: string
  ): Promise<XrayUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("diseaseType", diseaseType);
      formData.append("symptoms", symptoms);
      
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await this.apiClient.post<XrayUploadResponse>(
        `/xray/upload/${patientId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to upload X-ray images");
    }
  }

  /**
   * Get job status and progress
   */
  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      const response = await this.apiClient.get<JobStatusResponse>(
        `/xray/status/${jobId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch job status");
    }
  }

  /**
   * Poll for job completion
   */
  async pollJobStatus(
    jobId: string,
    maxAttempts: number = 60,
    interval: number = 2000
  ): Promise<DiagnosticResultResponse> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        attempts++;

        try {
          const status = await this.getJobStatus(jobId);

          if (status.status === "completed" && status.result) {
            clearInterval(pollInterval);
            resolve(status.result);
          } else if (status.status === "failed") {
            clearInterval(pollInterval);
            reject(new Error(status.error || "Job processing failed"));
          }

          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            reject(new Error("Job processing timeout"));
          }
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      }, interval);
    });
  }

  /**
   * Get diagnostic results
   */
  async getDiagnosticResults(jobId: string): Promise<DiagnosticResultResponse> {
    try {
      const response = await this.apiClient.get<DiagnosticResultResponse>(
        `/results/${jobId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch diagnostic results");
    }
  }

  /**
   * Predict X-ray in real-time
   */
  async predictXray(
    file: File,
    diseaseType: string
  ): Promise<{
    prediction: string;
    confidence: number;
    heatmap?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("diseaseType", diseaseType);

      const response = await this.apiClient.post(
        "/xray/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to predict X-ray");
    }
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    status: string;
    services: Record<string, string>;
  }> {
    try {
      const response = await this.apiClient.get("/health");
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch health status");
    }
  }

  /**
   * Submit patient intake form
   */
  async submitPatientIntake(
    patientData: PatientIntakeData
  ): Promise<{
    patientId: string;
    jobId: string;
    message: string;
  }> {
    try {
      // Step 1: Create patient
      const patient = await this.createPatient({
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        medicalHistory: patientData.medicalHistory,
      });

      // Step 2: Upload X-rays
      const uploadResponse = await this.uploadXrayImages(
        patient.patientId,
        patientData.xrayImages,
        patientData.diseaseType,
        patientData.symptoms
      );

      return {
        patientId: patient.patientId,
        jobId: uploadResponse.jobId,
        message: "Patient intake submitted successfully",
      };
    } catch (error) {
      throw this.handleError(error, "Failed to submit patient intake");
    }
  }

  /**
   * Get patient submission with diagnostic results
   */
  async getPatientSubmission(patientId: string): Promise<any> {
    try {
      const response = await this.apiClient.get(
        `/patients/${patientId}/submission`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch patient submission");
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(`${defaultMessage}: ${message}`);
    }
    return new Error(defaultMessage);
  }
}

export default new APIService();
