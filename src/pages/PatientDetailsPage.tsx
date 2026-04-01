import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiUpload,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiImage,
  FiFileText,
  FiRotateCw,
  FiActivity,
} from "react-icons/fi";
import { PatientResponseDto, DiagnosisResultResponseDto, DiagnosisStatus, XRayStatus } from "../types/api.types";
import { PatientsService } from "../services/patientsService";
import { base64ToDataUrl, detectMimeTypeFromFile, fileToBase64 } from "../utils/imageUtils";

interface LocationState {
  patient: PatientResponseDto;
  results?: DiagnosisResultResponseDto[];
}

export function PatientDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [patient, setPatient] = useState<PatientResponseDto | null>(state?.patient || null);
  const [results, setResults] = useState<DiagnosisResultResponseDto[]>(state?.results || []);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editData, setEditData] = useState<Partial<PatientResponseDto> | null>(null);
  const [xrayPreview, setXrayPreview] = useState<string | null>(null);
  const [resubmitting, setResubmitting] = useState(false);
  const patientsService = new PatientsService();

  useEffect(() => {
    if (!patient) {
      navigate(-1);
    }
    // Set initial edit data
    if (patient && !editData) {
      setEditData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        medications: patient.medications,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        postalCode: patient.postalCode,
        country: patient.country,
      });
    }
  }, [patient, editData, navigate]);

  const handleInputChange = (
    field: keyof PatientResponseDto,
    value: string
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const handleXrayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !patient) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      toast.loading("📸 Converting X-ray image to Base64...");
      const base64 = await fileToBase64(file);
      console.log(`✅ Base64 conversion successful, Length: ${base64.length}`);

      const mimeType = await detectMimeTypeFromFile(file);
      const dataUrl = base64ToDataUrl(base64, mimeType);
      setXrayPreview(dataUrl);

      toast.dismiss();
      toast.loading("📝 Updating patient with new X-ray...");

      const response = await patientsService.updatePatient(patient.id, {
        imageBase64: base64,
        fileName: file.name,
      });

      setPatient(response);
      toast.dismiss();
      toast.success("✅ X-ray image uploaded and patient record updated successfully!");

      // Reset file input
      const fileInput = e.target;
      fileInput.value = "";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload X-ray";
      console.error("❌ X-ray upload error:", error);
      toast.dismiss();
      toast.error(`⚠️ Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleResubmitXray = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !patient) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setResubmitting(true);
    try {
      toast.loading("📸 Converting X-ray image to Base64...");
      const base64 = await fileToBase64(file);
      console.log(`✅ Base64 conversion successful for resubmit, Length: ${base64.length}`);

      const mimeType = await detectMimeTypeFromFile(file);
      const dataUrl = base64ToDataUrl(base64, mimeType);
      setXrayPreview(dataUrl);

      toast.dismiss();
      toast.loading("📝 Resubmitting X-ray for analysis...");

      const response = await patientsService.updatePatient(patient.id, {
        imageBase64: base64,
        fileName: file.name,
      });

      setPatient(response);
      setResults(response.diagnosisResults || []);
      
      toast.dismiss();
      toast.success("✅ X-ray resubmitted successfully! Analysis in progress...");

      // Reset file input
      const fileInput = e.target;
      fileInput.value = "";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resubmit X-ray";
      console.error("❌ X-ray resubmit error:", error);
      toast.dismiss();
      toast.error(`⚠️ Resubmit failed: ${errorMessage}`);
    } finally {
      setResubmitting(false);
    }
  };

  const handleReAnalyzeXray = async () => {
    if (!patient?.xrays || !patient.xrays[0] || !patient.xrays[0].imageBase64) {
      toast.error("No X-ray image found to re-analyze");
      return;
    }

    setResubmitting(true);
    try {
      const toastId = toast.loading("🔄 Re-analyzing X-ray...");
      
      await patientsService.triggerXrayAnalysis(patient.id, patient.xrays[0].id);
      
      toast.dismiss(toastId);
      toast.success("✅ X-ray re-analysis completed!");

      // Refresh patient data
      const refreshedPatient = await patientsService.getPatientById(patient.id);
      setPatient(refreshedPatient);
      setResults(refreshedPatient.diagnosisResults || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to re-analyze X-ray";
      console.error("❌ Re-analysis error:", error);
      toast.error(`Failed to re-analyze: ${errorMessage}`);
    } finally {
      setResubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!patient || !editData) return;

    setLoading(true);
    try {
      toast.loading("💾 Saving patient information...");
      const response = await patientsService.updatePatient(patient.id, editData as any);
      setPatient(response);
      setIsEditing(false);
      toast.dismiss();
      toast.success("✅ Patient information updated successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save";
      console.error("Save error:", error);
      toast.dismiss();
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setXrayPreview(null);
    if (patient) {
      setEditData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone,
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        medications: patient.medications,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        postalCode: patient.postalCode,
        country: patient.country,
      });
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <FiX size={48} className="text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Patient not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const latestResult = results && results.length > 0 ? results[0] : null;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-emerald-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
            aria-label="Go back"
          >
            <FiArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header */}
        <div className="mb-8 pb-6 border-b-2 border-emerald-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">📅 {formattedDate}</span>
                <span className="flex items-center gap-1">🕐 {formattedTime}</span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition whitespace-nowrap"
              >
                ✏️
                <span className="hidden sm:inline">Edit Patient</span>
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Patient Information */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-emerald-600">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-emerald-600" />
                Patient Information
              </h2>

              {isEditing ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={editData?.firstName || ""}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={editData?.lastName || ""}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={patient.email}
                      disabled
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={editData?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
                      Medical History
                    </label>
                    <textarea
                      id="medicalHistory"
                      value={editData?.medicalHistory || ""}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    <input
                      id="allergies"
                      type="text"
                      value={editData?.allergies || ""}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                      Medications
                    </label>
                    <input
                      id="medications"
                      type="text"
                      value={editData?.medications || ""}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={editData?.city || ""}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        value={editData?.state || ""}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        value={editData?.postalCode || ""}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        value={editData?.country || ""}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading && <FiActivity className="animate-spin" size={18} />}
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Email</p>
                      <p className="text-sm font-medium">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Phone</p>
                      <p className="text-sm font-medium">{patient.phone || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Gender</p>
                      <p className="text-sm font-medium">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">DOB</p>
                      <p className="text-sm font-medium">
                        {patient.dateOfBirth
                          ? new Date(patient.dateOfBirth).toLocaleDateString("en-US")
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {patient.medicalHistory && (
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Medical History</p>
                      <p className="text-sm">{patient.medicalHistory}</p>
                    </div>
                  )}

                  {patient.allergies && (
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Allergies</p>
                      <p className="text-sm text-red-600 font-medium">{patient.allergies}</p>
                    </div>
                  )}

                  {patient.medications && (
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Medications</p>
                      <p className="text-sm">{patient.medications}</p>
                    </div>
                  )}

                  {patient.address && (
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold">Address</p>
                      <p className="text-sm">
                        {[patient.address, patient.city, patient.state, patient.postalCode, patient.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs uppercase text-gray-500 font-semibold">Member Since</p>
                    <p className="text-sm font-medium">
                      {new Date(patient.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnosis Procedure Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-600">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiActivity className="text-indigo-600" />
                Diagnosis Procedure
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">1</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">X-Ray Upload</h3>
                    <p className="text-sm text-gray-600 mt-1">Patient X-ray image uploaded and converted to Base64 format</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">2</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">X-Ray Validation</h3>
                    <p className="text-sm text-gray-600 mt-1">Image validated for proper medical X-ray format (JPEG, PNG, DICOM)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">3</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ML Model Analysis</h3>
                    <p className="text-sm text-gray-600 mt-1">Base64 X-ray sent to TB detection model for analysis and prediction</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">4</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Results & Heatmap</h3>
                    <p className="text-sm text-gray-600 mt-1">Diagnosis result with confidence score and heatmap visualization generated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis Results */}
            {latestResult && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCheck className="text-blue-600" />
                  Latest Analysis Result
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        latestResult.status === DiagnosisStatus.COMPLETED
                          ? "bg-green-100 text-green-800"
                          : latestResult.status === DiagnosisStatus.PENDING
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {latestResult.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Prediction:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        latestResult.prediction === "Tuberculosis"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {latestResult.prediction}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">Confidence:</span>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(latestResult.confidenceScore || 0) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((latestResult.confidenceScore || 0) * 100).toFixed(1)}%
                    </p>
                  </div>

                  {latestResult.clinicalFindings && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Clinical Findings:</span>
                      <p className="text-sm text-gray-700 mt-1">{latestResult.clinicalFindings}</p>
                    </div>
                  )}

                  {latestResult.recommendations && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Recommendations:</span>
                      <p className="text-sm text-gray-700 mt-1">{latestResult.recommendations}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium text-gray-600">Analysis Date:</span>
                    <p className="text-sm text-gray-700">
                      {new Date(latestResult.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: X-Ray Images */}
          <div className="space-y-6">
            {/* Original X-Ray */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiImage className="text-purple-600" />
                Original X-Ray
              </h2>

              {patient.xrays && patient.xrays.length > 0 && patient.xrays[0].imageBase64 ? (
                <div className="space-y-4">
                  <img
                    src={base64ToDataUrl(patient.xrays[0].imageBase64, "image/png")}
                    alt="Original X-Ray"
                    className="w-full h-64 object-contain border-2 border-gray-200 rounded-lg  bg-gray-50"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">File: {patient.xrays[0].fileName || "Unknown"}</p>
                    <p className="text-xs">
                      Uploaded: {new Date(patient.xrays[0].createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                  <FiAlertCircle size={32} className="mx-auto text-yellow-600 mb-2" />
                  <p className="text-gray-700 font-medium mb-4">No X-Ray Image Uploaded</p>
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <FiUpload size={24} className="text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Upload X-Ray</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleXrayUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
                </div>
              )}

              {patient.xrays && patient.xrays.length > 0 && !isEditing && (
                <label className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg cursor-pointer hover:bg-emerald-100 transition border-2 border-emerald-200">
                  <FiUpload size={18} />
                  <span className="font-semibold text-sm">Upload Another X-Ray</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleXrayUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* X-Ray Status Card */}
            {patient.xrays && patient.xrays.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-cyan-600">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiFileText className="text-cyan-600" />
                  X-Ray Upload Status
                </h2>

                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="p-4 rounded-lg border-2 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">Upload Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
                          patient.xrays[0].status === XRayStatus.COMPLETED
                            ? "bg-green-100 text-green-800"
                            : patient.xrays[0].status === XRayStatus.PENDING || patient.xrays[0].status === XRayStatus.VALIDATING || patient.xrays[0].status === XRayStatus.PROCESSING
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {patient.xrays[0].status === XRayStatus.COMPLETED && <FiCheck size={16} />}
                        {(patient.xrays[0].status === XRayStatus.PENDING || patient.xrays[0].status === XRayStatus.VALIDATING || patient.xrays[0].status === XRayStatus.PROCESSING) && <FiActivity className="animate-spin" size={16} />}
                        {patient.xrays[0].status === XRayStatus.FAILED && <FiAlertCircle size={16} />}
                        {patient.xrays[0].status.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Validation Status */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">Validation</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          patient.xrays[0].isValid
                            ? "bg-green-100 text-green-800 flex items-center gap-1"
                            : "bg-red-100 text-red-800 flex items-center gap-1"
                        }`}
                      >
                        {patient.xrays[0].isValid ? (
                          <>
                            <FiCheck size={14} /> Valid Image
                          </>
                        ) : (
                          <>
                            <FiX size={14} /> Invalid Image
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* File Details */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <p className="text-xs uppercase text-gray-500 font-semibold">File Name</p>
                      <p className="text-sm font-medium text-gray-800">{patient.xrays[0].fileName || "Unknown"}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-xs uppercase text-gray-500 font-semibold">File Size</p>
                      <p className="text-sm font-medium text-gray-800">
                        {patient.xrays[0].fileSizeBytes
                          ? `${(patient.xrays[0].fileSizeBytes / 1024).toFixed(2)} KB`
                          : "Not available"}
                      </p>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-xs uppercase text-gray-500 font-semibold">Upload Date</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(patient.xrays[0].createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Validation Confidence */}
                  {patient.xrays[0].validationConfidence !== null && patient.xrays[0].validationConfidence !== undefined && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs uppercase text-blue-700 font-semibold mb-2">Validation Confidence</p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(patient.xrays[0].validationConfidence || 0) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-700">
                        {((patient.xrays[0].validationConfidence || 0) * 100).toFixed(1)}% confidence
                      </p>
                    </div>
                  )}

                  {/* Validation Error */}
                  {patient.xrays[0].validationError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs uppercase text-red-700 font-semibold mb-1">Validation Error</p>
                      <p className="text-sm text-red-800">{patient.xrays[0].validationError}</p>
                    </div>
                  )}

                  {/* Resubmit Button - Smart Conditional Logic */}
                  {(patient.xrays[0].status === XRayStatus.FAILED || !patient.xrays[0].isValid) && (
                    <div className="pt-3 border-t border-gray-200">
                      {patient.xrays[0].imageBase64 ? (
                        // Image exists: Show Re-analyze button (green)
                        <button
                          onClick={handleReAnalyzeXray}
                          disabled={resubmitting}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resubmitting ? (
                            <>
                              <FiRotateCw className="animate-spin" size={18} />
                              Re-analyzing...
                            </>
                          ) : (
                            <>
                              <FiRotateCw size={18} />
                              Re-analyze X-Ray
                            </>
                          )}
                        </button>
                      ) : (
                        // No image: Show file upload form
                        <>
                          <div className="mb-4 pb-4 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
                              Upload New X-Ray Image
                            </p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-500 transition">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleResubmitXray}
                                disabled={resubmitting}
                                className="hidden"
                                id="resubmit-file-input"
                              />
                              <label
                                htmlFor="resubmit-file-input"
                                className="cursor-pointer flex flex-col items-center gap-2"
                              >
                                <FiUpload size={24} className="text-orange-400" />
                                <span className="text-sm text-gray-600 font-medium">
                                  Click to select X-ray image
                                </span>
                              </label>
                            </div>
                          </div>

                          <button
                            disabled={resubmitting}
                            onClick={() => {
                              const input = document.getElementById("resubmit-file-input") as HTMLInputElement;
                              if (input?.files?.[0]) {
                                handleResubmitXray({
                                  target: input,
                                } as any);
                              } else {
                                toast.error("Please select a file first");
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {resubmitting ? (
                              <>
                                <FiRotateCw className="animate-spin" size={18} />
                                Uploading & Analyzing...
                              </>
                            ) : (
                              <>
                                <FiUpload size={18} />
                                Resubmit & Analyze
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Success Message */}
                  {patient.xrays[0].status === XRayStatus.COMPLETED && patient.xrays[0].isValid && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                      <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-green-800 text-sm">Upload Successful</p>
                        <p className="text-sm text-green-700 mt-1">
                          X-ray has been successfully uploaded and validated. Proceeding with ML analysis...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TB Positive Treatment Workflow */}
            {latestResult && latestResult.prediction === "Tuberculosis" && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-lg p-6 border-l-4 border-red-600">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAlertCircle className="text-red-600" size={24} />
                  TB Treatment Protocol
                </h2>

                <div className="space-y-4">
                  {/* Alert Box */}
                  <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                    <p className="text-sm font-bold text-red-800">
                      🚨 TB-POSITIVE Diagnosis Confirmed
                    </p>
                    <p className="text-xs text-red-700 mt-2">
                      This patient has tested positive for Tuberculosis with {((latestResult.confidenceScore || 0) * 100).toFixed(1)}% confidence.
                      Immediate medical intervention is recommended.
                    </p>
                  </div>

                  {/* Treatment Steps */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold text-sm">1</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Immediate Notification</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Physician and assigned radiologist have been notified of the positive diagnosis
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold text-sm">2</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Follow-up Appointment</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          An appointment has been scheduled with the physician for further assessment and treatment plan
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold text-sm">3</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Medical Report Generated</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          A comprehensive medical report has been created and is available for the care team
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-600 text-white font-bold text-sm">4</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">Treatment Initiation</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Anti-TB therapy should be initiated as per WHO guidelines. Standard treatment: HRZE for 2 months, then HR for 4 months
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Severity Level */}
                  {latestResult.tbIntensity && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                      <p className="text-xs uppercase text-orange-700 font-semibold mb-1">TB Severity</p>
                      <p className="text-sm font-medium text-orange-900">
                        {latestResult.tbIntensity.charAt(0).toUpperCase() + latestResult.tbIntensity.slice(1).toLowerCase()}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {latestResult.recommendations && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
                      <p className="text-xs uppercase text-gray-600 font-semibold mb-2">Recommendations</p>
                      <p className="text-sm text-gray-700">{latestResult.recommendations}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analyzed X-Ray (Heatmap) */}
            {latestResult && latestResult.heatmapBase64 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiImage className="text-orange-600" />
                  Model Analysis (Heatmap)
                </h2>

                <div className="space-y-4">
                  <img
                    src={base64ToDataUrl(latestResult.heatmapBase64, "image/png")}
                    alt="Analysis Heatmap"
                    className="w-full h-64 object-contain border-2 border-gray-200 rounded-lg bg-gray-50"
                  />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs uppercase text-blue-700 font-semibold mb-1">About This Heatmap</p>
                    <p className="text-sm text-blue-800">
                      This heatmap shows areas of the X-ray that contributed most to the TB detection model's
                      prediction. Warmer colors (red/yellow) indicate higher activation areas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* X-Ray Analysis Timeline */}
            {patient.xrays && patient.xrays.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-600">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiActivity className="text-indigo-600" />
                  X-Ray Analysis Timeline
                </h2>

                <div className="space-y-0">
                  {/* Timeline Container */}
                  <div className="relative">
                    {/* Step 1: Upload */}
                    <div className="flex gap-4 pb-6 relative">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white font-bold z-10">
                          <FiCheck size={20} />
                        </div>
                        <div className="w-1 h-16 bg-green-300 mt-2"></div>
                      </div>
                      <div className="pt-1">
                        <h3 className="font-semibold text-green-800 text-sm">✓ X-Ray Uploaded</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(patient.xrays[0].createdAt).toLocaleDateString("en-US", {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Validation */}
                    <div className="flex gap-4 pb-6 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-full font-bold z-10 ${
                            patient.xrays[0].isValid
                              ? "bg-green-600 text-white"
                              : patient.xrays[0].status === XRayStatus.VALIDATING
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {patient.xrays[0].isValid ? (
                            <FiCheck size={20} />
                          ) : patient.xrays[0].status === XRayStatus.VALIDATING ? (
                            <FiRotateCw size={20} className="animate-spin" />
                          ) : (
                            <FiX size={20} />
                          )}
                        </div>
                        <div
                          className={`w-1 h-16 mt-2 ${
                            patient.xrays[0].isValid
                              ? "bg-green-300"
                              : patient.xrays[0].status === XRayStatus.VALIDATING
                              ? "bg-yellow-300"
                              : "bg-red-300"
                          }`}
                        ></div>
                      </div>
                      <div className="pt-1">
                        <h3
                          className={`font-semibold text-sm ${
                            patient.xrays[0].isValid
                              ? "text-green-800"
                              : patient.xrays[0].status === XRayStatus.VALIDATING
                              ? "text-yellow-800"
                              : "text-red-800"
                          }`}
                        >
                          {patient.xrays[0].isValid ? "✓ Image Validated" : patient.xrays[0].status === XRayStatus.VALIDATING ? "⏳ Validating..." : "✗ Validation Failed"}
                        </h3>
                        {patient.xrays[0].validationConfidence !== undefined && (
                          <p className="text-xs text-gray-600 mt-1">
                            Confidence: {((patient.xrays[0].validationConfidence || 0) * 100).toFixed(1)}%
                          </p>
                        )}
                        {patient.xrays[0].validationError && (
                          <p className="text-xs text-red-600 mt-1">{patient.xrays[0].validationError}</p>
                        )}
                      </div>
                    </div>

                    {/* Step 3: ML Analysis */}
                    <div className="flex gap-4 pb-6 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-full font-bold z-10 ${
                            latestResult && latestResult.status === DiagnosisStatus.COMPLETED
                              ? "bg-green-600 text-white"
                              : latestResult && latestResult.status === DiagnosisStatus.PENDING
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {latestResult && latestResult.status === DiagnosisStatus.COMPLETED ? (
                            <FiCheck size={20} />
                          ) : latestResult && latestResult.status === DiagnosisStatus.PENDING ? (
                            <FiRotateCw size={20} className="animate-spin" />
                          ) : (
                            "3"
                          )}
                        </div>
                        <div
                          className={`w-1 h-16 mt-2 ${
                            latestResult && latestResult.status === DiagnosisStatus.COMPLETED
                              ? "bg-green-300"
                              : latestResult && latestResult.status === DiagnosisStatus.PENDING
                              ? "bg-yellow-300"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                      <div className="pt-1">
                        <h3
                          className={`font-semibold text-sm ${
                            latestResult && latestResult.status === DiagnosisStatus.COMPLETED
                              ? "text-green-800"
                              : latestResult && latestResult.status === DiagnosisStatus.PENDING
                              ? "text-yellow-800"
                              : "text-gray-700"
                          }`}
                        >
                          {latestResult && latestResult.status === DiagnosisStatus.COMPLETED
                            ? "✓ Analysis Complete"
                            : latestResult && latestResult.status === DiagnosisStatus.PENDING
                            ? "⏳ Analyzing..."
                            : "⧖ Pending Analysis"}
                        </h3>
                        {latestResult && (
                          <p className="text-xs text-gray-600 mt-1">
                            {latestResult.processingTimeMs
                              ? `Completed in ${latestResult.processingTimeMs}ms`
                              : "Awaiting analysis"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Step 4: Results */}
                    <div className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-full font-bold z-10 ${
                            latestResult && latestResult.prediction
                              ? "bg-green-600 text-white"
                              : "bg-gray-400 text-white"
                          }`}
                        >
                          {latestResult && latestResult.prediction ? <FiCheck size={20} /> : "4"}
                        </div>
                      </div>
                      <div className="pt-1">
                        <h3
                          className={`font-semibold text-sm ${
                            latestResult && latestResult.prediction ? "text-green-800" : "text-gray-700"
                          }`}
                        >
                          {latestResult && latestResult.prediction ? "✓ Results Available" : "⧖ Awaiting Results"}
                        </h3>
                        {latestResult && latestResult.prediction === "Tuberculosis" && (
                          <p className="text-xs text-red-600 font-semibold mt-1">🔴 TB POSITIVE</p>
                        )}
                        {latestResult && latestResult.prediction === "Normal" && (
                          <p className="text-xs text-green-600 font-semibold mt-1">🟢 TB NEGATIVE</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnosis Status Card */}
            {patient.xrays && patient.xrays.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-violet-600">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiActivity className="text-violet-600" />
                  Analysis Details
                </h2>

                <div className="space-y-4">
                  {/* Current Analysis Status */}
                  {latestResult ? (
                    <>
                      <div className="p-4 rounded-lg border-2 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-gray-700">Analysis Status</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
                              latestResult.status === DiagnosisStatus.COMPLETED
                                ? "bg-green-100 text-green-800"
                                : latestResult.status === DiagnosisStatus.PENDING
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {latestResult.status === DiagnosisStatus.COMPLETED && <FiCheck size={16} />}
                            {latestResult.status === DiagnosisStatus.PENDING && <FiActivity className="animate-spin" size={16} />}
                            {latestResult.status === DiagnosisStatus.FAILED && <FiAlertCircle size={16} />}
                            {latestResult.status.toUpperCase()}
                          </span>
                        </div>

                        {latestResult.status === DiagnosisStatus.COMPLETED && (
                          <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">
                            ✓ Analysis completed successfully on{" "}
                            {new Date(latestResult.createdAt).toLocaleDateString("en-US")}
                          </div>
                        )}

                        {latestResult.status === DiagnosisStatus.PENDING && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                            ⏳ Analysis is in progress. Please refresh to see updates...
                          </div>
                        )}

                        {latestResult.status === DiagnosisStatus.FAILED && (
                          <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">
                            ❌ Analysis failed. Please resubmit the X-ray above to retry.
                            {latestResult.clinicalFindings && (
                              <p className="mt-2 font-semibold">Error: {latestResult.clinicalFindings}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Analysis Confidence */}
                      {latestResult.status === DiagnosisStatus.COMPLETED && (
                        <>
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 space-y-3">
                            <div>
                              <p className="text-xs uppercase text-indigo-700 font-semibold mb-2">Prediction</p>
                              <p
                                className={`text-lg font-bold ${
                                  latestResult.prediction === "Tuberculosis"
                                    ? "text-red-700"
                                    : "text-green-700"
                                }`}
                              >
                                {latestResult.prediction === "Tuberculosis"
                                  ? "🔴 TB Positive"
                                  : "🟢 TB Negative"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase text-indigo-700 font-semibold mb-2">
                                Confidence Score
                              </p>
                              <div className="w-full bg-indigo-200 rounded-full h-3 mb-1">
                                <div
                                  className={`h-3 rounded-full transition-all duration-300 ${
                                    latestResult.prediction === "Tuberculosis"
                                      ? "bg-gradient-to-r from-red-600 to-red-400"
                                      : "bg-gradient-to-r from-green-600 to-green-400"
                                  }`}
                                  style={{
                                    width: `${(latestResult.confidenceScore || 0) * 100}%`,
                                  }}
                                />
                              </div>
                              <p className="text-sm text-indigo-700 font-semibold">
                                {((latestResult.confidenceScore || 0) * 100).toFixed(1)}% Confidence
                              </p>
                            </div>
                          </div>

                          {/* Clinical Findings */}
                          {latestResult.clinicalFindings && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <p className="text-xs uppercase text-amber-700 font-semibold mb-2">Clinical Findings</p>
                              <p className="text-sm text-amber-800">{latestResult.clinicalFindings}</p>
                            </div>
                          )}

                          {/* Recommendations */}
                          {latestResult.recommendations && (
                            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                              <p className="text-xs uppercase text-teal-700 font-semibold mb-2">Recommendations</p>
                              <p className="text-sm text-teal-800">{latestResult.recommendations}</p>
                            </div>
                          )}

                          {/* Heatmap Available */}
                          {latestResult.heatmapBase64 && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-start gap-3">
                              <FiCheck className="text-purple-600 flex-shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="font-semibold text-purple-800 text-sm">Heatmap Available</p>
                                <p className="text-xs text-purple-700 mt-1">
                                  View the model analysis heatmap above to see the areas that influenced this diagnosis.
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Resubmit on Failed Analysis - PROMINENT BUTTON */}
                      {latestResult.status === DiagnosisStatus.FAILED && (
                        <div className="pt-4 border-t-2 border-red-300 mt-4">
                          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                            <p className="text-sm font-bold text-red-800 mb-2">⚠️ Analysis Failed</p>
                            <p className="text-xs text-red-700">
                              The ML model analysis did not complete successfully. Please resubmit the image to retry the analysis.
                            </p>
                          </div>
                          {patient.xrays && patient.xrays[0]?.imageBase64 ? (
                            <button
                              onClick={handleReAnalyzeXray}
                              disabled={resubmitting}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                              {resubmitting ? (
                                <>
                                  <FiRotateCw className="animate-spin" size={18} />
                                  Re-analyzing...
                                </>
                              ) : (
                                <>
                                  <FiRotateCw size={18} />
                                  Re-analyze X-Ray
                                </>
                              )}
                            </button>
                          ) : (
                            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition font-semibold text-sm shadow-md">
                              <FiRotateCw size={18} />
                              <span>{resubmitting ? "Resubmitting..." : "Resubmit New X-Ray"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleResubmitXray}
                                disabled={resubmitting || uploading}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                      <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-yellow-800 text-sm">Awaiting Analysis</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          The ML model is processing your uploaded X-ray. Please refresh the page to see the analysis
                          results once they are available.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Analysis Yet */}
            {!latestResult && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiImage className="text-gray-400" />
                  Model Analysis (Pending)
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-yellow-800 text-sm">Analysis Not Yet Completed</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The ML model has not yet analyzed the uploaded X-ray image. Please wait for the analysis to
                      complete, or ensure a valid medical X-ray image has been uploaded.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsPage;
