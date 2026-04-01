import React from "react";
import { FiX, FiMail, FiUser, FiBarChart2 } from "react-icons/fi";

interface PhysicianWithPatients {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  patientCount: number;
  analysisCount: number;
}

interface ProfessionalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: PhysicianWithPatients | null;
}

export const ProfessionalDetailsModal: React.FC<ProfessionalDetailsModalProps> = ({
  isOpen,
  onClose,
  professional,
}) => {
  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">Professional Details</h2>
          <button
            title="Close"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-lg flex-shrink-0">
              <FiUser className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Name</p>
              <p className="text-lg font-bold text-gray-900">
                {professional.firstName} {professional.lastName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
              <FiMail className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Email</p>
              <p className="text-sm font-medium text-gray-900">{professional.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
              <FiBarChart2 className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Role</p>
              <div className="mt-1">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {professional.role}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Performance</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded p-3 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-emerald-600">{professional.patientCount}</p>
                <p className="text-xs text-gray-600 mt-1">Patients</p>
              </div>
              <div className="bg-white rounded p-3 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-blue-600">{professional.analysisCount}</p>
                <p className="text-xs text-gray-600 mt-1">Analyses</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Metrics</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Cases Per Month</span>
                <span className="font-bold text-gray-900">{(professional.patientCount / 3).toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Case Completion Rate</span>
                <span className="font-bold text-gray-900">
                  {professional.patientCount > 0 ? ((professional.analysisCount / professional.patientCount) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
