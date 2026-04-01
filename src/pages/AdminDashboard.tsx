import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiSearch, FiFilter, FiDownload, FiEye, FiTrash2, FiTrendingUp, FiUsers, FiCheckCircle, FiAlertCircle, FiRotateCw, FiPlus, FiInbox, FiZap, FiActivity, FiBarChart2, FiAward, FiFileText } from "react-icons/fi";
import { PatientsService } from "../services/patientsService";
import { ResultsService } from "../services/resultsService";
import { UsersService } from "../services/usersService";
import { LogsService, SystemLog } from "../services/logsService";
import { PatientResponseDto, DiagnosisResultResponseDto, UserResponseDto, DiagnosisStatus } from "../types/api.types";
import { DiagnosisModal } from "../components/DiagnosisModal";
// PatientDetailsModal replaced with PatientDetailsPage navigation
import { ResultDetailsModal } from "../components/ResultDetailsModal";
import { useAuth } from "../hooks/useAuthContext";

interface PhysicianWithPatients {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  patientCount: number;
  analysisCount: number;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const patientsService = new PatientsService();
  const resultsService = new ResultsService();
  const usersService = new UsersService();
  const { accessToken } = useAuth();

  const [patients, setPatients] = useState<PatientResponseDto[]>([]);
  const [results, setResults] = useState<DiagnosisResultResponseDto[]>([]);
  const [physicians, setPhysicians] = useState<PhysicianWithPatients[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<"all" | "positive" | "negative" | "pending">("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // System Logs State
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsPage, setLogsPage] = useState(0);
  const [logsLimit] = useState(10);
  const [logsFilter, setLogsFilter] = useState<string>("all");
  
  // Detail modals state
  const [selectedResult, setSelectedResult] = useState<DiagnosisResultResponseDto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [patientsData, resultsData, physiciansData] = await Promise.all([
          patientsService.getAllPatients().catch(() => []),
          resultsService.getAllResults().catch(() => []),
          fetchPhysicians().catch(() => []),
        ]);

        setPatients(patientsData || []);
        setResults(resultsData || []);
        setPhysicians(physiciansData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    loadSystemLogs();
  }, [accessToken]);

  const fetchPhysicians = async (): Promise<PhysicianWithPatients[]> => {
    try {
      const users = await usersService.getAllUsers();
      const patientsData = await patientsService.getAllPatients().catch(() => []);
      const resultsData = await resultsService.getAllResults().catch(() => []);

      // Filter for physicians and radiologists
      const physicianUsers = users.filter(
        (u) =>
          u.role === "PHYSICIAN" ||
          u.role === "RADIOLOGIST" ||
          u.role === "SUPER_ADMIN" ||
          u.role === "ADMIN"
      );

      // Calculate patient and analysis counts for each physician
      return physicianUsers.map((physician) => {
        const physicianPatients = patientsData?.filter(
          (p) => p.physicianId === physician.id
        ) || [];
        const physicianResults = resultsData?.filter((r) =>
          physicianPatients.some((p) => p.id === r.patientId)
        ) || [];

        return {
          id: physician.id,
          firstName: physician.firstName || "Unknown",
          lastName: physician.lastName || "",
          email: physician.email || "",
          role: physician.role || "USER",
          patientCount: physicianPatients.length,
          analysisCount: physicianResults.length,
        };
      });
    } catch (error) {
      console.error("Failed to fetch physicians:", error);
      return [];
    }
  };

