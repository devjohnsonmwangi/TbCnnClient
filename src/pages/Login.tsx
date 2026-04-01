import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft, FiActivity } from "react-icons/fi";
import { useAuth } from "../hooks/useAuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Handle role-based navigation after successful login
  useEffect(() => {
    if (user) {
      console.log("Login successful. User role:", user.role);
      
      // Determine dashboard based on role
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        console.log("Navigating to admin dashboard");
        navigate("/admin-dashboard", { replace: true });
      } else if (user.role === "PHYSICIAN" || user.role === "RADIOLOGIST") {
        console.log("Navigating to physician dashboard");
        navigate("/physician-dashboard", { replace: true });
      } else {
        console.warn("Unknown role:", user.role, "Navigating to patient intake");
        // Fallback for any other roles
        navigate("/patient-intake", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      // Navigation happens automatically via useEffect when user is set
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-3 sm:px-4 pt-20 sm:pt-24">
      <div className="w-full sm:max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-8"
          aria-label="Back to home page"
        >
          <FiArrowLeft className="text-xl" />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your physician account</p>
          </div>

          {/* Error Message */}
          {localError && (
            <div
              className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-6"
              role="alert"
            >
              <p className="text-red-700 text-sm">{localError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="doctor@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Password *
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <FiActivity className="animate-spin" size={20} />}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
                disabled={isLoading}
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">Physicians Only:</span> This system is
            exclusively for licensed healthcare professionals. Login credentials are
            verified against medical licensing databases.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
