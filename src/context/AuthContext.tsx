import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { authService, AuthResponse } from "../services/authService";
import { setAuth, clearAuth, restoreAuth, setLoading, setError } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";

export type UserRole = "PHYSICIAN" | "ADMIN" | "RADIOLOGIST" | "SUPER_ADMIN";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  license?: string;
  specialization?: string;
  phone?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role?: UserRole,
    license?: string,
    specialization?: string,
    phone?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isPhysician: boolean;
  error: string | null;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const authState = useSelector((state: RootState) => state.auth);
  const { user, isLoading, error, accessToken } = authState;

  // On mount, restore auth from localStorage if available
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedAccessToken = localStorage.getItem("authToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedUser && storedAccessToken && storedRefreshToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          dispatch(
            restoreAuth({
              user: {
                id: parsedUser.id,
                email: parsedUser.email,
                firstName: parsedUser.firstName,
                lastName: parsedUser.lastName,
                role: parsedUser.role,
                license: parsedUser.license,
                specialization: parsedUser.specialization,
                phone: parsedUser.phone,
              },
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
            })
          );
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          dispatch(clearAuth());
        }
      }
    };

    initAuth();
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await authService.login({ email, password });

      // Extract user data from response
      const userData: User = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role as UserRole,
        license: (response as any).license,
        specialization: (response as any).specialization,
        phone: (response as any).phone,
      };

      // Store in Redux and localStorage
      dispatch(
        setAuth({
          user: userData,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );

      toast.success(`Welcome back, ${userData.firstName}!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role?: UserRole,
    license?: string,
    specialization?: string,
    phone?: string
  ) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await authService.register({
        email,
        firstName,
        lastName,
        password,
        role,
        license,
        specialization,
        phone,
      });

      // Extract user data from response
      const userData: User = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role as UserRole,
        license: (response as any).license,
        specialization: (response as any).specialization,
        phone: (response as any).phone,
      };

      // Store in Redux and localStorage
      dispatch(
        setAuth({
          user: userData,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })
      );

      toast.success(
        `Welcome, ${firstName}! Your account has been created successfully.`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setLoading(true));
    try {
      await authService.logout();
      dispatch(clearAuth());
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear auth locally even if API call fails
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isPhysician = user?.role === "PHYSICIAN" || user?.role === "RADIOLOGIST";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isLoggedIn: !!user,
        isAdmin,
        isPhysician,
        error,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
