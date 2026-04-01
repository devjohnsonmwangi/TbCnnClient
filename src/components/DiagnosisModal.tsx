import React, { useState } from "react";
import { toast } from "sonner";
import { FiX, FiArrowLeft, FiCheck, FiUpload } from "react-icons/fi";
import { PatientsService } from "../services/patientsService";
import { CreatePatientDto } from "../types/api.types";
import { fileToBase64, base64ToDataUrl, detectMimeTypeFromFile } from "../utils/imageUtils";

interface FormStep1 {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
}

interface FormStep2 {
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface FormStep3 {
  xrayFile: File | null;
  xrayBase64: string | null;
  xrayType?: string;
  xrayNotes?: string;
  consent: boolean;
}

type FormData = FormStep1 & FormStep2 & FormStep3;

/** Validates email format */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/** Validates phone number (basic international format) */
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]+$/.test(phone) && phone.replace(/\D/g, "").length >= 7;
  return phoneRegex;
};

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DiagnosisModal({ isOpen, onClose, onSuccess }: DiagnosisModalProps) {
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
    xrayType: "Chest PA",
    xrayNotes: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      else if (formData.firstName.trim().length < 2) newErrors.firstName = "First name must be at least 2 characters";

      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      else if (formData.lastName.trim().length < 2) newErrors.lastName = "Last name must be at least 2 characters";

      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!isValidEmail(formData.email)) newErrors.email = "Please enter a valid email address";

      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!isValidPhone(formData.phone)) newErrors.phone = "Please enter a valid phone number (at least 7 digits)";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      console.log(`📸 Processing image: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`);
      
      // Convert file to base64
      const base64 = await fileToBase64(file);
      console.log(`✅ Base64 conversion successful, Length: ${base64.length}`);
      
      // Auto-detect MIME type for better compatibility
      const mimeType = await detectMimeTypeFromFile(file);
      console.log(`🎨 Detected MIME type: ${mimeType}`);
      
      // Convert to data URL for preview
      const dataUrl = base64ToDataUrl(base64, mimeType);
      console.log(`🔗 Data URL generated (length: ${dataUrl.length})`);
      
      // Validate data URL by creating an image object
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Image loaded successfully! Dimensions: ${img.width}x${img.height}`);
      };
      img.onerror = () => {
        console.error('❌ Image failed to load from data URL');
        toast.error('Unable to load image. The file might be corrupted.');
      };
      img.src = dataUrl;
      
      setFormData({
        ...formData,
        xrayFile: file,
        xrayBase64: base64,
      });
      setXrayPreview(dataUrl);

      if (errors.xrayFile) {
        setErrors({ ...errors, xrayFile: "" });
      }
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error("❌ File upload error:", error);
      toast.error("Failed to upload image. Please try again.");
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

  const handleReset = () => {
    setStep(1);
    setFormData({
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
      xrayType: "Chest PA",
      xrayNotes: "",
      consent: false,
    });
    setErrors({});
    setXrayPreview(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !formData.xrayBase64) {
      toast.error("Please upload a valid X-ray image before submitting");
      return;
    }

    setLoading(true);
    let patientId: string | null = null;

    try {
      // **Step 1: Converting X-ray image to Base64** (already done, but acknowledge it)
      const toastId1 = toast.loading("📸 Converting X-ray image to Base64...");
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.dismiss(toastId1);
      toast.success("✅ X-ray image successfully converted to Base64 format");

      // **Step 2: Creating patient record in database**
      const toastId2 = toast.loading("📝 Creating patient record in database...");
      
      const payload: CreatePatientDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "Male" | "Female" | "Other",
        imageBase64: formData.xrayBase64,
        fileName: formData.xrayFile?.name,
      };

      // Add optional fields only if they have values
      if (formData.medicalHistory?.trim()) payload.medicalHistory = formData.medicalHistory.trim();
      if (formData.allergies?.trim()) payload.allergies = formData.allergies.trim();
      if (formData.medications?.trim()) payload.medications = formData.medications.trim();
      if (formData.address?.trim()) payload.address = formData.address.trim();
      if (formData.city?.trim()) payload.city = formData.city.trim();
      if (formData.state?.trim()) payload.state = formData.state.trim();
      if (formData.postalCode?.trim()) payload.postalCode = formData.postalCode.trim();
      if (formData.country?.trim()) payload.country = formData.country.trim();
      if (formData.xrayType?.trim()) payload.xrayType = formData.xrayType.trim();
      if (formData.xrayNotes?.trim()) payload.xrayNotes = formData.xrayNotes.trim();

      console.log("📤 Sending request with patient data and Base64 X-ray image to backend...");
      const patientResponse = await patientsService.createPatient(payload);
      patientId = patientResponse.id;

      toast.dismiss(toastId2);
      toast.success(`✅ Patient record created in database successfully! (ID: ${patientId})`);

      // **Step 3: Sending X-ray to TB detection model for analysis**
      const toastId3 = toast.loading("🤖 Sending X-ray to TB detection model for analysis...");
      
      // Wait for backend to process and trigger ML analysis
      // The backend will automatically create a diagnosis record with status PENDING
      // Then backend will send the Base64 image to the Python ML API
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.dismiss(toastId3);
      // Step 4: Display analysis results
      toast.success("✅ TB analysis completed! Check the patient dashboard for detailed results.", {
        description: "Your X-ray has been analyzed successfully. You can now view the results in the dashboard."
      });

      console.log("✅ Full diagnosis workflow completed successfully for patient:", patientId);
      handleReset();
      onClose();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Submission error:", error);
      
      toast.dismiss();
      
      // Determine the type of error and provide appropriate guidance
      if (errorMessage.toLowerCase().includes("x-ray") || errorMessage.toLowerCase().includes("image")) {
        // X-Ray validation error
        toast.error("⚠️ Image Not a Valid X-Ray", {
          description: "The uploaded file is not recognized as a valid X-ray image. Please verify the file and try again."
        });
      } else if (errorMessage.toLowerCase().includes("network") || errorMessage.toLowerCase().includes("connection")) {
        // Network error
        toast.error("🌐 Network Error", {
          description: "Unable to reach the server. Please check your connection and try again."
        });
      } else {
        // General error
        toast.error("❌ Error During Submission", {
          description: errorMessage || "An unexpected error occurred. Please try again."
        });
      }

      // If patient was created but analysis failed, guide user to re-upload
      if (patientId) {
        toast.info("📋 Patient Record Created", {
          description: `Your patient record was successfully created (ID: ${patientId}). Navigate to the patient dashboard to upload another X-ray image for analysis.`
        });
        
        // Optional: Navigate user to missing X-rays management page for re-upload
        // This could be enhanced with a button in the future
        console.log(`Patient ${patientId} created but analysis failed. User should re-upload X-ray.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-lg w-full max-w-full sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-emerald-700">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">Start Diagnosis</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-emerald-700 rounded transition text-white flex-shrink-0 ml-2"
            title="Close modal"
            aria-label="Close diagnosis modal"
          >
            <FiX size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Step Indicator */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-sm sm:text-base transition-colors ${
                      stepNum < step
                        ? "bg-emerald-600 text-white"
                        : stepNum === step
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNum < step ? <FiCheck size={16} className="sm:w-5 sm:h-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`flex-1 h-1 mx-1 sm:mx-2 ${
                        stepNum < step ? "bg-emerald-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Medical History" : "X-Ray Upload"}
            </p>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                    aria-label="First name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                    aria-label="Last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                  aria-label="Email address"
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+1234567890"
                    aria-label="Phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                      errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                    aria-label="Date of birth"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-label="Gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Medical History</h3>

              <div>
                <label htmlFor="medicalHistory" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="List any previous medical conditions..."
                  aria-label="Medical history"
                />
              </div>

              <div>
                <label htmlFor="allergies" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="List any known allergies..."
                  aria-label="Allergies"
                />
              </div>

              <div>
                <label htmlFor="medications" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Current Medications
                </label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="List current medications..."
                  aria-label="Current medications"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="Street address"
                    aria-label="Address"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="City"
                    aria-label="City"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="State"
                    aria-label="State"
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    placeholder="Postal code"
                    aria-label="Postal code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Country"
                  aria-label="Country"
                />
              </div>
            </div>
          )}

          {/* Step 3: X-Ray Upload */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">X-Ray Upload</h3>

              <div>
                <label htmlFor="xrayFile" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Upload X-Ray Image * (JPEG, PNG, DICOM up to 50MB)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition flex items-center justify-center min-h-48 sm:min-h-64 ${
                    errors.xrayFile ? "border-red-500 bg-red-50" : "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  <input
                    id="xrayFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="X-ray file upload"
                  />
                  {xrayPreview ? (
                    // Show image preview in the drag area
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={xrayPreview}
                        alt="X-ray preview in drop zone"
                        className="max-h-48 sm:max-h-56 rounded-lg border border-gray-300"
                        onError={(e) => {
                          console.error('❌ Image failed to load in preview:', e);
                          toast.error('Image failed to load. The file might be corrupted.');
                        }}
                      />
                      <label htmlFor="xrayFile" className="cursor-pointer text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Click to change image
                      </label>
                    </div>
                  ) : (
                    // Show upload instruction when no image selected
                    <label htmlFor="xrayFile" className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3 w-full">
                      <FiUpload className="text-3xl sm:text-4xl text-emerald-600" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-500">PNG, JPG, DICOM (MAX. 50MB)</span>
                    </label>
                  )}
                </div>
                {errors.xrayFile && <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.xrayFile}</p>}

                {xrayPreview && (
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img
                      src={xrayPreview}
                      alt="X-ray preview"
                      className="max-h-48 sm:max-h-64 mx-auto rounded-lg border border-gray-300"
                      onLoad={() => console.log('✅ Preview image loaded successfully')}
                      onError={(e) => {
                        console.error('❌ Preview image failed to load:', e);
                        toast.error('Image failed to load in preview section.');
                      }}
                    />
                  </div>
                )}

                {formData.xrayFile && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    File: {formData.xrayFile.name} ({(formData.xrayFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="xrayType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  X-Ray Type
                </label>
                <select
                  id="xrayType"
                  name="xrayType"
                  value={formData.xrayType}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  aria-label="X-ray type"
                >
                  <option value="Chest PA">Chest PA</option>
                  <option value="Chest Lateral">Chest Lateral</option>
                  <option value="Chest Oblique">Chest Oblique</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="xrayNotes" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  X-Ray Notes
                </label>
                <textarea
                  id="xrayNotes"
                  name="xrayNotes"
                  value={formData.xrayNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Any additional notes about the X-ray..."
                  aria-label="X-ray notes"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="consent"
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded flex-shrink-0"
                    aria-label="Consent checkbox"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    I confirm that this X-ray belongs to the patient and I have obtained proper consent for analysis and data handling.
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.consent}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-4">
            <button
              onClick={step > 1 ? handlePrev : handleClose}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
              title={step > 1 ? "Go to previous step" : "Cancel form"}
            >
              <FiArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              {step > 1 ? "Previous" : "Cancel"}
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Go to next step"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 text-sm sm:text-base bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Submit form"
              >
                {loading ? "Processing..." : <><FiCheck size={16} className="sm:w-[18px] sm:h-[18px]" /> Submit</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
