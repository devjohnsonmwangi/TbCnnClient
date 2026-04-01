import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FiSearch, FiFilter, FiDownload, FiEye, FiTrendingUp, FiUsers, FiCheckCircle,
  FiAlertCircle, FiRotateCw, FiPlus, FiInbox, FiUpload, FiBarChart2, FiActivity,
  FiZap, FiFileText, FiX
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuthContext";
import { PatientsService } from "../services/patientsService";
import { ResultsService } from "../services/resultsService";
import { PatientResponseDto, DiagnosisResultResponseDto, DiagnosisStatus } from "../types/api.types";
import { DiagnosisModal } from "../components/DiagnosisModal";
import { PatientDetailsModal } from "../components/PatientDetailsModal";
import { ResultDetailsModal } from "../components/ResultDetailsModal";

interface IDashboardPatient extends PatientResponseDto {
  hasXray: boolean;
  xrayStatus?: string;
  analysisStatus?: string;
}

function PhysicianDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const patientsService = new PatientsService();
  const resultsService = new ResultsService();

  const [patients, setPatients] = useState<IDashboardPatient[]>([]);
  const [results, setResults] = useState<DiagnosisResultResponseDto[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<IDashboardPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "failed">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  
  // Detail modals state
  const [selectedPatient, setSelectedPatient] = useState<PatientResponseDto | null>(null);
  const [selectedResult, setSelectedResult] = useState<DiagnosisResultResponseDto | null>(null);

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentDateTime(`${dateStr} | ${timeStr}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const [allPatients, allResults] = await Promise.all([
          patientsService.getAllPatients().catch(() => []),
          resultsService.getAllResults().catch(() => []),
        ]);

        // Filter data to only include physician's own records
        const physicianPatients = allPatients.filter((p) => p.physicianId === user.id);
        const physicianResults = allResults.filter((r) =>
          physicianPatients.some((p) => p.id === r.patientId)
        );

        // Enrich patients with X-ray status
        const enrichedPatients = physicianPatients.map((patient) => ({
          ...patient,
          hasXray: !!(patient.xrays && patient.xrays.length > 0),
          xrayStatus: patient.xrays?.[0]?.status || "pending",
          analysisStatus: physicianResults.find((r) => r.patientId === patient.id)?.status || "pending",
        }));

        setPatients(enrichedPatients);
        setFilteredPatients(enrichedPatients);
        setResults(physicianResults);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Filter patients when search or status filter changes
  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || patient.analysisStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredPatients(filtered);
  }, [searchTerm, filterStatus, patients]);

  // Analytics calculations
  const stats = {
    totalPatients: patients.length,
    completed: results.filter((r) => r.status === DiagnosisStatus.COMPLETED).length,
    pending: results.filter((r) => r.status === DiagnosisStatus.PENDING).length,
    failed: results.filter((r) => r.status === DiagnosisStatus.FAILED).length,
    missingXrays: patients.filter((p) => !p.hasXray).length,
    positiveResults: results.filter((r) => r.status === DiagnosisStatus.COMPLETED && r.diseaseType).length,
    totalAnalyses: results.length,
    avgConfidence:
      results.length > 0
        ? ((results.reduce((sum, r) => sum + (r.confidenceScore || 0), 0) / results.length) * 100).toFixed(1)
        : 0,
  };

  const getDemographics = () => {
    const male = patients.filter((p) => p.gender === "Male").length;
    const female = patients.filter((p) => p.gender === "Female").length;
    const other = patients.filter((p) => p.gender === "Other").length;
    return { male, female, other };
  };

  const getTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const count = results.filter(
        (r) => new Date(r.createdAt).toLocaleDateString("en-US") === date.toLocaleDateString("en-US")
      ).length;
      return { date: dateStr, count };
    });
    return last7Days.reverse();
  };

  const getRecentActivity = () => {
    return results
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  };

  const getStatusDistribution = () => {
    return {
      completed: results.filter((r) => r.status === DiagnosisStatus.COMPLETED).length,
      pending: results.filter((r) => r.status === DiagnosisStatus.PENDING).length,
      failed: results.filter((r) => r.status === DiagnosisStatus.FAILED).length,
    };
  };


  const getStatusColor = (status?: string) => {
    switch (status) {
      case DiagnosisStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case DiagnosisStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case DiagnosisStatus.FAILED:
        return "bg-red-100 text-red-800";
      case DiagnosisStatus.UPDATED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case DiagnosisStatus.PENDING:
        return <FiAlertCircle className="text-yellow-600" />;
      case DiagnosisStatus.COMPLETED:
        return <FiCheckCircle className="text-green-600" />;
      case DiagnosisStatus.FAILED:
        return <FiAlertCircle className="text-red-600" />;
      case DiagnosisStatus.UPDATED:
        return <FiCheckCircle className="text-blue-600" />;
      default:
        return <FiAlertCircle className="text-gray-600" />;
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [allPatients, allResults] = await Promise.all([
        patientsService.getAllPatients().catch(() => []),
        resultsService.getAllResults().catch(() => []),
      ]);

      if (user?.id) {
        const physicianPatients = allPatients.filter((p) => p.physicianId === user.id);
        const physicianResults = allResults.filter((r) =>
          physicianPatients.some((p) => p.id === r.patientId)
        );

        const enrichedPatients = physicianPatients.map((patient) => ({
          ...patient,
          hasXray: !!(patient.xrays && patient.xrays.length > 0),
          xrayStatus: patient.xrays?.[0]?.status || "pending",
          analysisStatus: physicianResults.find((r) => r.patientId === patient.id)?.status || "pending",
        }));

        setPatients(enrichedPatients);
        setFilteredPatients(enrichedPatients);
        setResults(physicianResults);
      }
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Empty state component
  const EmptyState = ({ title, message }: { title: string; message: string }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <FiInbox className="text-5xl text-gray-300" />
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Premium Header */}
      <div className="px-4 py-6 sm:py-8 md:py-10 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  Your Patients
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 mb-1 sm:mb-2 leading-tight">
                Physician Dashboard
              </h1>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium hidden sm:block">
                Patient management and diagnostic analytics
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 flex-1 md:flex-initial justify-center md:justify-start px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold text-xs sm:text-sm"
              >
                <FiPlus size={18} />
                <span>Start Diagnosis</span>
              </button>
              <button
                title="Refresh data"
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 sm:p-3 bg-white rounded-lg shadow hover:shadow-lg transition disabled:opacity-50"
              >
                <FiRotateCw className={loading ? "animate-spin" : ""} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Physician Info Floating Card */}
      <div className="px-4 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-white/90 text-xs sm:text-sm font-medium">Welcome,</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Dr. {user?.firstName} {user?.lastName}
                </h2>
              </div>
              <div className="text-white/80 text-xs sm:text-sm font-medium text-left sm:text-right whitespace-nowrap">
                <p>{currentDateTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="px-4 py-3 border-b border-emerald-100 bg-white flex-shrink-0 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-sm border border-emerald-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">Patients</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1">{stats.totalPatients}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-blue-700 text-xs font-semibold uppercase tracking-wide">Analyses</p>
              <p className="text-3xl sm:text-4xl font-black text-blue-600 mt-1">{stats.totalAnalyses}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-sm border border-green-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-green-700 text-xs font-semibold uppercase tracking-wide">Completed</p>
              <p className="text-3xl sm:text-4xl font-black text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-sm border border-yellow-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-yellow-700 text-xs font-semibold uppercase tracking-wide">Pending</p>
              <p className="text-3xl sm:text-4xl font-black text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <button
              onClick={() => navigate("/missing-xrays")}
              className="w-full bg-gradient-to-br from-red-50 to-white rounded-lg shadow-sm border border-red-100 p-3 sm:p-4 hover:shadow-lg hover:border-red-300 transition-all text-left"
            >
              <p className="text-red-700 text-xs font-semibold uppercase tracking-wide">Missing X-rays</p>
              <p className="text-3xl sm:text-4xl font-black text-red-600 mt-1">{stats.missingXrays}</p>
            </button>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-sm border border-purple-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-purple-700 text-xs font-semibold uppercase tracking-wide">Avg Confidence</p>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 mt-1">{stats.avgConfidence}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full space-y-4">

          {/* SECTION 1: Missing X-Rays Alert */}
          {stats.missingXrays > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg shadow-md p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <FiUpload className="text-red-600 text-2xl sm:text-3xl flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-red-900 mb-2">
                    {stats.missingXrays} Patient{stats.missingXrays !== 1 ? "s" : ""} Awaiting X-Ray Upload
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    These patients have been registered but X-ray images are still pending. Upload images to process their diagnoses.
                  </p>
                  <button
                    onClick={() => navigate("/missing-xrays")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold"
                  >
                    <FiUpload size={18} />
                    Manage X-Ray Uploads
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Search & Filter */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <FiFilter className="text-gray-400" />
                <select
                  aria-label="Filter by analysis status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value={DiagnosisStatus.PENDING}>Pending</option>
                  <option value={DiagnosisStatus.COMPLETED}>Completed</option>
                  <option value={DiagnosisStatus.FAILED}>Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Patient Registry Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-emerald-600" /> Patient Registry
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Your registered patients and their status</p>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center gap-3 py-12">
                  <FiRotateCw className="text-2xl text-emerald-600 animate-spin" />
                  <p className="text-gray-600">Loading patients...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <EmptyState title="No Patients Found" message="No patients match your search criteria" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Name</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Email</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Gender</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">X-Ray</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Analysis</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600">{patient.email}</td>
                          <td className="px-3 py-2 text-sm text-center text-gray-600">{patient.gender}</td>
                          <td className="px-3 py-2 text-sm text-center">
                            {patient.hasXray ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                <FiCheckCircle size={14} /> Uploaded
                              </span>
                            ) : (
                              <button
                                onClick={() => navigate("/missing-xrays")}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold hover:bg-red-200 transition"
                              >
                                <FiUpload size={14} /> Upload
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.analysisStatus)}`}>
                              {getStatusIcon(patient.analysisStatus)}
                              {patient.analysisStatus || "Pending"}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-sm">
                            <button
                              onClick={() => setSelectedPatient(patient)}
                              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-xs sm:text-sm"
                            >
                              <FiEye size={14} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Results & Reports Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-blue-600" /> Analysis Results
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Diagnosis reports and findings</p>
            </div>
            <div className="p-4">
              {results.length === 0 ? (
                <EmptyState title="No Results Yet" message="Diagnoses will appear here once processed" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Patient</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Date</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Status</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Confidence</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((result) => {
                        const patient = patients.find((p) => p.id === result.patientId);
                        return (
                          <tr key={result.id} className="hover:bg-gray-50 transition">
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">
                              {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-600 text-center">
                              {new Date(result.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 text-sm text-center">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(result.status)}`}>
                                {getStatusIcon(result.status)}
                                {result.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-sm text-center text-gray-600">
                              {result.confidenceScore ? (result.confidenceScore * 100).toFixed(1) + "%" : "—"}
                            </td>
                            <td className="px-3 py-2 text-sm">
                              <button
                                onClick={() => setSelectedResult(result)}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-xs sm:text-sm"
                              >
                                <FiEye size={14} /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 5: 7-Day Diagnostic Trends */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiTrendingUp className="text-purple-600" /> 7-Day Diagnostic Trends
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Analyses completed over the last week</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {getTrendData().map((day, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium text-gray-600">{day.date}</div>
                    <div className="flex-1">
                      <div className="h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" style={{ width: `${(day.count / Math.max(...getTrendData().map(d => d.count), 1)) * 100}%` }}></div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 w-8 text-right">{day.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 6: Analysis Status Distribution */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiBarChart2 className="text-cyan-600" /> Status Distribution
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Breakdown of diagnosis statuses</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-3xl font-bold text-green-600">{getStatusDistribution().completed}</p>
                  <p className="text-xs text-green-700 font-semibold mt-1">Completed</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-3xl font-bold text-yellow-600">{getStatusDistribution().pending}</p>
                  <p className="text-xs text-yellow-700 font-semibold mt-1">Pending</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-3xl font-bold text-red-600">{getStatusDistribution().failed}</p>
                  <p className="text-xs text-red-700 font-semibold mt-1">Failed</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: Patient Demographics */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-orange-600" /> Patient Demographics
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Gender distribution of registered patients</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-3xl font-bold text-blue-600">{getDemographics().male}</p>
                  <p className="text-xs text-blue-700 font-semibold mt-1">Male</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <p className="text-3xl font-bold text-pink-600">{getDemographics().female}</p>
                  <p className="text-xs text-pink-700 font-semibold mt-1">Female</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-3xl font-bold text-gray-600">{getDemographics().other}</p>
                  <p className="text-xs text-gray-700 font-semibold mt-1">Other</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: Recent Activity */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiActivity className="text-indigo-600" /> Recent Activity
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Latest diagnostic submissions</p>
            </div>
            <div className="p-4">
              {getRecentActivity().length === 0 ? (
                <EmptyState title="No Activity Yet" message="Recent activities will appear here" />
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getRecentActivity().map((activity) => {
                    const patient = patients.find((p) => p.id === activity.patientId);
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0">{getStatusIcon(activity.status)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown"}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {activity.status === DiagnosisStatus.COMPLETED && `Diagnosis completed - ${(activity.confidenceScore! * 100).toFixed(1)}% confidence`}
                            {activity.status === DiagnosisStatus.PENDING && "Awaiting diagnosis processing"}
                            {activity.status === DiagnosisStatus.FAILED && "Diagnosis processing failed"}
                            {activity.status === DiagnosisStatus.UPDATED && "Diagnosis updated"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <DiagnosisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRefresh}
      />
      
      {selectedPatient && (
        <PatientDetailsModal
          isOpen={!!selectedPatient}
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {selectedResult && (
        <ResultDetailsModal
          isOpen={!!selectedResult}
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
}

export default PhysicianDashboard;
