import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { patientsService, PatientResponse, CreatePatientRequest } from '../../services/patientsService';
import { resultsService, ResultResponse } from '../../services/resultsService';
import { fileToBase64 } from '../../utils/imageUtils';
import { DiagnosisResultResponseDto, DiseaseType } from '../../types/api.types';

/**
 * TB Prediction/Diagnosis Response
 * Returned after a patient is created with X-ray and diagnosis is generated
 */
export interface TBDiagnosisResponse {
  patient: PatientResponse;
  diagnosis: DiagnosisResultResponseDto;
  prediction: string;
  confidenceScore: number;
  affectedAreas?: string | null;
  recommendations?: string | null;
}

/**
 * TB Prediction State
 * Manages the state of TB diagnosis workflows
 */
export interface TBState {
  loading: boolean;
  diagnosis: TBDiagnosisResponse | null;
  patient: PatientResponse | null;
  allResults: DiagnosisResultResponseDto[];
  error: string | null;
  success: boolean;
}

const initialState: TBState = {
  loading: false,
  diagnosis: null,
  patient: null,
  allResults: [],
  error: null,
  success: false,
};

/**
 * Async thunk: Create patient with X-ray and generate TB diagnosis
 * This is the main workflow for TB detection
 */
interface CreatePatientWithDiagnosisPayload {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  imageFile?: File;
  imageBase64?: string;
  medicalHistory?: string;
}

export const createPatientWithTBDiagnosis = createAsyncThunk<
  TBDiagnosisResponse,
  CreatePatientWithDiagnosisPayload,
  { rejectValue: string }
>(
  'tb/createPatientWithDiagnosis',
  async (
    data: CreatePatientWithDiagnosisPayload,
    thunkAPI: any
  ) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // Prepare patient creation request
      const patientRequest: CreatePatientRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        phone: data.phone,
        gender: data.gender,
        medicalHistory: data.medicalHistory,
      };

      // Handle image conversion if imageFile is provided
      if (data.imageFile && !data.imageBase64) {
        patientRequest.imageBase64 = await fileToBase64(data.imageFile);
      } else if (data.imageBase64) {
        patientRequest.imageBase64 = data.imageBase64;
      } else if (data.imageFile) {
        patientRequest.imageFile = data.imageFile;
      }

      // Create patient with X-ray and TB diagnosis
      // The backend will automatically:
      // 1. Validate the X-ray image
      // 2. Get TB prediction from ML model
      // 3. Store the diagnosis result
      // 4. Return patient with diagnosis
      const patient = await patientsService.createPatient(patientRequest);

      // Extract the diagnosis from the patient's diagnosisResults
      const diagnosis = patient.diagnosisResults?.[0];

      if (!diagnosis) {
        throw new Error('Diagnosis not generated');
      }

      const response: TBDiagnosisResponse = {
        patient,
        diagnosis,
        prediction: diagnosis.prediction,
        confidenceScore: diagnosis.confidenceScore,
        affectedAreas: diagnosis.affectedAreas,
        recommendations: diagnosis.recommendations,
      };

      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create patient with TB diagnosis');
    }
  }
);

/**
 * Async thunk: Get TB diagnosis for existing patient
 */
export const getTBDiagnosis = createAsyncThunk<
  TBDiagnosisResponse,
  string,
  { rejectValue: string }
>(
  'tb/getDiagnosis',
  async (patientId: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const patient = await patientsService.getPatientById(patientId);
      
      // Get TB-specific results for this patient
      const allResults = await resultsService.getPatientResults(patientId);
      const tbResults = allResults.filter(r => r.diseaseType === DiseaseType.TUBERCULOSIS);

      if (tbResults.length === 0) {
        throw new Error('No TB diagnosis found for this patient');
      }

      const diagnosis = tbResults[tbResults.length - 1]; // Latest result

      const response: TBDiagnosisResponse = {
        patient,
        diagnosis,
        prediction: diagnosis.prediction,
        confidenceScore: diagnosis.confidenceScore,
        affectedAreas: diagnosis.affectedAreas,
        recommendations: diagnosis.recommendations,
      };

      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch TB diagnosis');
    }
  }
);

/**
 * Async thunk: Get all TB results for current user
 */
export const getAllTBResults = createAsyncThunk<
  DiagnosisResultResponseDto[],
  void,
  { rejectValue: string }
>(
  'tb/getAllResults',
  async (_: void, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const allResults = await resultsService.getAllResults();
      const tbResults = allResults.filter(r => r.diseaseType === DiseaseType.TUBERCULOSIS);
      return tbResults;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch TB results');
    }
  }
);

const tbSlice = createSlice({
  name: 'tb',
  initialState,
  reducers: {
    resetDiagnosis: (state: TBState) => {
      state.diagnosis = null;
      state.patient = null;
      state.error = null;
      state.success = false;
      state.loading = false;
    },
    clearError: (state: TBState) => {
      state.error = null;
    },
    clearSuccess: (state: TBState) => {
      state.success = false;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<TBState>) => {
    // Handle createPatientWithTBDiagnosis thunk
    builder
      .addCase(createPatientWithTBDiagnosis.pending, (state: TBState) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPatientWithTBDiagnosis.fulfilled, (state: TBState, action: PayloadAction<TBDiagnosisResponse>) => {
        state.loading = false;
        state.diagnosis = action.payload;
        state.patient = action.payload.patient;
        state.success = true;
        state.error = null;
      })
      .addCase(createPatientWithTBDiagnosis.rejected, (state: TBState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Unknown error';
        state.success = false;
      })
      // Handle getTBDiagnosis thunk
      .addCase(getTBDiagnosis.pending, (state: TBState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTBDiagnosis.fulfilled, (state: TBState, action: PayloadAction<TBDiagnosisResponse>) => {
        state.loading = false;
        state.diagnosis = action.payload;
        state.patient = action.payload.patient;
        state.error = null;
      })
      .addCase(getTBDiagnosis.rejected, (state: TBState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Unknown error';
      })
      // Handle getAllTBResults thunk
      .addCase(getAllTBResults.pending, (state: TBState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTBResults.fulfilled, (state: TBState, action: PayloadAction<DiagnosisResultResponseDto[]>) => {
        state.loading = false;
        state.allResults = action.payload;
        state.error = null;
      })
      .addCase(getAllTBResults.rejected, (state: TBState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Unknown error';
      });
  },
});

export const { resetDiagnosis, clearError, clearSuccess } = tbSlice.actions;
export default tbSlice.reducer;
