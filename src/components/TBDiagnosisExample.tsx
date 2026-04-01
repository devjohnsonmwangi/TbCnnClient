import React, { useState } from 'react';
import { useCreateTBDiagnosis, useGetTBDiagnosis } from '../hooks/useResults';
import { useGetPatientById } from '../hooks/usePatients';
import { useAuthUser } from '../hooks/useAuth';
import { DiseaseType, ConfidenceLevel } from '../types/api.types';

/**
 * Example Component: TB Diagnosis with TanStack Query
 * Shows mutation with optimistic updates and refetch patterns
 */
interface TBDiagnosisExampleProps {
  patientId: string;
}

const TBDiagnosisExample: React.FC<TBDiagnosisExampleProps> = ({ patientId }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');

  // Queries
  const { data: patient, isLoading: patientLoading } = useGetPatientById(patientId);
  const { data: diagnosis, isLoading: diagnosisLoading } = useGetTBDiagnosis(patientId);

  // Mutations
  const { mutate: createDiagnosis, isPending: isCreating, error } = useCreateTBDiagnosis();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateDiagnosis = () => {
    if (!selectedImage && !imageBase64) {
      alert('Please select an X-ray image');
      return;
    }

    // Note: CreateResultRequest interface doesn't include imageBase64
    // The backend should handle base64 in the prediction field or via separate upload
    createDiagnosis({
      patientId,
      xrayId: selectedImage?.name || 'xray-upload',
      diseaseType: DiseaseType.TUBERCULOSIS,
      prediction: 'analyzing',
      confidenceScore: 0,
      confidenceLevel: ConfidenceLevel.LOW,
    });
  };

  if (patientLoading) {
    return <div className="p-4">Loading patient data...</div>;
  }

  if (!patient) {
    return <div className="p-4 text-red-500">Patient not found</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">TB Diagnosis</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Patient Name</p>
            <p className="font-semibold">{`${patient.firstName} ${patient.lastName}`}</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Birth</p>
            <p className="font-semibold">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{patient.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Patient ID</p>
            <p className="font-semibold text-sm">{patient.id}</p>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Upload X-Ray</h3>
        <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="text-gray-600">
              {selectedImage ? (
                <div>
                  <p className="font-semibold">{selectedImage.name}</p>
                  <p className="text-sm">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg">📁 Click to select X-Ray image</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
              )}
            </div>
          </label>
        </div>

        {imageBase64 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img src={imageBase64} alt="Preview" className="max-h-40 rounded" />
          </div>
        )}

        {error instanceof Error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded text-red-700">
            {error.message}
          </div>
        )}

        <button
          onClick={handleCreateDiagnosis}
          disabled={isCreating || !selectedImage}
          className="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Processing Diagnosis...' : 'Create TB Diagnosis'}
        </button>
      </div>

      {/* Diagnosis Results Section */}
      {diagnosisLoading ? (
        <div className="p-4 text-center">Loading diagnosis results...</div>
      ) : diagnosis ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Diagnosis</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Prediction</p>
              <p className={`text-xl font-bold ${diagnosis.prediction === 'positive' ? 'text-red-600' : 'text-green-600'}`}>
                {diagnosis.prediction.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${(diagnosis.confidenceScore || 0) * 100}%` }}
                  />
                </div>
                <p className="font-semibold">{Math.round((diagnosis.confidenceScore || 0) * 100)}%</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600">Created At</p>
              <p className="font-semibold">{new Date(diagnosis.createdAt).toLocaleString()}</p>
            </div>
            {diagnosis.recommendations && typeof diagnosis.recommendations === 'string' && diagnosis.recommendations.length > 0 && (
              <div>
                <p className="text-gray-600">Recommendations</p>
                <p className="text-sm">{diagnosis.recommendations}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">No diagnosis yet</div>
      )}
    </div>
  );
};

export default TBDiagnosisExample;
