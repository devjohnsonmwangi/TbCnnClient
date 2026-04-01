import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FiArrowLeft, FiSearch, FiFilter, FiCheckCircle, FiAlertCircle, FiRotateCw, FiDownload, FiInbox } from "react-icons/fi";
import { PatientsService } from "../services/patientsService";
import { ResultsService } from "../services/resultsService";
import { PatientResponseDto, DiagnosisResultResponseDto, DiagnosisStatus } from "../types/api.types";

interface PhysicianInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  patientCount: number;
  analysisCount: number;
}

interface PatientWithAnalysis extends PatientResponseDto {
  analysisCount: number;
  lastAnalysisDate?: string;
}

function UserAnalysisDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [physician, setPhysician] = useState<PhysicianInfo | null>(null);
  const [patients, setPatients] = useState<PatientWithAnalysis[]>([]);
  const [results, setResults] = useState<DiagnosisResultResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<"all" | "positive" | "negative" | "pending">("all");
  const [loading, setLoading] = useState(true);

  const patientsService = new PatientsService();
  const resultsService = new ResultsService();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Get user info from location state or fetch
        const physicianData = location.state?.user;
        if (physicianData) {
          setPhysician(physicianData);
        }

        if (!userId) {
          toast.error("User ID not found");
          return;
        }

        // Fetch all data
        const [patientsData, resultsData] = await Promise.all([
          patientsService.getAllPatients().catch(() => []),
          resultsService.getAllResults().catch(() => []),
        ]);

        // Filter results for this physician
        const physicianResults = resultsData?.filter((r) => {
          // Since results don't have a physician field, we filter by patients
          const patientsBelongingToPhysician = patientsData?.filter(
            (p) => p.physicianId === userId
          ) || [];
          return patientsBelongingToPhysician.some((p) => p.id === r.patientId);
        }) || [];

        // Get unique patients handled by this physician
        const physicianPatients = patientsData?.filter(
          (p) => p.physicianId === userId
        ) || [];

        // Add analysis count to each patient
        const patientsWithAnalysis: PatientWithAnalysis[] = physicianPatients.map(
          (patient) => {
            const patientResults = physicianResults.filter(
              (r) => r.patientId === patient.id
            );
            const lastAnalysis = patientResults.length > 0
              ? new Date(
                  Math.max(
                    ...patientResults.map((r) =>
                      new Date(r.createdAt).getTime()
                    )
                  )
                ).toISOString()
              : undefined;

            return {
              ...patient,
              analysisCount: patientResults.length,
              lastAnalysisDate: lastAnalysis,
            };
          }
        );

        setPatients(patientsWithAnalysis);
        setResults(physicianResults);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load analysis data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const stats = {
    totalPatients: patients.length,
    totalAnalyses: results.length,
    positiveResults: results.filter((r) => r.prediction === "POSITIVE").length,
    pendingResults: results.filter((r) => r.status === DiagnosisStatus.PENDING).length,
  };

  const searchedPatients = patients.filter(
    (p) =>
      !searchTerm ||
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResults = results.filter((r) => {
    if (filterResult === "all") return true;
    if (filterResult === "positive") return r.prediction === "POSITIVE";
    if (filterResult === "negative") return r.prediction === "NEGATIVE";
    if (filterResult === "pending") return r.status === DiagnosisStatus.PENDING;
    return true;
  });

  const EmptyState = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <FiInbox className="text-5xl text-gray-300" />
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 sm:pt-24">
      {/* Header - Below Navbar */}
      <div className="px-4 py-8 md:py-12 lg:py-16 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 mb-6 text-emerald-600 hover:bg-emerald-50 rounded-lg transition text-sm sm:text-base"
            title="Go back"
          >
            <FiArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {physician?.firstName} {physician?.lastName}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-medium">{physician?.email}</span>
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 whitespace-nowrap">
                {physician?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Patients Attended
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {stats.totalPatients}
                  </p>
                </div>
                <div className="text-3xl text-emerald-500 opacity-50">👥</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Total Analyses
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                    {stats.totalAnalyses}
                  </p>
                </div>
                <div className="text-3xl text-blue-500 opacity-50">📊</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Positive Cases
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-red-600">
                    {stats.positiveResults}
                  </p>
                </div>
                <div className="text-3xl text-red-500 opacity-50">⚠️</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl sm:text-4xl font-bold text-yellow-600">
                    {stats.pendingResults}
                  </p>
                </div>
                <div className="text-3xl text-yellow-500 opacity-50">⏳</div>
              </div>
            </div>
          </div>

          {/* Patients Attended Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Patients Attended ({stats.totalPatients})
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <FiRotateCw className="text-4xl text-emerald-600 animate-spin" />
                  <p className="text-gray-600">Loading...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-2">
                    <FiSearch className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {searchedPatients && searchedPatients.length > 0 ? (
                    <div
                      className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded"
                      style={{ maxHeight: "500px" }}
                    >
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                              Patient Name
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">
                              Email
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase text-center">
                              Diagnoses
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">
                              Last Analysis
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {searchedPatients.map((patient) => (
                            <tr
                              key={patient.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                {patient.firstName} {patient.lastName}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
                                {patient.email}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {patient.analysisCount}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell whitespace-nowrap">
                                {patient.lastAnalysisDate
                                  ? new Date(patient.lastAnalysisDate).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      title={
                        searchTerm
                          ? "No Patients Found"
                          : "No Patients Attended"
                      }
                      message={
                        searchTerm
                          ? "Try adjusting your search criteria"
                          : "This user has not attended any patients yet"
                      }
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Analysis Results Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Analysis Results ({stats.totalAnalyses})
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <FiRotateCw className="text-4xl text-emerald-600 animate-spin" />
                  <p className="text-gray-600">Loading...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-2">
                    <FiFilter className="text-gray-400" />
                    <select
                      value={filterResult}
                      onChange={(e) => setFilterResult(e.target.value as any)}
                      className="flex-1 bg-transparent outline-none text-gray-700 border-b border-gray-200 pb-2"
                      aria-label="Filter diagnosis results by status"
                    >
                      <option value="all">All Results</option>
                      <option value="positive">Positive TB</option>
                      <option value="negative">Negative TB</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {filteredResults && filteredResults.length > 0 ? (
                    <div
                      className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded"
                      style={{ maxHeight: "500px" }}
                    >
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                              Disease Type
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                              Prediction
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">
                              Confidence
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">
                              Status
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredResults.map((result) => (
                            <tr
                              key={result.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                {result.diseaseType}
                              </td>
                              <td className="px-4 sm:px-6 py-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    result.prediction === "POSITIVE"
                                      ? "bg-red-100 text-red-800"
                                      : result.prediction === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {result.prediction === "POSITIVE" ? (
                                    <FiAlertCircle />
                                  ) : result.prediction === "PENDING" ? (
                                    <FiRotateCw className="animate-spin" />
                                  ) : (
                                    <FiCheckCircle />
                                  )}
                                  {result.prediction}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 hidden md:table-cell">
                                {result.confidenceScore > 0
                                  ? `${(result.confidenceScore * 100).toFixed(
                                      1
                                    )}%`
                                  : "—"}
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm hidden sm:table-cell">
                                <span
                                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                    result.status === DiagnosisStatus.COMPLETED
                                      ? "bg-emerald-100 text-emerald-800"
                                      : result.status ===
                                        DiagnosisStatus.PENDING
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {result.status || "Unknown"}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                {new Date(result.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      title="No Analysis Results"
                      message={
                        filterResult === "all"
                          ? "This user has not performed any analysis yet"
                          : `No ${filterResult} results found`
                      }
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAnalysisDetails;
