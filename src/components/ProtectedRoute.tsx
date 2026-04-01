import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-6">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
