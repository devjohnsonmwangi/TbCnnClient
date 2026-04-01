/**
 * Image Conversion Utilities
 * Converts between image files and base64 format for API communication
 */

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
      resolve(base64);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Failed to read file: ${error}`));
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
};

export default ImageUtils;
