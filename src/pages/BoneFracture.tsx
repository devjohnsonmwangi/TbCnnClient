import React, { useState } from "react";

const BoneFracture = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useState<string | null>(null);

  const causes = [
    "Accidents or falls",
    "Sports injuries",
    "Osteoporosis or weakened bones",
    "Repetitive stress on bones",
  ];

  const preventiveMeasures = [
    "Use protective gear during activities",
    "Maintain strong bones with calcium and vitamin D",
    "Exercise to improve bone strength and balance",
    "Avoid risky behaviors and high-impact activities",
  ];

  const trainingInfo = {
    trainingAccuracy: 93.5,
    validationAccuracy: 90.8,
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result as string);
      setPreview(URL.createObjectURL(selectedFile));
      setHeatmap(null);
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
        body: JSON.stringify({ model: "bone_fracture", image: base64 }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setResult(data.prediction);
        setHeatmap(data.heatmap_base64 || null);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex flex-col items-center p-3">
      <header className="flex flex-col items-center text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-700 mb-3">
          AI Bone Fracture Detector
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl leading-relaxed">
          Upload an X-ray image to detect fractures and analyze bone conditions
        </p>
        <div className="w-28 h-1 bg-yellow-600 rounded-full mt-4 animate-pulse"></div>
      </header>

      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 flex flex-col items-center space-y-6">
        <label htmlFor="bone-file-upload" className="block text-lg font-semibold text-yellow-700 mb-3">
          Select X-ray Image
        </label>
        <input
          id="bone-file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-yellow-100 file:text-yellow-700
                     hover:file:bg-yellow-200 cursor-pointer
                     border border-yellow-100 rounded-lg w-1/2 p-2"
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
                <p className="font-semibold text-gray-700 mb-2">Grad-CAM Heatmap</p>
                <img
                  src={`data:image/jpeg;base64,${heatmap}`}
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
          className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-200 hover:from-yellow-500 hover:to-yellow-300 text-white font-semibold py-2 px-8 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Predict"}
        </button>

        {result && (
          <div className="bg-white rounded-3xl p-6 mt-6 w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-yellow-700 mb-3">{result}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-yellow-50 p-4 rounded-xl shadow-inner">
                <h3 className="font-semibold text-gray-800 mb-2">Causes</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {causes.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl shadow-inner">
                <h3 className="font-semibold text-gray-800 mb-2">Preventive Measures</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {preventiveMeasures.map((measure, i) => (
                    <li key={i}>{measure}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-200 p-4 rounded-xl shadow-inner text-center">
              <h3 className="font-semibold text-gray-800 mb-2">AI Model Training & Limitations</h3>
              <p className="text-gray-700 mb-2">
                Training Accuracy: <span className="font-bold">{trainingInfo.trainingAccuracy}%</span>
              </p>
              <p className="text-gray-700 mb-2">
                Validation Accuracy: <span className="font-bold">{trainingInfo.validationAccuracy}%</span>
              </p>
              <p className="text-red-600 font-medium mt-2">
                Important: The AI model can identify fractures but may not always accurately pinpoint the exact fracture line. Use X-ray interpretation with caution.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoneFracture;
