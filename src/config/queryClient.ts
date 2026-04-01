import { QueryClient } from '@tanstack/react-query';

/**
 * Configure TanStack Query Client
 * Handles default options for queries and mutations
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      networkMode: 'always',
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      networkMode: 'always',
      retry: 0,
    },
  },
});
