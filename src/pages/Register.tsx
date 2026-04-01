import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiFileText, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../hooks/useAuthContext";

function Register() {
  const navigate = useNavigate();
  const { register, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    license: "",
    specialization: "",
    phone: "",
  });
  const [localError, setLocalError] = useState("");

  const specializations = [
    "Pulmonology",
    "Internal Medicine",
    "Radiology",
    "General Practice",
    "Infectious Disease",
    "Other",
  ];

  // Handle role-based navigation after successful registration
  useEffect(() => {
    if (user) {
      console.log("Registration successful. User role:", user.role);
      
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!formData.license) {
        throw new Error("Medical license number is required");
      }

      await register(
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.password,
        "PHYSICIAN", // Default role
        formData.license,
        formData.specialization,
        formData.phone || undefined
      );
      // Navigation happens automatically via useEffect when user is set
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setLocalError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-3 sm:px-4 pt-20 sm:pt-24">
      <div className="w-full sm:max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-8"
        >
          <FiArrowLeft className="text-xl" />
          Back to Login
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Register as a healthcare professional</p>
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
          <form onSubmit={handleRegister} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>
            </div>

            {/* Medical License */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Medical License Number *</label>
              <div className="relative">
                <FiFileText className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="text"
                  name="license"
                  value={formData.license}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="LIC-2024-001234"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Your medical license will be verified</p>
            </div>

            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="block text-gray-700 font-semibold mb-2">Medical Specialization *</label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                required
              >
                <option value="">Select your specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number (Optional)</label>
              <div className="relative">
                <FiFileText className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-5 h-5 accent-emerald-600"
                required
              />
              <label htmlFor="terms" className="text-gray-700 text-sm">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  onClick={() => navigate("/terms-of-use")}
                >
                  Terms of Use
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  onClick={() => navigate("/privacy-policy")}
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-4">
          <p className="text-emerald-800 text-sm">
            <span className="font-semibold">License Verification:</span> Your medical license will be verified against official databases
            before account activation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
