import React from "react";
import { FiX, FiUser, FiMail, FiInfo, FiFileText, FiAlertCircle } from "react-icons/fi";
import { PatientResponseDto } from "../types/api.types";

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientResponseDto | null;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">Patient Details</h2>
          <button
            title="value"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Full Name */}
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
              <FiUser className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Full Name</p>
              <p className="text-lg font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
              <FiMail className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Email</p>
              <p className="text-sm font-medium text-gray-900">{patient.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
              <FiInfo className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Phone</p>
              <p className="text-sm font-medium text-gray-900">{patient.phone || "Not provided"}</p>
            </div>
          </div>

          {/* Gender & DOB */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Personal Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Gender</p>
                <p className="text-sm font-bold text-gray-900">{patient.gender}</p>
              </div>
              <div className="bg-white rounded p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">DOB</p>
                <p className="text-sm font-bold text-gray-900">
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString("en-US")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          {patient.medicalHistory && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Medical History</p>
              <p className="text-sm text-gray-700 leading-relaxed">{patient.medicalHistory}</p>
            </div>
          )}

          {/* Address */}
          {patient.address && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Address</p>
              <p className="text-sm text-gray-700 leading-relaxed">{patient.address}</p>
            </div>
          )}

          {/* Allergies */}
          {patient.allergies && (
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                <FiAlertCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">Allergies</p>
                <p className="text-sm font-medium text-gray-900">{patient.allergies}</p>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
              <FiFileText className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Created Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(patient.createdAt).toLocaleDateString("en-US")}
              </p>
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
