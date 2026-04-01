import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiArrowLeft, FiUser, FiMail, FiBarChart2, FiUsers, FiInbox } from "react-icons/fi";
import { PatientsService } from "../services/patientsService";
import { UsersService } from "../services/usersService";
import { ResultsService } from "../services/resultsService";
import { PatientResponseDto } from "../types/api.types";
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

const ProfessionDetailsPage: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const patientsService = new PatientsService();
  const usersService = new UsersService();
  const resultsService = new ResultsService();
  const { accessToken } = useAuth();

  const [professional, setProfessional] = useState<PhysicianWithPatients | null>(null);
  const [patientsList, setPatientsList] = useState<PatientResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [allPatients, allResults, allUsers] = await Promise.all([
          patientsService.getAllPatients().catch(() => []),
          resultsService.getAllResults().catch(() => []),
          usersService.getAllUsers().catch(() => []),
        ]);

        // Find the professional
        const prof = allUsers?.find((u) => u.id === professionalId);
        if (!prof) {
          toast.error("Professional not found");
          navigate("/admin-dashboard");
          return;
        }

        // Filter patients for this professional
        const profPatients = allPatients?.filter((p) => p.physicianId === professionalId) || [];
        const profResults = allResults?.filter((r) =>
          profPatients.some((p) => p.id === r.patientId)
        ) || [];

        const professionalData: PhysicianWithPatients = {
          id: prof.id,
          firstName: prof.firstName || "Unknown",
          lastName: prof.lastName || "",
          email: prof.email || "",
          role: prof.role || "USER",
          patientCount: profPatients.length,
          analysisCount: profResults.length,
        };

        setProfessional(professionalData);
        setPatientsList(profPatients);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load professional details");
      } finally {
        setLoading(false);
      }
    };

    if (professionalId) {
      loadData();
    }
  }, [professionalId, accessToken]);

  const filteredPatients = patientsList.filter(
    (p) =>
      !searchTerm ||
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional details...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Professional not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 sm:py-8 md:py-10 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 mb-4 transition"
          >
            <FiArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  Professional Profile
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 mb-1 sm:mb-2 leading-tight">
                {professional.firstName} {professional.lastName}
              </h1>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-medium hidden sm:block">
                {professional.role} | {professional.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 max-w-7xl mx-auto w-full space-y-4">
          {/* Professional Information Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiUser className="text-emerald-600" /> Professional Information
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name */}
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-4 border border-emerald-100">
                  <p className="text-xs uppercase text-emerald-700 font-semibold mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">
                    {professional.firstName} {professional.lastName}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
                  <p className="text-xs uppercase text-blue-700 font-semibold mb-1">Email Address</p>
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {professional.email}
                  </p>
                </div>

                {/* Role */}
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-100">
                  <p className="text-xs uppercase text-purple-700 font-semibold mb-1">Role</p>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {professional.role}
                    </span>
                  </div>
                </div>

                {/* Patient Count */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-100">
                  <p className="text-xs uppercase text-green-700 font-semibold mb-1">Total Patients</p>
                  <p className="text-2xl font-bold text-green-600">{professional.patientCount}</p>
                </div>

                {/* Analysis Count */}
                <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-4 border border-cyan-100">
                  <p className="text-xs uppercase text-cyan-700 font-semibold mb-1">Total Analyses</p>
                  <p className="text-2xl font-bold text-cyan-600">{professional.analysisCount}</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100">
                  <p className="text-xs uppercase text-indigo-700 font-semibold mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {professional.analysisCount > 0
                      ? ((professional.analysisCount / professional.patientCount) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patients List Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-blue-600" /> Patients Attended
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">List of all patients attended by this professional</p>
            </div>
            <div className="p-4">
              <div className="mb-4 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
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
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">
                          First Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">
                          Last Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">
                          Email
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">
                          Gender
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">
                          Date of Birth
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">
                          Phone
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase min-w-max">
                          Address
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase min-w-max">
                          Date Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2 font-medium text-gray-900 text-xs">
                            {patient.firstName}
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs">
                            {patient.lastName}
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs">
                            {patient.email}
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs text-center">
                            {patient.gender}
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs text-center">
                            {patient.dateOfBirth
                              ? new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs">
                            {patient.phone || "N/A"}
                          </td>
                          <td className="px-3 py-2 text-gray-600 text-xs">
                            {patient.address || "N/A"}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600 text-center">
                            {new Date(patient.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <FiInbox className="text-5xl text-gray-300" />
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {searchTerm ? "No Results" : "No Patients"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {searchTerm
                        ? "No patients match your search"
                        : "This professional has no patients yet"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionDetailsPage;
