import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  resultsService,
  CreateResultRequest,
  ResultResponse,
} from '../services/resultsService';

/**
 * Results Query and Mutation Hooks using TanStack Query
 */

export const useGetAllResults = () => {
  return useQuery({
    queryKey: ['results', 'all'],
    queryFn: () => resultsService.getAllResults(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetResultById = (resultId: string) => {
  return useQuery({
    queryKey: ['results', resultId],
    queryFn: () => resultsService.getResultById(resultId),
    enabled: !!resultId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetResultsByPatientId = (patientId: string) => {
  return useQuery({
    queryKey: ['results', 'patient', patientId],
    queryFn: () => resultsService.getResultsByPatientId(patientId),
    enabled: !!patientId,
  });
};

export const useCreateResult = () => {
  const queryClient = useQueryClient();

  return useMutation<ResultResponse, Error, CreateResultRequest>({
    mutationFn: (data: CreateResultRequest) => resultsService.createResult(data),
    onSuccess: (newResult: ResultResponse) => {
      // Add to cache
      queryClient.setQueryData(['results', newResult.id], newResult);
      // Invalidate results list
      queryClient.invalidateQueries({ queryKey: ['results', 'all'] });
      // Invalidate patient-specific results
      queryClient.invalidateQueries({ queryKey: ['results', 'patient', newResult.patientId] });
      toast.success(`Diagnosis result created successfully`);
    },
    onError: (error: Error) => {
      console.error('Failed to create result:', error);
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();

  return useMutation<ResultResponse, Error, { resultId: string; data: Partial<CreateResultRequest> }>({
    mutationFn: ({ resultId, data }: { resultId: string; data: Partial<CreateResultRequest> }) =>
      resultsService.updateResult(resultId, data),
    onSuccess: (updatedResult: ResultResponse) => {
      queryClient.setQueryData(['results', updatedResult.id], updatedResult);
      queryClient.invalidateQueries({ queryKey: ['results', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['results', 'patient', updatedResult.patientId] });
      toast.success('Diagnosis result updated successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to update result:', error);
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (resultId: string) => resultsService.deleteResult(resultId),
    onSuccess: (_, resultId) => {
      queryClient.removeQueries({ queryKey: ['results', resultId] });
      queryClient.invalidateQueries({ queryKey: ['results', 'all'] });
      toast.success('Diagnosis result deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Failed to delete result:', error);
    },
  });
};

export const useGetTBDiagnosis = (patientId: string) => {
  return useQuery({
    queryKey: ['results', patientId, 'tb-diagnosis'],
    queryFn: () => resultsService.getTBDiagnosis(patientId),
    enabled: !!patientId,
  });
};

export const useCreateTBDiagnosis = () => {
  const queryClient = useQueryClient();

  return useMutation<ResultResponse, Error, CreateResultRequest>({
    mutationFn: (data: CreateResultRequest) => resultsService.createTBDiagnosis(data),
    onSuccess: (newResult: ResultResponse) => {
      queryClient.setQueryData(['results', newResult.id], newResult);
      queryClient.invalidateQueries({ queryKey: ['results', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['results', 'patient'] });
      queryClient.invalidateQueries({ queryKey: ['results', newResult.patientId, 'tb-diagnosis'] });
    },
    onError: (error: Error) => {
      console.error('Failed to create TB diagnosis:', error);
    },
  });
};
