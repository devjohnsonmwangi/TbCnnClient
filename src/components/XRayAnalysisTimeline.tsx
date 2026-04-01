import React from 'react';
import { FiCheck, FiAlertCircle, FiRotateCw } from 'react-icons/fi';

interface XRayAnalysisTimelineProps {
  isUploaded: boolean;
  isValidated: boolean;
  isAnalyzing: boolean;
  isFailed: boolean;
  hasResults: boolean;
  failureReason?: string;
}

export const XRayAnalysisTimeline: React.FC<XRayAnalysisTimelineProps> = ({
  isUploaded,
  isValidated,
  isAnalyzing,
  isFailed,
  hasResults,
  failureReason,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 mb-4">
      <p className="text-xs font-semibold text-blue-700 uppercase mb-3">Analysis Progress</p>
      <div className="grid grid-cols-4 gap-2 text-xs">
        {/* Step 1: Uploaded */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 text-xs font-bold">
            ✓
          </div>
          <span className="text-center text-blue-900 font-semibold">Uploaded</span>
        </div>

        {/* Step 2: Stored */}
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-1 text-xs font-bold">
            ✓
          </div>
          <span className="text-center text-blue-900 font-semibold">Stored</span>
        </div>

        {/* Step 3: Pending/Analyzing */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center mb-1 text-xs font-bold ${
              isFailed
                ? 'bg-red-500'
                : isAnalyzing
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-yellow-400'
            }`}
          >
            {isFailed ? <FiAlertCircle size={16} /> : isAnalyzing ? <FiRotateCw className="animate-spin" size={16} /> : '⏳'}
          </div>
          <span className="text-center text-blue-900 font-semibold">
            {isFailed ? 'Failed' : isAnalyzing ? 'Analyzing' : 'Pending'}
          </span>
        </div>

        {/* Step 4: Results */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center mb-1 text-xs ${
              hasResults ? 'bg-green-500 font-bold' : 'bg-gray-300'
            }`}
          >
            {hasResults ? '✓' : '-'}
          </div>
          <span className={`text-center font-semibold ${hasResults ? 'text-blue-900' : 'text-gray-600'}`}>
            Results
          </span>
        </div>
      </div>
      {isFailed && failureReason && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          Error: {failureReason}
        </div>
      )}
    </div>
  );
};

export default XRayAnalysisTimeline;
