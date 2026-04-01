import { useMutation, useQuery } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest, AuthResponse } from '../services/authService';
import { queryClient } from '../config/queryClient';

/**
 * Auth Query and Mutation Hooks using TanStack Query
 */

export const useAuthLogin = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Store tokens and user info
      localStorage.setItem('authToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      // Store user info
      const user = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      };
      localStorage.setItem('user', JSON.stringify(user));
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useAuthRegister = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      // Store tokens and user info
      localStorage.setItem('authToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      // Store user info
      const user = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      };
      localStorage.setItem('user', JSON.stringify(user));
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: Error) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useAuthRefreshToken = () => {
  return useMutation<{ accessToken: string; expiresIn: string }, Error, void>({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      return authService.refreshToken(refreshToken);
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.accessToken);
      // Refetch user queries after token refresh
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useAuthLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Clear all queries on logout
      queryClient.clear();
    },
  });
};

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    },
    enabled: !!localStorage.getItem('authToken'),
  });
};

export const useIsAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};
