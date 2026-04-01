/**
 * API Type Definitions
 * Matches backend DTOs and entities from NestJS API
 */

// ==================== USER TYPES ====================
export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'PHYSICIAN' | 'RADIOLOGIST' | 'USER';
  phone?: string | null;
  license?: string | null;
  specialization?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== PATIENT TYPES ====================
export interface PatientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory?: string | null;
  allergies?: string | null;
  medications?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  physicianId: string;
  createdAt: string;
  updatedAt: string;
  xrays?: XRayResponseDto[];
  diagnosisResults?: DiagnosisResultResponseDto[];
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  imageBase64?: string; // Base64 encoded X-ray image
  imageFile?: File; // File object for multipart upload
  fileName?: string;
  xrayType?: string;
  xrayNotes?: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  imageBase64?: string; // Base64 encoded X-ray image for later upload
  imageFile?: File; // File object for multipart upload
  fileName?: string;
  xrayType?: string;
  xrayNotes?: string;
}

// ==================== X-RAY TYPES ====================
export enum XRayStatus {
  PENDING = 'pending',
  VALIDATING = 'validating',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface XRayResponseDto {
  id: string;
  patientId: string;
  imageBase64: string;
  fileName?: string | null;
  fileType?: string | null;
  fileSizeBytes?: number | null;
  status: XRayStatus;
  xrayType?: string | null;
  notes?: string | null;
  isValid: boolean;
  validationConfidence?: number | null;
  validationError?: string | null;
  deviceIpAddress?: string | null;
  createdAt: string;
  updatedAt: string;
  diagnosisResults?: DiagnosisResultResponseDto[];
}

// ==================== DIAGNOSIS RESULT TYPES ====================
export enum DiseaseType {
  TUBERCULOSIS = 'tuberculosis',
  PNEUMONIA = 'pneumonia',
  LUNG_CANCER = 'lung_cancer',
  BONE_FRACTURE = 'bone_fracture',
}

export enum TBIntensity {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical',
}

export enum ConfidenceLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

export enum DiagnosisStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  UPDATED = 'updated',
}

export interface DiagnosisResultResponseDto {
  id: string;
  patientId: string;
  xrayId: string;
  diseaseType: DiseaseType;
  prediction: string;
  confidenceScore: number; // 0-1 scale
  confidenceLevel: ConfidenceLevel;
  tbIntensity: TBIntensity;
  status: DiagnosisStatus; // Status of the diagnosis (pending, completed, failed, updated)
  affectedAreas?: string | null;
  affectedPercentage?: number | null;
  heatmapBase64?: string | null;
  clinicalFindings?: string | null;
  recommendations?: string | null;
  modelName?: string | null;
  processingTimeMs?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagnosisResultDto {
  patientId: string;
  xrayId: string;
  diseaseType: DiseaseType;
  prediction: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  tbIntensity?: TBIntensity;
  affectedAreas?: string;
  affectedPercentage?: number;
  heatmapBase64?: string;
  clinicalFindings?: string;
  recommendations?: string;
  modelName?: string;
  processingTimeMs?: number;
}

// ==================== AUTH TYPES ====================
export interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  phone?: string | null;
  license?: string | null;
  specialization?: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string | undefined;
  license?: string | undefined;
  specialization?: string | undefined;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== QUERY PARAMETERS ====================
export interface PatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DiagnosisResultsQueryParams {
  page?: number;
  limit?: number;
  patientId?: string;
  diseaseType?: DiseaseType;
  prediction?: string;
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardStats {
  totalPatients: number;
  totalAnalyzed: number;
  positiveResults: number;
  pendingResults: number;
  averageConfidence: number;
}

export interface PhysicianStats extends DashboardStats {
  reviewedResults: number;
  pendingReview: number;
}

export interface SystemStats extends DashboardStats {
  totalPhysicians: number;
  activeSessions: number;
  lastSyncTime: string;
}
