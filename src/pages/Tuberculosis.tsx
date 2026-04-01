import React, { useState } from "react";

const Tuberculosis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<string | null>(null);

  const causes = [
    "Bacteria (Mycobacterium tuberculosis)",
    "Close contact with infected individuals",
    "Weakened immune system",
    "Living in crowded environments",
  ];

  const preventiveMeasures = [
    "Vaccination (BCG vaccine)",
    "Avoid close contact with infected people",
    "Good ventilation in living spaces",
    "Healthy lifestyle to strengthen immunity",
  ];

  const trainingInfo = {
    trainingAccuracy: 95.2,
    validationAccuracy: 93.5,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setHeatmap(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result as string);
      setPreview(URL.createObjectURL(selectedFile));
    };
    reader.readAsDataURL(selectedFile);
  };

  const fileUpload = async () => {
    if (!base64) {
      alert("Please select an image first.");
      return;
    }
    setLoading(true);
    setResult(null);
    setHeatmap(null);

    try {
      const response = await fetch("https://cnn-disease-detection-system-server.onrender.com/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model:'tuberculosis', image: base64 }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setResult(data.prediction);
        setHeatmap(`data:image/jpeg;base64,${data.heatmap_base64}`);
      } else {
        setResult(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setResult("Failed to process image!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center p-3 pt-20 sm:pt-24">
      <header className="flex flex-col items-center text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-3">
          AI Tuberculosis Detector
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl leading-relaxed">
          Upload a chest X-ray to detect tuberculosis and visualize affected areas using AI and Grad-CAM
        </p>
        <div className="w-28 h-1 bg-green-600 rounded-full mt-4 animate-pulse"></div>
      </header>

      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 flex flex-col items-center space-y-6">
        <label htmlFor="tb-file-upload" className="block text-lg font-semibold text-green-700 mb-3">
          Select Chest X-ray Image
        </label>
        <input
          id="tb-file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-green-100 file:text-green-700
                     hover:file:bg-green-200 cursor-pointer
                     border border-green-100 rounded-lg w-1/2 p-2"
        />

        {preview && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-4">
            <div className="flex flex-col items-center">
              <p className="font-semibold text-gray-700 mb-2">Uploaded Image</p>
              <img
                src={preview}
                alt="Preview"
                className="w-80 h-80 md:w-96 md:h-96 object-contain rounded-2xl shadow-lg border border-gray-200 bg-gray-300"
              />
            </div>
            {heatmap && (
              <div className="flex flex-col items-center">
                <p className="font-semibold text-gray-700 mb-2">
                  Heatmap Visualization
                </p>
                <img
                  src={heatmap}
                  alt="Heatmap"
                  className="w-80 h-80 md:w-96 md:h-96 object-contain rounded-2xl shadow-lg border border-gray-200 bg-gray-50"
                />
              </div>
            )}
          </div>
        )}

        <button
          onClick={fileUpload}
          disabled={loading}
          className="mt-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2 px-8 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Predict"}
        </button>

        {result && (
          <div className="bg-white rounded-3xl p-6 mt-6 w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-green-700 mb-3">{result}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-green-50 p-4 rounded-xl shadow-inner">
                <h3 className="font-semibold text-gray-800 mb-2">Causes</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {causes.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-xl shadow-inner">
                <h3 className="font-semibold text-gray-800 mb-2">Preventive Measures</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {preventiveMeasures.map((measure, i) => (
                    <li key={i}>{measure}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-gradient-to-r from-purple-200 to-purple-100 p-4 rounded-xl shadow-inner text-center">
              <h3 className="font-semibold text-gray-800 mb-2">AI Model Training</h3>
              <p className="text-gray-700">
                Training Accuracy: <span className="font-bold">{trainingInfo.trainingAccuracy}%</span>
              </p>
              <p className="text-gray-700">
                Validation Accuracy: <span className="font-bold">{trainingInfo.validationAccuracy}%</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tuberculosis;
