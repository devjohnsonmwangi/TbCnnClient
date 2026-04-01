import React from 'react';

const DiseaseCard = () => {
  return (
    <div className="shadow-lg hover:shadow-2xl w-80 h-96 flex flex-col items-center justify-between rounded-2xl border overflow-hidden transition-all duration-300">
      <div className="bg-pink-400 w-full h-1/2 rounded-t-2xl flex items-center justify-center text-white font-bold text-xl">
        Disease Preview
      </div>

      <div className="w-full bg-slate-100 h-1/2 rounded-b-2xl p-4 flex flex-col justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Tuberculosis</h2>
        <p className="text-sm text-gray-600">
          A bacterial infection that primarily affects the lungs.
        </p>
        <button className="bg-blue-300 text-white px-4 py-2 rounded-2xl self-end hover:bg-blue-400 transition font-bold">
          Select Model
        </button>
      </div>
    </div>
  );
};

export default DiseaseCard;
