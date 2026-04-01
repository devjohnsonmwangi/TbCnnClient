import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";
import { UserRole } from "../context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole | UserRole[];
}

/**
 * Check if user has one of the required roles
 */
function hasRequiredRole(userRole: string | undefined, requiredRoles: UserRole | UserRole[]): boolean {
  if (!userRole) return false;
  
  const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return rolesArray.includes(userRole as UserRole);
}

/**
 * Get the appropriate dashboard path for a user role
 */
function getDashboardPath(role: string | undefined): string {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin-dashboard";
  } else if (role === "PHYSICIAN" || role === "RADIOLOGIST") {
    return "/physician-dashboard";
  }
  return "/";
}

function RoleProtectedRoute({ children, requiredRoles }: RoleProtectedRouteProps) {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!hasRequiredRole(user?.role, requiredRoles)) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = getDashboardPath(user?.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}

export default RoleProtectedRoute;
