import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

/**
 * Custom hook to get the access token from Redux store
 * Used by services and components that need the token
 * @returns The current access token or null if not authenticated
 */
export function useAccessToken(): string | null {
  return useSelector((state: RootState) => state.auth.accessToken);
}

/**
 * Custom hook to check if user is authenticated
 * @returns true if user is logged in, false otherwise
 */
export function useIsAuthenticated(): boolean {
  return useSelector((state: RootState) => state.auth.isAuthenticated);
}

/**
 * Custom hook to get the current user from Redux store
 * @returns The current user object or null if not authenticated
 */
export function useCurrentUser() {
  return useSelector((state: RootState) => state.auth.user);
}
