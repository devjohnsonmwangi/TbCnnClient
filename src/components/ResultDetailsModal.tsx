import React from "react";
import { FiX, FiActivity, FiAlertCircle, FiCheckCircle, FiBarChart2, FiFileText } from "react-icons/fi";
import { DiagnosisResultResponseDto, DiagnosisStatus } from "../types/api.types";

interface ResultDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DiagnosisResultResponseDto | null;
}

export const ResultDetailsModal: React.FC<ResultDetailsModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen || !result) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case DiagnosisStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case DiagnosisStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case DiagnosisStatus.FAILED:
        return "bg-red-100 text-red-800";
      case DiagnosisStatus.UPDATED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPredictionColor = (prediction: string) => {
    return prediction === "POSITIVE" 
      ? "bg-red-100 text-red-800" 
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">Diagnosis Details</h2>
          <button
            title="Close"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Result ID */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs uppercase text-gray-600 font-semibold">Result ID</p>
            <p className="text-sm font-mono text-gray-900 mt-1 truncate">{result.id}</p>
          </div>

          {/* Disease Type */}
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
              <FiActivity className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Disease Type</p>
              <p className="text-lg font-bold text-gray-900">{result.diseaseType}</p>
            </div>
          </div>

          {/* Prediction */}
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
              <FiAlertCircle className="text-orange-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase text-gray-500 font-semibold">Prediction</p>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPredictionColor(result.prediction)}`}>
                  {result.prediction}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
              <FiCheckCircle className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase text-gray-500 font-semibold">Status</p>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
              <FiBarChart2 className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold">Confidence Score</p>
              <div className="mt-2">
                <p className="text-2xl font-bold text-purple-600">
                  {result.confidenceScore ? `${(result.confidenceScore * 100).toFixed(2)}%` : "N/A"}
                </p>
                {result.confidenceScore && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-red-600 h-2 rounded-full"
                      style={{ width: `${result.confidenceScore * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Analysis Info</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Level</span>
                <span className="font-bold text-gray-900">
                  {result.confidenceScore && result.confidenceScore > 0.7
                    ? "High"
                    : result.confidenceScore && result.confidenceScore > 0.4
                    ? "Medium"
                    : "Low"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(result.createdAt).toLocaleDateString("en-US")}
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
