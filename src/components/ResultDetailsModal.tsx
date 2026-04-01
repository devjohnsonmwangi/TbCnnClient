import React, { useState } from "react";
import { FiX, FiActivity, FiAlertCircle, FiCheckCircle, FiBarChart2, FiFileText } from "react-icons/fi";
import { DiagnosisResultResponseDto, DiagnosisStatus } from "../types/api.types";
import { ImageDisplay } from "./ImageDisplay";

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
  const [activeTab, setActiveTab] = useState<'details' | 'images'>('details');

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
    return prediction === "POSITIVE" || prediction === "Tuberculosis"
      ? "bg-red-100 text-red-800" 
      : "bg-green-100 text-green-800";
  };

  // Check if we have image data to display
  const hasImages = result.heatmapBase64 || result.xrayId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Diagnosis Details</h2>
          <button
            title="Close"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        {hasImages && (
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-3 font-medium transition ${
                activeTab === 'details'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`flex-1 px-4 py-3 font-medium transition ${
                activeTab === 'images'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Images & Heatmap
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Details Tab */}
          {activeTab === 'details' && (
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

              {/* TB Intensity (if TB related) */}
              {result.tbIntensity && (
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                    <FiFileText className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-semibold">TB Intensity</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{result.tbIntensity}</p>
                  </div>
                </div>
              )}

              {/* Affected Areas */}
              {result.affectedAreas && Array.isArray(result.affectedAreas) && result.affectedAreas.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs uppercase text-gray-600 font-semibold mb-3">Affected Areas</p>
                  <div className="space-y-2">
                    {result.affectedAreas.map((area: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Findings */}
              {result.clinicalFindings && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs uppercase text-blue-700 font-semibold mb-2">Clinical Findings</p>
                  <p className="text-sm text-gray-700">{result.clinicalFindings}</p>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs uppercase text-green-700 font-semibold mb-2">Recommendations</p>
                  <p className="text-sm text-gray-700">{result.recommendations}</p>
                </div>
              )}

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
                  {result.processingTimeMs && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Processing Time</span>
                      <span className="text-sm font-bold text-gray-900">{result.processingTimeMs}ms</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="p-6 space-y-6">
              {/* Heatmap */}
              {result.heatmapBase64 && (
                <div>
                  <ImageDisplay
                    base64Image={result.heatmapBase64}
                    title="Analysis Heatmap"
                    alt="TB Analysis Heatmap"
                    containerClassName="w-full rounded-lg overflow-hidden border border-gray-200"
                    downloadable={true}
                    downloadFileName={`heatmap_${result.id}.png`}
                    zoomable={true}
                    mimeType="image/png"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Visual representation of areas detected with abnormalities. Red areas indicate higher confidence of TB detection.
                  </p>
                </div>
              )}

              {/* No Images Message */}
              {!result.heatmapBase64 && (
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 text-center">
                  <p className="text-sm text-yellow-800">
                    {result.status === DiagnosisStatus.PENDING
                      ? 'Analysis in progress. Images will be available once processing is complete.'
                      : 'No images available for this result.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 flex-shrink-0">
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
