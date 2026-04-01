/**
 * Image Conversion Utilities
 * Converts between image files and base64 format for API communication
 */

/**
 * Detect MIME type from file magic bytes
 * @param file - Image file to detect type for
 * @returns Promise<string> - Detected MIME type
 */
export const detectMimeTypeFromFile = (file: File | Blob): Promise<string> => {
  return new Promise((resolve) => {
    // Use file.type if available and valid
    if (file.type && file.type.startsWith('image/')) {
      resolve(file.type);
      return;
    }

    // If no type, detect from magic bytes
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      let mime = 'image/png'; // default
      
      if (header.startsWith('89504e47')) mime = 'image/png';
      else if (header.startsWith('ffd8ff')) mime = 'image/jpeg';
      else if (header.startsWith('47494638')) mime = 'image/gif';
      else if (header.startsWith('524946')) mime = 'image/webp';
      
      resolve(mime);
    };
    
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * Convert File or Blob to base64 string
 * @param file - Image file from input
 * @returns Promise<string> - Base64 encoded image string
 */
export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:image/...;base64," prefix if present
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      
      if (!base64 || base64.length === 0) {
        reject(new Error('Failed to convert file to base64: empty result'));
        return;
      }
      
      resolve(base64);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Failed to read file: ${error}`));
    };
    
    reader.onabort = () => {
      reject(new Error('File reading was aborted'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert base64 string to File
 * @param base64 - Base64 encoded string
 * @param filename - Name for the output file
 * @returns File - File object that can be used for download
 */
export const base64ToFile = (base64: string, filename: string = 'image.png'): File => {
  // Remove data URI prefix if present
  const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
  
  // Convert base64 to bytes
  const byteCharacters = atob(cleanBase64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  
  // Create blob and file
  const blob = new Blob([byteArray], { type: 'image/png' });
  return new File([blob], filename, { type: 'image/png' });
};

/**
 * Convert base64 to data URL for preview
 * @param base64 - Base64 encoded image string
 * @param mimeType - MIME type (default: image/png)
 * @returns string - Data URL that can be used in img src
 */
export const base64ToDataUrl = (base64: string, mimeType: string = 'image/png'): string => {
  // If already a data URL, return as is
  if (base64.startsWith('data:')) {
    return base64;
  }
  return `data:${mimeType};base64,${base64}`;
};

/**
 * Convert Data URL to base64
 * @param dataUrl - Data URL string
 * @returns string - Pure base64 string (without prefix)
 */
export const dataUrlToBase64 = (dataUrl: string): string => {
  if (dataUrl.includes(',')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
};

/**
 * Validate if file is a supported image format
 * @param file - File to validate
 * @returns boolean - True if supported image format
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Get image dimensions without loading full image
 * @param dataUrl - Data URL or base64 string
 * @returns Promise<{width: number, height: number}>
 */
export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Handle both data URLs and base64
    if (dataUrl.startsWith('data:')) {
      img.src = dataUrl;
    } else {
      img.src = `data:image/png;base64,${dataUrl}`;
    }
  });
};

/**
 * Compress image before sending
 * @param file - Original image file
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Promise<File> - Compressed image file
 */
export const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: file.type });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert image file to specific format
 * @param file - Original image file
 * @param targetFormat - Target MIME type (e.g., 'image/png', 'image/jpeg')
 * @returns Promise<File> - Converted image file
 */
export const convertImageFormat = (file: File, targetFormat: string = 'image/png'): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const extension = targetFormat.split('/')[1];
              const newFilename = file.name.split('.')[0] + '.' + extension;
              const convertedFile = new File([blob], newFilename, { type: targetFormat });
              resolve(convertedFile);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          targetFormat
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Create thumbnail from image
 * @param file - Original image file
 * @param width - Thumbnail width in pixels
 * @param height - Thumbnail height in pixels
 * @returns Promise<string> - Base64 encoded thumbnail
 */
export const createThumbnail = (
  file: File,
  width: number = 100,
  height: number = 100
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Calculate scaling to maintain aspect ratio
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width / 2) - (img.width / 2) * scale;
        const y = (height / 2) - (img.height / 2) * scale;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get file size in human readable format
 * @param bytes - File size in bytes
 * @returns string - Formatted file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Batch convert multiple files to base64
 * @param files - Array of image files
 * @returns Promise<string[]> - Array of base64 strings
 */
export const batchFileToBase64 = async (files: File[]): Promise<string[]> => {
  try {
    const results = await Promise.all(files.map(file => fileToBase64(file)));
    return results;
  } catch (error) {
    throw new Error(`Failed to batch convert files: ${error}`);
  }
};

/**
 * Extract pure Base64 string from data URI
 * Handles both data:image/... format and raw base64
 * @param imageBase64 - Base64 string (with or without data URI prefix)
 * @returns string - Pure Base64 string without data URI prefix
 */
export const extractBase64FromDataUri = (imageBase64: string): string => {
  if (!imageBase64) return '';
  
  if (imageBase64.startsWith('data:image')) {
    // Extract base64 from data:image/...;base64,... format
    const parts = imageBase64.split(',');
    return parts.length > 1 ? parts[1] : imageBase64;
  }
  
  if (imageBase64.startsWith('data:')) {
    const parts = imageBase64.split(',');
    return parts.length > 1 ? parts[1] : imageBase64;
  }
  
  return imageBase64;
};

/**
 * Validate if a string is Base64 format
 * @param str - String to validate
 * @returns boolean - true if valid Base64
 */
export const isValidBase64 = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false;
  
  try {
    // Try to decode and check length
    const decoded = atob(extractBase64FromDataUri(str));
    return decoded.length > 0;
  } catch {
    return false;
  }
};

/**
 * Download a Base64 image as a file
 * @param base64String - Base64 encoded image string
 * @param fileName - Name of the file to download
 * @param mimeType - MIME type (default: image/png)
 */
export const downloadBase64Image = (
  base64String: string,
  fileName: string,
  mimeType: string = 'image/png'
): void => {
  try {
    const pure64 = extractBase64FromDataUri(base64String);
    const byteCharacters = atob(pure64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.includes('.') ? fileName : `${fileName}.${mimeType.split('/')[1]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Failed to download image');
  }
};

/**
 * Convert Base64 to Blob for file operations
 * @param base64String - Base64 encoded image string
 * @param mimeType - MIME type (default: image/png)
 * @returns Blob - Blob object
 */
export const base64ToBlob = (
  base64String: string,
  mimeType: string = 'image/png'
): Blob => {
  const pure64 = extractBase64FromDataUri(base64String);
  const byteCharacters = atob(pure64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Detect MIME type from filename or base64 data
 * @param filename - File name or extension
 * @param base64String - Optional base64 string
 * @returns string - MIME type
 */
export const detectMimeType = (
  filename?: string,
  base64String?: string
): string => {
  // Try to detect from data URI
  if (base64String && base64String.startsWith('data:')) {
    const match = base64String.match(/^data:([^;]+)/);
    if (match) return match[1];
  }
  
  // Try to detect from filename
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
    };
    if (ext && mimeMap[ext]) {
      return mimeMap[ext];
    }
  }
  
  return 'image/png';
};

/**
 * Validate image dimensions
 * @param base64String - Base64 encoded image
 * @param minWidth - Minimum width requirement
 * @param minHeight - Minimum height requirement
 * @returns Promise<{ valid: boolean; width: number; height: number }>
 */
export const validateImageDimensions = async (
  base64String: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<{ valid: boolean; width: number; height: number }> => {
  return new Promise((resolve) => {
    const dataUri = base64ToDataUrl(base64String);
    const img = new Image();
    
    img.onload = () => {
      const valid = img.width >= minWidth && img.height >= minHeight;
      resolve({
        valid,
        width: img.width,
        height: img.height,
      });
    };
    
    img.onerror = () => {
      resolve({
        valid: false,
        width: 0,
        height: 0,
      });
    };
    
    img.src = dataUri;
  });
};

// Export all functions as a namespace for convenience
export const ImageUtils = {
  fileToBase64,
  base64ToFile,
  base64ToDataUrl,
  dataUrlToBase64,
  isValidImageFile,
  getImageDimensions,
  compressImage,
  convertImageFormat,
  createThumbnail,
  formatFileSize,
  batchFileToBase64,
  extractBase64FromDataUri,
  isValidBase64,
  downloadBase64Image,
  base64ToBlob,
  detectMimeType,
  validateImageDimensions,
};

export default ImageUtils;
