import React from 'react';
import { useGetAllPatients, useCreatePatient, useDeletePatient } from '../hooks/usePatients';
import { useAuthUser } from '../hooks/useAuth';

/**
 * Example Component: Patients List with TanStack Query
 * Shows how to use custom hooks for querying and mutating data
 */
const PatientsList: React.FC = () => {
  // Fetch all patients
  const { data: patients, isLoading, error } = useGetAllPatients();
  const { data: user } = useAuthUser();

  // Mutation hooks
  const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient();
  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();

  const handleDelete = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
    }
  };

  const handleCreateNew = async () => {
    const firstName = prompt('First Name:');
    if (!firstName) return;

    const lastName = prompt('Last Name:');
    if (!lastName) return;

    const email = prompt('Email:');
    if (!email) return;

    const phone = prompt('Phone:');
    if (!phone) return;

    const dateOfBirth = prompt('Date of Birth (YYYY-MM-DD):');
    if (!dateOfBirth) return;

    createPatient({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender: 'Other',
    });
  };

  // Loading state
  if (isLoading) {
    return <div className="text-center py-8">Loading patients...</div>;
  }

  // Error state
  if (error instanceof Error) {
    return <div className="text-red-500 py-8">Error: {error.message}</div>;
  }

  // No data state
  if (!patients || patients.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No patients found</p>
        <button
          onClick={handleCreateNew}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create First Patient
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patients</h2>
        <button
          onClick={handleCreateNew}
          disabled={isCreating}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isCreating ? 'Creating...' : 'Add Patient'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Physician</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id} className="border-t border-gray-300 hover:bg-gray-50">
                <td className="px-4 py-2">{`${patient.firstName} ${patient.lastName}`}</td>
                <td className="px-4 py-2">{patient.email}</td>
                <td className="px-4 py-2">{patient.dateOfBirth}</td>
                <td className="px-4 py-2">{patient.physicianId}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(patient.id)}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:bg-gray-400"
                  >
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsList;
