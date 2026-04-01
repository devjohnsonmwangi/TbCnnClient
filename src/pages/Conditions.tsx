import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

function Conditions() {
  const diseases = [
    { Name: "Pneumonia", emoji: "🫁🤧", description: "A bacterial or viral infection affecting the lungs.", color: "from-blue-400 to-blue-200",link:"/conditions/pneumonia" },
    { Name: "Tuberculosis", emoji: "🫁🧫", description: "A contagious bacterial infection primarily affecting the lungs.", color: "from-green-400 to-green-200",link:"/conditions/tuberculosis" },
    { Name: "Lung Cancer", emoji: "🫁🎗️", description: "Abnormal cell growth in lung tissue that may form tumors.", color: "from-red-400 to-red-200",link:"/conditions/lung_cancer" },
    { Name: "Bone Fracture", emoji: "🦴🩹", description: "A break in the bone caused by trauma or injury.", color: "from-yellow-400 to-yellow-200",link:"/conditions/bone_fracture" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex flex-col items-center text-center py-12 px-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 shadow-lg">
        <h1 className="text-gray-900 font-extrabold text-3xl md:text-5xl tracking-tight mb-3">
          E-Afya Disease Detection AI System
        </h1>
        <p className="text-gray-700 font-medium text-base md:text-lg max-w-3xl leading-relaxed">
          AI-powered analysis for <span className="font-semibold text-blue-600">early detection of various diseases</span> using medical imaging and clinical data.
        </p>
        <div className="w-24 h-1 bg-blue-500 rounded-full mt-4 animate-pulse"></div>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {diseases.map((disease) => (
            <Link
            to={disease.link}
              key={disease.Name}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className={`flex items-center justify-center h-44 bg-gradient-to-br ${disease.color} text-white text-6xl font-bold`}>
                {disease.emoji}
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{disease.Name}</h2>
                <p className="text-gray-600 text-sm flex-1 mb-4">{disease.description}</p>
                <button className="mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2 px-6 rounded-2xl shadow-lg transition-all duration-300">
                  Select Model
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Conditions;
