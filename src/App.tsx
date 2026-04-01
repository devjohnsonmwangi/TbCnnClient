import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import LandingPage from "./pages/LandingPage";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientIntakeForm from "./pages/PatientIntakeForm";
import DiagnosticResults from "./pages/DiagnosticResults";
import Tuberculosis from "./pages/Tuberculosis";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";
import PhysicianDashboard from "./pages/PhysicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserAnalysisDetails from "./pages/UserAnalysisDetails";
import ProfessionDetailsPage from "./pages/ProfessionDetailsPage";
import MissingXraysManagementPage from "./pages/MissingXraysManagementPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/patient-intake"
              element={
                <ProtectedRoute>
                  <PatientIntakeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <DiagnosticResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/physician-dashboard"
              element={
                <RoleProtectedRoute requiredRoles={["PHYSICIAN", "RADIOLOGIST"]}>
                  <PhysicianDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/missing-xrays"
              element={
                <RoleProtectedRoute requiredRoles={["PHYSICIAN", "RADIOLOGIST"]}>
                  <MissingXraysManagementPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <RoleProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/user-analysis/:userId"
              element={
                <RoleProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <UserAnalysisDetails />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/profession-details/:professionalId"
              element={
                <RoleProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                  <ProfessionDetailsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/patient/:patientId"
              element={
                <RoleProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN", "PHYSICIAN", "RADIOLOGIST"]}>
                  <PatientDetailsPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/tuberculosis" element={<Tuberculosis />} />
            <Route path="/tb" element={<Tuberculosis />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
