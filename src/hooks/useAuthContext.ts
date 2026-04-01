import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

/**
 * Custom hook to access the Auth context
 * Extracted to separate file to fix Vite Fast Refresh HMR issues
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
