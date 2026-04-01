import React, { useState } from 'react';
import { useCreateTBDiagnosis } from '../hooks/useResults';
import { useAuthUser } from '../hooks/useAuth';
import { DiseaseType, ConfidenceLevel } from '../types/api.types';
import './TBPredictionComponent.css';

export const TBPredictionComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const { data: user } = useAuthUser();
  const { mutate: createDiagnosis, isPending: loading, error } = useCreateTBDiagnosis();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile || !user) {
      alert('Please select an image and ensure you are logged in');
      return;
    }

    // Create a temporary patient or use existing patient ID
    // For now, we'll need to get the patient ID from somewhere
    // This might need to be passed as a prop or retrieved from state
    createDiagnosis({
      patientId: user.id, // Using current user as patient ID
      xrayId: selectedFile.name || 'unknown', // Using filename as temporary xrayId
      diseaseType: DiseaseType.TUBERCULOSIS,
      prediction: 'analyzing',
      confidenceScore: 0,
      confidenceLevel: ConfidenceLevel.LOW,
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageBase64(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-tb-light rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-tb-primary mb-6">TB Chest X-ray Analysis</h2>

      {/* Upload Section */}
      <div className="mb-6">
        <label htmlFor="tb-file-input" className="block text-lg font-semibold text-tb-primary mb-3">
          Upload Chest X-ray Image
        </label>
        <input
          id="tb-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-tb-primary rounded-lg cursor-pointer focus:outline-none focus:border-tb-accent"
        />
      </div>

      {/* Preview Section */}
      {previewUrl && (
        <div className="mb-6">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto max-h-96 object-contain rounded-lg border-2 border-tb-secondary"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handlePredict}
          disabled={!selectedFile || loading}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
            loading || !selectedFile
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-tb-accent hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          onClick={handleReset}
          disabled={!selectedFile}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold text-tb-primary border-2 border-tb-primary transition ${
            !selectedFile
              ? 'border-gray-400 text-gray-400 cursor-not-allowed'
              : 'hover:bg-tb-light cursor-pointer'
          }`}
        >
          Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-400">
          <p className="font-semibold">
            Error: {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      )}

      {/* Success Message */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg border border-blue-400">
          <p className="font-semibold">Analyzing TB chest X-ray...</p>
        </div>
      )}
    </div>
  );
};

export default TBPredictionComponent;