  const loadSystemLogs = async () => {
    try {
      setLogsLoading(true);
      const logsService = new LogsService();
      const logsData = await logsService.getLogs({
        limit: logsLimit,
        offset: logsPage * logsLimit,
      });
      setSystemLogs(logsData.data || []);
    } catch (error) {
      console.error("Failed to load system logs:", error);
      toast.error("Failed to load system logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const stats = {
    totalPatients: patients.length,
    totalResults: results.length,
    positiveResults: results.filter((r) => r.prediction === "POSITIVE").length,
    pendingResults: results.filter((r) => r.status === DiagnosisStatus.PENDING).length,
    totalPhysicians: physicians.length,
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [patientsData, resultsData, physiciansData] = await Promise.all([
        patientsService.getAllPatients(),
        resultsService.getAllResults(),
        fetchPhysicians(),
      ]);

      setPatients(patientsData || []);
      setResults(resultsData || []);
      setPhysicians(physiciansData);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      !searchTerm ||
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = results.filter((r) => {
    if (filterResult === 'all') return true;
    if (filterResult === 'positive') return r.prediction === 'POSITIVE';
    if (filterResult === 'negative') return r.prediction === 'NEGATIVE';
    if (filterResult === 'pending') return r.status === DiagnosisStatus.PENDING;
    return true;
  });

  // New Analytics Calculations
  const getTopPhysicians = () => {
    return [...physicians].sort((a, b) => b.analysisCount - a.analysisCount).slice(0, 5);
  };

  const getDemographics = () => {
    const male = patients.filter(p => p.gender === 'Male').length;
    const female = patients.filter(p => p.gender === 'Female').length;
    const other = patients.filter(p => p.gender === 'Other').length;
    return { male, female, other };
  };

  const getTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const count = results.filter(r => 
        new Date(r.createdAt).toLocaleDateString('en-US') === new Date(date).toLocaleDateString('en-US')
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

  const getSystemMetrics = () => {
    const completionRate = stats.totalResults > 0 
      ? ((results.filter(r => r.status === DiagnosisStatus.COMPLETED).length / stats.totalResults) * 100).toFixed(1)
      : 0;
    const positiveRate = stats.totalResults > 0
      ? ((stats.positiveResults / stats.totalResults) * 100).toFixed(1)
      : 0;
    const avgConfidence = stats.totalResults > 0
      ? ((results.reduce((sum, r) => sum + (r.confidenceScore || 0), 0) / stats.totalResults) * 100).toFixed(1)
      : 0;
    
    return { completionRate, positiveRate, avgConfidence };
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

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      debug: "bg-gray-100 text-gray-700",
      info: "bg-blue-100 text-blue-700",
      warn: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700",
      critical: "bg-red-200 text-red-900",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      database: "Database",
      api: "API",
      cache: "Cache",
      storage: "Storage",
      user_management: "User Management",
      patient_management: "Patient Management",
      xray_processing: "X-ray Processing",
      ml_inference: "ML Inference",
      diagnosis: "Diagnosis",
      security: "Security",
      audit: "Audit",
      data_privacy: "Data Privacy",
      performance: "Performance",
      health_check: "Health Check",
      backup: "Backup",
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Premium Header */}
      <div className="px-4 py-6 sm:py-8 md:py-10 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  System Management
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 mb-1 sm:mb-2 leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium hidden sm:block">
                Comprehensive system analytics and management
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

      {/* Main Statistics */}
      <div className="px-4 py-3 border-b border-emerald-100 bg-white flex-shrink-0 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-sm border border-emerald-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">Patients</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1">{stats.totalPatients}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-blue-700 text-xs font-semibold uppercase tracking-wide">Analyses</p>
              <p className="text-3xl sm:text-4xl font-black text-blue-600 mt-1">{stats.totalResults}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white rounded-lg shadow-sm border border-red-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-red-700 text-xs font-semibold uppercase tracking-wide">Positive</p>
              <p className="text-3xl sm:text-4xl font-black text-red-600 mt-1">{stats.positiveResults}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-sm border border-yellow-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-yellow-700 text-xs font-semibold uppercase tracking-wide">Pending</p>
              <p className="text-3xl sm:text-4xl font-black text-yellow-600 mt-1">{stats.pendingResults}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-sm border border-purple-100 p-3 sm:p-4 hover:shadow-md transition-all">
              <p className="text-purple-700 text-xs font-semibold uppercase tracking-wide">Professionals</p>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 mt-1">{stats.totalPhysicians}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full space-y-4">

          {/* SECTION 1: Healthcare Professionals Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-emerald-600" /> Healthcare Professionals
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">System staff and management</p>
            </div>
            <div className="p-4">
              {physicians && physicians.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Name</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Email</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Role</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Patients</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Analyses</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {physicians.map((physician) => (
                        <tr key={physician.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="px-3 py-2 font-medium text-gray-900 text-xs">{physician.firstName} {physician.lastName}</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">{physician.email}</td>
                          <td className="px-3 py-2 text-gray-600 text-xs text-center">{physician.role}</td>
                          <td className="px-3 py-2 text-center font-medium text-xs">{physician.patientCount}</td>
                          <td className="px-3 py-2 text-center font-medium text-xs">{physician.analysisCount}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => navigate(`/profession-details/${physician.id}`)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition font-semibold text-xs"
                              title="View details"
                            >
                              <FiEye size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No Professionals" message="No healthcare professionals found" />
              )}
            </div>
          </div>

          {/* SECTION 2: Patient Registry */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiZap className="text-blue-600" /> Patient Registry
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Complete patient database</p>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <FiSearch className="text-gray-400 flex-shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-xs"
                />
              </div>
              {filteredPatients && filteredPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">First Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Last Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Email</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Gender</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">DOB</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Date Created</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="px-3 py-2 font-medium text-gray-900 text-xs">{patient.firstName}</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">{patient.lastName}</td>
                          <td className="px-3 py-2 text-gray-600 text-xs">{patient.email}</td>
                          <td className="px-3 py-2 text-gray-600 text-xs text-center">{patient.gender}</td>
                          <td className="px-3 py-2 text-gray-600 text-xs text-center">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => navigate(`/patient/${patient.id}`, { state: { patient, results: results.filter(r => r.patientId === patient.id) } })}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-semibold text-xs"
                              title="View details"
                            >
                              <FiEye size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No Patients Found" message={searchTerm ? "No results match your search" : "No patients registered"} />
              )}
            </div>
          </div>

          {/* SECTION 3: Results & Reports */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiCheckCircle className="text-red-600" /> Diagnosis Results
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Analysis and reports</p>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <FiFilter className="text-gray-400 flex-shrink-0" size={16} />
                <select
                  title="Filter results"
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value as any)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-xs"
                >
                  <option value="all">All Results</option>
                  <option value="positive">Positive Cases</option>
                  <option value="negative">Negative Cases</option>
                  <option value="pending">Pending Analysis</option>
                </select>
              </div>
              {filteredResults && filteredResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">Disease Type</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Prediction</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Status</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Confidence</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Date</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredResults.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                          <td className="px-3 py-2 font-medium text-gray-900 text-xs">{result.diseaseType}</td>
                          <td className="px-3 py-2 text-center text-xs">
                            <span className={`font-medium px-2 py-1 rounded ${result.prediction === 'POSITIVE' ? 'bg-red-100 text-red-800' : result.prediction === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {result.prediction}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center text-xs text-gray-600">{result.status}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-600">{result.confidenceScore ? `${(result.confidenceScore * 100).toFixed(2)}%` : 'N/A'}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{new Date(result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => setSelectedResult(result)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition font-semibold text-xs"
                              title="View details"
                            >
                              <FiEye size={14} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No Results Found" message="No diagnosis results available" />
              )}
            </div>
          </div>

          {/* SECTION 4: Top Performing Physicians */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiAward className="text-purple-600" /> Top Performing Physicians
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Based on case completion</p>
            </div>
            <div className="p-4">
              {getTopPhysicians().length > 0 ? (
                <div className="space-y-3">
                  {getTopPhysicians().map((physician, index) => (
                    <div key={physician.id} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block w-6 h-6 bg-purple-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <p className="font-bold text-gray-900">{physician.firstName} {physician.lastName}</p>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{physician.role}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{physician.email}</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded px-2 py-1 border border-gray-200">
                              <p className="text-xs text-gray-600">Patients</p>
                              <p className="text-lg font-bold text-emerald-600">{physician.patientCount}</p>
                            </div>
                            <div className="bg-white rounded px-2 py-1 border border-gray-200">
                              <p className="text-xs text-gray-600">Analyses</p>
                              <p className="text-lg font-bold text-blue-600">{physician.analysisCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No Data" message="Unable to load physician rankings" />
              )}
            </div>
          </div>

          {/* SECTION 5: Recent Activity Timeline */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiActivity className="text-orange-600" /> Recent Activity
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Latest diagnosis submissions</p>
            </div>
            <div className="p-4">
              {getRecentActivity().length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getRecentActivity().map((activity) => (
                    <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className={`flex-shrink-0 w-2 rounded-full mt-2 ${activity.prediction === 'POSITIVE' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs font-bold text-gray-900">{activity.diseaseType}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${activity.prediction === 'POSITIVE' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {activity.prediction}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">Status: {activity.status}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No Activity" message="No recent diagnosis submissions" />
              )}
            </div>
          </div>

          {/* SECTION 6: Demographics Overview */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-cyan-600" /> Patient Demographics
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Gender distribution analysis</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 text-center">
                  <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Male</p>
                  <p className="text-3xl font-black text-blue-600">{getDemographics().male}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    {patients.length > 0 ? ((getDemographics().male / patients.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200 text-center">
                  <p className="text-xs text-pink-600 font-semibold uppercase mb-2">Female</p>
                  <p className="text-3xl font-black text-pink-600">{getDemographics().female}</p>
                  <p className="text-xs text-pink-600 mt-2">
                    {patients.length > 0 ? ((getDemographics().female / patients.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 text-center">
                  <p className="text-xs text-purple-600 font-semibold uppercase mb-2">Other</p>
                  <p className="text-3xl font-black text-purple-600">{getDemographics().other}</p>
                  <p className="text-xs text-purple-600 mt-2">
                    {patients.length > 0 ? ((getDemographics().other / patients.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3">Demographics Insights</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• Total Patients: {patients.length}</p>
                  <p>• Primary Gender: {getDemographics().male > getDemographics().female ? 'Male' : getDemographics().female > getDemographics().male ? 'Female' : 'Balanced'}</p>
                  <p>• Distribution: Balanced across genders</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: System Health & Metrics */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiBarChart2 className="text-green-600" /> System Health & Metrics
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Performance indicators</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold uppercase mb-2">Completion Rate</p>
                  <p className="text-3xl font-black text-green-600">{getSystemMetrics().completionRate}%</p>
                  <div className="mt-3 w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${getSystemMetrics().completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <p className="text-xs text-red-600 font-semibold uppercase mb-2">Positive Cases Rate</p>
                  <p className="text-3xl font-black text-red-600">{getSystemMetrics().positiveRate}%</p>
                  <div className="mt-3 w-full bg-red-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${getSystemMetrics().positiveRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Avg Confidence</p>
                  <p className="text-3xl font-black text-blue-600">{getSystemMetrics().avgConfidence}%</p>
                  <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${getSystemMetrics().avgConfidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3">Key Metrics Summary</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                  <div>
                    <p className="font-semibold text-gray-900">{stats.totalPatients}</p>
                    <p>Total Patients</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stats.totalResults}</p>
                    <p>Total Analyses</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stats.totalPhysicians}</p>
                    <p>Healthcare Staff</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stats.pendingResults}</p>
                    <p>Pending Cases</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: Diagnostic Trends */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-600" /> 7-Day Diagnostic Trends
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">Daily analysis submissions</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-2">
                {getTrendData().map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full flex items-flex-end justify-center mb-2 h-32">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t"
                        style={{
                          height: `${Math.max(day.count * 20, 10)}px`,
                        }}
                        title={`${day.count} analyses`}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">{day.count}</p>
                    <p className="text-xs text-gray-500">{day.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 9: System Logs */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-slate-600" /> System Activity Logs
              </h2>
              <button
                onClick={loadSystemLogs}
                disabled={logsLoading}
                className="p-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
                title="Refresh logs"
              >
                <FiRotateCw className={logsLoading ? "animate-spin" : ""} size={16} />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <FiFilter className="text-gray-400 flex-shrink-0" size={16} />
                <select
                  title="Filter logs by level"
                  value={logsFilter}
                  onChange={(e) => {
                    setLogsFilter(e.target.value);
                    setLogsPage(0);
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-xs"
                >
                  <option value="all">All Logs</option>
                  <option value="info">Info</option>
                  <option value="warn">Warnings</option>
                  <option value="error">Errors</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              {systemLogs && systemLogs.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {systemLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-slate-300 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${getLevelColor(
                              log.level
                            )}`}
                          >
                            {log.level.toUpperCase()}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-700 whitespace-nowrap">
                            {getCategoryLabel(log.category)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-900 font-medium mb-1">{log.message}</p>
                      {log.details && (
                        <p className="text-xs text-gray-600 break-words max-h-12 overflow-hidden text-ellipsis">
                          {typeof log.details === "string"
                            ? log.details
                            : JSON.stringify(log.details)}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        {log.statusCode && (
                          <span>Status: {log.statusCode}</span>
                        )}
                        {log.responseTimeMs && (
                          <span>Response: {log.responseTimeMs}ms</span>
                        )}
                        {log.resourceType && (
                          <span>
                            Resource: {log.resourceType}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={logsLoading ? "Loading Logs..." : "No System Logs"}
                  message={logsLoading ? "Fetching system activity..." : "No system logs available"}
                />
              )}

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-600">
                  Page {logsPage + 1} • Showing up to {logsLimit} logs
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLogsPage(Math.max(0, logsPage - 1))}
                    disabled={logsPage === 0}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300 disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setLogsPage(logsPage + 1)}
                    disabled={systemLogs.length < logsLimit}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300 disabled:opacity-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
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

      <ResultDetailsModal
        isOpen={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />
    </div>
  );
}

export default AdminDashboard;
