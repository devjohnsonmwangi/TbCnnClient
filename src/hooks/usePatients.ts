import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  patientsService,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientResponse,
} from '../services/patientsService';

/**
 * Patients Query and Mutation Hooks using TanStack Query
 */

export const useGetAllPatients = () => {
  return useQuery({
    queryKey: ['patients', 'all'],
    queryFn: () => patientsService.getAllPatients(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPatientById = (patientId: string) => {
  return useQuery({
    queryKey: ['patients', patientId],
    queryFn: () => patientsService.getPatientById(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, Error, CreatePatientRequest>({
    mutationFn: (data: CreatePatientRequest) => patientsService.createPatient(data),
    onSuccess: (newPatient: PatientResponse) => {
      // Add new patient to cache
      queryClient.setQueryData(['patients', newPatient.id], newPatient);
      // Invalidate patients list to refetch
      queryClient.invalidateQueries({ queryKey: ['patients', 'all'] });
      toast.success(`Patient ${newPatient.firstName} ${newPatient.lastName} created successfully`);
    },
    onError: (error: Error) => {
      console.error('Failed to create patient:', error);
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<PatientResponse, Error, { patientId: string; data: UpdatePatientRequest }>({
    mutationFn: ({ patientId, data }: { patientId: string; data: UpdatePatientRequest }) =>
      patientsService.updatePatient(patientId, data),
    onSuccess: (updatedPatient: PatientResponse) => {
      // Update cache for this patient
      queryClient.setQueryData(['patients', updatedPatient.id], updatedPatient);
      // Invalidate patients list
      queryClient.invalidateQueries({ queryKey: ['patients', 'all'] });
      toast.success(`Patient ${updatedPatient.firstName} ${updatedPatient.lastName} updated successfully`);
    },
    onError: (error: Error) => {
      console.error('Failed to update patient:', error);
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (patientId: string) => patientsService.deletePatient(patientId),
    onSuccess: (_, patientId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['patients', patientId] });
      // Invalidate patients list
      queryClient.invalidateQueries({ queryKey: ['patients', 'all'] });
      toast.success('Patient deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to delete patient:', error);
    },
  });
};

export const useGetPatientXRays = (patientId: string) => {
  return useQuery({
    queryKey: ['patients', patientId, 'xrays'],
    queryFn: () => patientsService.getPatientXRays(patientId),
    enabled: !!patientId,
  });
};

export const useGetPatientDiagnosisResults = (patientId: string) => {
  return useQuery({
    queryKey: ['patients', patientId, 'results'],
    queryFn: () => patientsService.getPatientDiagnosisResults(patientId),
    enabled: !!patientId,
  });
};
