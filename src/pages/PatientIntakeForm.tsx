import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiArrowLeft, FiUpload, FiCheck } from "react-icons/fi";
import { PatientsService } from "../services/patientsService";
import { CreatePatientDto } from "../types/api.types";

interface FormStep1 {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
}

interface FormStep2 {
  medicalHistory: string;
  allergies: string;
  medications: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface FormStep3 {
  xrayFile: File | null;
  xrayBase64: string | null;
  xrayType: string;
  xrayNotes: string;
  consent: boolean;
}

type FormData = FormStep1 & FormStep2 & FormStep3;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function PatientIntakeForm() {
  const navigate = useNavigate();
  const patientsService = new PatientsService();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [xrayPreview, setXrayPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    medicalHistory: "",
    allergies: "",
    medications: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    xrayFile: null,
    xrayBase64: null,
    xrayType: "chest",
    xrayNotes: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (currentStep === 3) {
      if (!formData.xrayFile && !formData.xrayBase64) {
        newErrors.xrayFile = "Please upload an X-ray image";
      }
      if (!formData.consent) {
        newErrors.consent = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFormData({
        ...formData,
        xrayFile: file,
        xrayBase64: base64,
      });
      setXrayPreview(base64);

      if (errors.xrayFile) {
        setErrors({ ...errors, xrayFile: "" });
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("File upload error:", error);
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !formData.xrayBase64) {
      return;
    }

    setLoading(true);
    try {
      const payload: CreatePatientDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        medicalHistory: formData.medicalHistory || undefined,
        allergies: formData.allergies || undefined,
        medications: formData.medications || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        postalCode: formData.postalCode || undefined,
        country: formData.country || undefined,
        imageBase64: formData.xrayBase64,
        xrayType: formData.xrayType || undefined,
        xrayNotes: formData.xrayNotes || undefined,
        fileName: formData.xrayFile?.name,
      };

      await patientsService.createPatient(payload);
      
      toast.success("Patient registered successfully!");
      setTimeout(() => {
        navigate("/physician-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4 pt-20 sm:pt-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Patient Registration
          </h1>
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    stepNum < step
                      ? "bg-emerald-600 text-white"
                      : stepNum === step
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum < step ? <FiCheck /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      stepNum < step ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-600">
            Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Medical History" : "X-Ray Upload"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+1234567890"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Medical History & Address
              </h2>

              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Previous medical conditions, surgeries, etc."
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Known allergies (medications, food, etc.)"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Current medications and dosages"
                  rows={2}
                />
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Address Information
                </h3>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      placeholder="Postal code"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                X-Ray Image Upload
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
                {xrayPreview ? (
                  <div className="space-y-4">
                    <img
                      src={xrayPreview}
                      alt="X-ray preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-green-600 font-medium">
                      ✓ Image uploaded successfully
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setXrayPreview(null);
                        setFormData({ ...formData, xrayFile: null, xrayBase64: null });
                      }}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Remove and upload another
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FiUpload className="mx-auto text-4xl text-gray-400" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        Drag and drop your X-ray image here
                      </p>
                      <p className="text-gray-500 text-sm">or</p>
                    </div>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="cursor-pointer text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                        Click to browse
                      </span>
                    </label>
                    <p className="text-gray-500 text-xs">
                      Supported formats: JPEG, PNG, DICOM (Max 50MB)
                    </p>
                  </div>
                )}
              </div>

              {errors.xrayFile && (
                <p className="text-red-500 text-sm">{errors.xrayFile}</p>
              )}

              <div className="border-t pt-6 space-y-4">
                <div>
                  <label htmlFor="xrayType" className="block text-sm font-medium text-gray-700 mb-1">
                    X-Ray Type
                  </label>
                  <select
                    id="xrayType"
                    name="xrayType"
                    value={formData.xrayType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  >
                    <option value="chest">Chest PA</option>
                    <option value="chest_lateral">Chest Lateral</option>
                    <option value="abdominal">Abdominal</option>
                    <option value="lumbar">Lumbar Spine</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes / Comments
                  </label>
                  <textarea
                    name="xrayNotes"
                    value={formData.xrayNotes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="Any additional notes about the X-ray"
                    rows={2}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that the information provided is accurate and that I consent to
                    the analysis of this X-ray image for TB screening purposes. I understand that
                    this is not a substitute for professional medical advice.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-red-500 text-sm mt-2">{errors.consent}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                step === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientIntakeForm;
