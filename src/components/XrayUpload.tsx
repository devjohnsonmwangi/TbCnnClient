import React, { useState, useRef, useCallback } from "react";
import { FiUpload, FiX, FiCheck, FiImage } from "react-icons/fi";

interface XrayUploadProps {
  onFilesSelected: (files: File[]) => void;
}

function XrayUpload({ onFilesSelected }: XrayUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  const validateFiles = (newFiles: File[]): File[] => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    newFiles.forEach((file) => {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.push(`${file.name}: Invalid file type. Please upload JPEG, PNG, or WebP images.`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name}: File size exceeds 10MB limit.`);
        return;
      }

      // Check total files
      if (files.length + validFiles.length >= MAX_FILES) {
        newErrors.push(`Maximum ${MAX_FILES} files allowed.`);
        return;
      }

      validFiles.push(file);
    });

    setErrors(newErrors);
    return validFiles;
  };

  const generatePreview = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({
        ...prev,
        [file.name]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles = validateFiles(fileArray);

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);

      // Generate previews
      validFiles.forEach((file) => {
        generatePreview(file);
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);

    const newPreviews = { ...previews };
    delete newPreviews[fileName];
    setPreviews(newPreviews);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-emerald-600 bg-emerald-50"
            : "border-gray-300 hover:border-emerald-400 bg-gray-50 hover:bg-emerald-50"
        }`}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleBrowseClick}
              title="Click to browse files"
              className="bg-emerald-100 p-4 rounded-full hover:bg-emerald-200 transition transform hover:scale-110"
            >
              <FiUpload className="text-3xl text-emerald-600" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Drag and Drop Your X-rays</h3>
            <p className="text-gray-600">
              Drag your X-ray images here or <button
                type="button"
                onClick={handleBrowseClick}
                className="text-emerald-600 font-semibold hover:underline"
              >
                browse from device
              </button>
            </p>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>✓ Supported formats: JPEG, PNG, WebP</p>
            <p>✓ Maximum file size: 10MB</p>
            <p>✓ Up to {MAX_FILES} images allowed</p>
          </div>
        </div>

        <label htmlFor="file-input" className="sr-only">
          Upload X-ray images
        </label>
        <input
          id="file-input"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
          placeholder="Select X-ray images"
        />
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
          {errors.map((error, index) => (
            <p key={index} className="text-red-700 text-sm">
              • {error}
            </p>
          ))}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FiCheck className="text-emerald-600 text-xl" />
            Selected Files ({files.length}/{MAX_FILES})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                {/* Image Preview */}
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {previews[file.name] ? (
                    <img
                      src={previews[file.name]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <FiImage className="text-4xl" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    title="Remove image"
                    onClick={() => removeFile(file.name)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    aria-label={`Remove ${file.name}`}
                  >
                    <FiX className="text-lg" />
                  </button>

                  {/* Success Badge */}
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white p-2 rounded-full">
                    <FiCheck className="text-lg" />
                  </div>
                </div>

                {/* File Info */}
                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm truncate">{file.name}</p>
                  <p className="text-gray-600 text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No files selected */}
      {files.length === 0 && errors.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No files selected yet. Upload X-ray images to begin analysis.</p>
        </div>
      )}
    </div>
  );
}

export default XrayUpload;
