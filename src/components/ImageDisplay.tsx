import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'sonner';
import { base64ToDataUrl, downloadBase64Image, isValidBase64 } from '../utils/imageUtils';

interface ImageDisplayProps {
  /** Base64 encoded image string (with or without data:image prefix) */
  base64Image?: string | null;
  /** Alternative data URI format */
  dataUri?: string | null;
  /** Alt text for accessibility */
  alt?: string;
  /** Title/label for the image */
  title?: string;
  /** CSS classes for the container */
  containerClassName?: string;
  /** CSS classes for the image element */
  imageClassName?: string;
  /** Enable download button */
  downloadable?: boolean;
  /** File name for download */
  downloadFileName?: string;
  /** Enable zoom/modal on click */
  zoomable?: boolean;
  /** MIME type for proper handling */
  mimeType?: string;
  /** Show loading state while image loads */
  showLoadingState?: boolean;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback on load error */
  onError?: (error: Error) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  base64Image,
  dataUri,
  alt = 'Image',
  title,
  containerClassName = 'w-full rounded-lg overflow-hidden bg-gray-100',
  imageClassName = 'w-full h-auto',
  downloadable = false,
  downloadFileName = 'image.png',
  zoomable = false,
  mimeType = 'image/png',
  showLoadingState = true,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(showLoadingState);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Determine which image source to use
  const sourceData = dataUri || base64Image;

  useEffect(() => {
    if (!sourceData) {
      setError('No image data provided');
      setIsLoading(false);
      return;
    }

    try {
      // Validate Base64 if needed
      if (base64Image && !dataUri) {
        if (!isValidBase64(base64Image)) {
          throw new Error('Invalid Base64 image format');
        }
      }

      // Convert to data URI if needed
      const url = dataUri || base64ToDataUrl(sourceData, mimeType);
      setImageUrl(url);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      setImageUrl(null);
      onError?.(error);
    }
  }, [sourceData, dataUri, base64Image, mimeType, onError]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
    onLoad?.();
  };

  const handleImageError = () => {
    const err = new Error('Failed to load image');
    setError(err.message);
    setIsLoading(false);
    onError?.(err);
  };

  const handleDownload = () => {
    try {
      if (!sourceData) {
        toast.error('No image data available to download');
        return;
      }
      downloadBase64Image(sourceData, downloadFileName, mimeType);
      toast.success('Image downloaded successfully');
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Failed to download image';
      toast.error(err);
      console.error('Download error:', error);
    }
  };

  // Error state
  if (error) {
    return (
      <div className={`${containerClassName} flex items-center justify-center p-8`}>
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading image</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // No image state
  if (!imageUrl) {
    return (
      <div className={`${containerClassName} flex items-center justify-center p-8`}>
        <div className="text-center text-gray-500">
          <p className="font-semibold">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Display */}
      <div className={containerClassName}>
        {/* Title */}
        {title && (
          <div className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">{title}</p>
          </div>
        )}

        {/* Image Container */}
        <div className="relative bg-black flex items-center justify-center">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                <p className="text-white text-sm">Loading image...</p>
              </div>
            </div>
          )}

          {/* Image */}
          <img
            src={imageUrl}
            alt={alt}
            className={imageClassName}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Action Buttons */}
        {(downloadable || zoomable) && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2 justify-end">
            {zoomable && (
              <button
                onClick={() => setIsZoomed(true)}
                title="Zoom image"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition font-bold text-lg"
                aria-label="Zoom image"
              >
                +
              </button>
            )}
            {downloadable && (
              <button
                onClick={handleDownload}
                title="Download image"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition"
                aria-label="Download image"
              >
                <FiDownload size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="max-w-4xl max-h-screen relative">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition text-3xl font-bold"
              aria-label="Close zoom"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDisplay;
