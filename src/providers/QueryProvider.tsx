import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../config/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider Component
 * Wraps the application with TanStack Query functionality
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
