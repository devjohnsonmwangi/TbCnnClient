import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FiArrowLeft, FiUpload, FiArrowRight, FiCheck, FiX, FiInbox, FiRotateCw,
  FiCheckCircle, FiAlertCircle, FiSearch
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuthContext";
import { PatientsService } from "../services/patientsService";
import { ResultsService } from "../services/resultsService";
import { PatientResponseDto, DiseaseType } from "../types/api.types";
import { fileToBase64, isValidBase64 } from "../utils/imageUtils";

interface MissingXRayPatient extends PatientResponseDto {
  hasXray: boolean;
}

interface PatientEditState {
  [patientId: string]: PatientResponseDto;
}

interface FileUploadState {
  [patientId: string]: File | null;
}

const MissingXraysManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientsService = new PatientsService();
  const resultsService = new ResultsService();

  const [patients, setPatients] = useState<MissingXRayPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPatientsIds, setEditingPatientsIds] = useState<Set<string>>(new Set());
  const [editingData, setEditingData] = useState<PatientEditState>({});
  const [uploadingPatients, setUploadingPatients] = useState<Set<string>>(new Set());
  const [fileUploads, setFileUploads] = useState<FileUploadState>({});

  // Load patients missing X-rays
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const allPatients = await patientsService.getAllPatients().catch(() => []);
        
        // Filter to only physician's patients without X-rays
        const missingXrayPatients = allPatients.filter(
          (p) => p.physicianId === user.id && (!p.xrays || p.xrays.length === 0)
        );

        setPatients(missingXrayPatients.map(p => ({ ...p, hasXray: false })));
      } catch (error) {
        console.error("Failed to load patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Filter patients based on search
  const filteredPatients = patients.filter((p) =>
    !searchTerm ||
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle edit mode for a patient
  const toggleEditMode = (patientId: string) => {
    const newEditingIds = new Set(editingPatientsIds);
    if (newEditingIds.has(patientId)) {
      newEditingIds.delete(patientId);
      // Clear editing data
      const newEditingData = { ...editingData };
      delete newEditingData[patientId];
      setEditingData(newEditingData);
    } else {
      newEditingIds.add(patientId);
      // Initialize editing data with current patient data
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setEditingData({ ...editingData, [patientId]: patient });
      }
    }
    setEditingPatientsIds(newEditingIds);
  };

  // Update editing data
  const updatePatientEditData = (patientId: string, field: string, value: string) => {
    setEditingData({
      ...editingData,
      [patientId]: {
        ...editingData[patientId],
        [field]: value
      }
    });
  };

  // Save patient details
  const savePatientDetails = async (patientId: string) => {
    try {
      const updatedData = editingData[patientId];
      if (!updatedData) return;

      // Update patient details
      await patientsService.updatePatient(patientId, {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
        address: updatedData.address || undefined,
        medicalHistory: updatedData.medicalHistory || undefined,
        allergies: updatedData.allergies || undefined,
      });

      // Update local state
      setPatients(patients.map(p =>
        p.id === patientId ? { ...updatedData, hasXray: false } : p
      ));

      // Exit edit mode
      const newEditingIds = new Set(editingPatientsIds);
      newEditingIds.delete(patientId);
      setEditingPatientsIds(newEditingIds);

      toast.success("Patient details updated successfully");
    } catch (error) {
      console.error("Failed to save patient details:", error);
      toast.error("Failed to save patient details");
    }
  };

  // Handle X-ray file selection
  const handleFileChange = (patientId: string, file: File | null) => {
    setFileUploads({ ...fileUploads, [patientId]: file });
  };

  // Upload and analyze X-ray for a patient
  const handleUploadXray = async (patientId: string) => {
    const file = fileUploads[patientId];
    if (!file) {
      toast.error("Please select an X-ray image");
      return;
    }

    try {
      setUploadingPatients(new Set([...uploadingPatients, patientId]));
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const toastId = toast.loading("📤 Uploading X-ray and analyzing...");
          
          // Call resubmitXray which sends base64 to model for analysis
          const result = await patientsService.resubmitXray(patientId, base64);
          
          toast.dismiss(toastId);
          toast.success("✅ X-ray analyzed successfully. Results available in patient details.");
          
          // Update patient state and remove from missing list
          setPatients(patients.filter(p => p.id !== patientId));
          
          // Clear file upload
          const newFileUploads = { ...fileUploads };
          delete newFileUploads[patientId];
          setFileUploads(newFileUploads);

        } catch (error) {
          console.error("Analysis failed:", error);
          const errorMsg = error instanceof Error ? error.message : "Failed to analyze X-ray";
          toast.error(`❌ Analysis failed: ${errorMsg}`);
        } finally {
          const newUploadingPatients = new Set(uploadingPatients);
          newUploadingPatients.delete(patientId);
          setUploadingPatients(newUploadingPatients);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload preparation failed:", error);
      toast.error("Failed to upload X-ray");
      const newUploadingPatients = new Set(uploadingPatients);
      newUploadingPatients.delete(patientId);
      setUploadingPatients(newUploadingPatients);
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <FiInbox className="text-5xl text-gray-300" />
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900">No Patients with Missing X-Rays</p>
        <p className="text-sm text-gray-600 mt-1">All your patients have X-ray images uploaded</p>
      </div>
    </div>
  );

  const isEditing = (patientId: string) => editingPatientsIds.has(patientId);
  const isUploading = (patientId: string) => uploadingPatients.has(patientId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 sm:py-8 md:py-10 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/physician-dashboard")}
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 mb-4 transition"
          >
            <FiArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  Pending X-Rays
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-600 mb-1 sm:mb-2 leading-tight">
                Manage Missing X-Ray Uploads
              </h1>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium hidden sm:block">
                Upload X-ray images and update patient details before diagnosis submission
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full space-y-4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Patients Table/Cards */}
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 bg-white rounded-lg shadow-md">
              <FiRotateCw className="text-2xl text-emerald-600 animate-spin" />
              <p className="text-gray-600">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-100">
              <div className="bg-gradient-to-r from-red-50 to-red-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiUpload className="text-red-600" /> Patients Pending X-Ray Upload
                </h2>
              </div>
              <EmptyState />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-red-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FiUpload className="text-red-600" /> Patients Pending X-Ray Upload ({filteredPatients.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="p-4 hover:bg-gray-50 transition">
                    {isEditing(patient.id) ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`firstName-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                            <input
                              id={`firstName-${patient.id}`}
                              type="text"
                              value={editingData[patient.id]?.firstName || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "firstName", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`lastName-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                            <input
                              id={`lastName-${patient.id}`}
                              type="text"
                              value={editingData[patient.id]?.lastName || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "lastName", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`email-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                            <input
                              id={`email-${patient.id}`}
                              type="email"
                              value={editingData[patient.id]?.email || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "email", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`phone-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input
                              id={`phone-${patient.id}`}
                              type="tel"
                              value={editingData[patient.id]?.phone || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "phone", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`dateOfBirth-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                            <input
                              id={`dateOfBirth-${patient.id}`}
                              type="date"
                              value={editingData[patient.id]?.dateOfBirth || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "dateOfBirth", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label htmlFor={`gender-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                            <select
                              id={`gender-${patient.id}`}
                              value={editingData[patient.id]?.gender || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "gender", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor={`address-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                            <input
                              id={`address-${patient.id}`}
                              type="text"
                              value={editingData[patient.id]?.address || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "address", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor={`medicalHistory-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Medical History</label>
                            <textarea
                              id={`medicalHistory-${patient.id}`}
                              value={editingData[patient.id]?.medicalHistory || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "medicalHistory", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor={`allergies-${patient.id}`} className="block text-xs font-semibold text-gray-700 mb-1">Allergies</label>
                            <textarea
                              id={`allergies-${patient.id}`}
                              value={editingData[patient.id]?.allergies || ""}
                              onChange={(e) => updatePatientEditData(patient.id, "allergies", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => toggleEditMode(patient.id)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => savePatientDetails(patient.id)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium flex items-center gap-2"
                          >
                            <FiCheck size={16} />
                            Save Details
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{patient.firstName} {patient.lastName}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{patient.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Phone</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{patient.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Date of Birth</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Gender</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{patient.gender}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Address</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{patient.address || "N/A"}</p>
                          </div>
                          {patient.medicalHistory && (
                            <div className="md:col-span-3">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Medical History</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{patient.medicalHistory}</p>
                            </div>
                          )}
                          {patient.allergies && (
                            <div className="md:col-span-3">
                              <p className="text-xs font-semibold text-gray-600 uppercase">Allergies</p>
                              <p className="text-sm font-medium text-gray-900 mt-1">{patient.allergies}</p>
                            </div>
                          )}
                        </div>

                        {/* X-Ray Upload Section */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-xs font-semibold text-red-700 uppercase mb-3">X-Ray Image Upload</p>
                          <div className="border-2 border-dashed border-red-300 rounded-lg p-4 text-center hover:border-red-500 transition">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(patient.id, e.target.files?.[0] || null)}
                              disabled={isUploading(patient.id)}
                              className="hidden"
                              id={`xray-file-${patient.id}`}
                            />
                            <label htmlFor={`xray-file-${patient.id}`} className="cursor-pointer flex flex-col items-center gap-2">
                              <FiUpload size={24} className="text-red-400" />
                              <span className="text-sm text-red-600 font-medium">
                                {fileUploads[patient.id]?.name || "Click to select X-ray image"}
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleEditMode(patient.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs sm:text-sm font-medium"
                          >
                            <FiArrowRight size={16} />
                            Edit Details
                          </button>
                          <button
                            onClick={() => handleUploadXray(patient.id)}
                            disabled={!fileUploads[patient.id] || isUploading(patient.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploading(patient.id) ? (
                              <>
                                <FiRotateCw className="animate-spin" size={16} />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <FiUpload size={16} />
                                Resubmit & Analyze
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingXraysManagementPage;
