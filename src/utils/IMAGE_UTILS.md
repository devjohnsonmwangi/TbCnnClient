# Image Utilities Documentation

## Overview

The `imageUtils.ts` module provides a comprehensive set of utilities for converting, processing, and managing images in the TB CNN Detection System frontend.

---

## Functions

### Core Conversion Functions

#### `fileToBase64(file: File | Blob): Promise<string>`

Converts an image File or Blob to base64 string for API transmission.

**Parameters**:
- `file` - Image file from input element

**Returns**: Promise resolving to base64 string

**Usage**:
```typescript
import { fileToBase64 } from '@/utils/imageUtils';

const file = event.target.files[0];
const base64 = await fileToBase64(file);
// Send to API
await fetch('/predict/tuberculosis', {
  method: 'POST',
  body: JSON.stringify({ image_base64: base64 })
});
```

---

#### `base64ToFile(base64: string, filename: string = 'image.png'): File`

Converts base64 string back to File object for download or further processing.

**Parameters**:
- `base64` - Base64 encoded string (with or without data URI prefix)
- `filename` - Optional filename for the file

**Returns**: File object

**Usage**:
```typescript
import { base64ToFile } from '@/utils/imageUtils';

const base64String = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...';
const file = base64ToFile(base64String, 'heatmap.png');

// Download the file
const url = URL.createObjectURL(file);
const a = document.createElement('a');
a.href = url;
a.download = file.name;
a.click();
```

---

#### `base64ToDataUrl(base64: string, mimeType: string = 'image/png'): string`

Converts base64 to data URL for use in `<img src="">` tags.

**Parameters**:
- `base64` - Base64 string (pure, without prefix)
- `mimeType` - Optional MIME type (default: 'image/png')

**Returns**: Data URL string

**Usage**:
```typescript
import { base64ToDataUrl } from '@/utils/imageUtils';

const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...';
const dataUrl = base64ToDataUrl(base64);

<img src={dataUrl} alt="Prediction heatmap" />
```

---

#### `dataUrlToBase64(dataUrl: string): string`

Converts data URL back to pure base64 string.

**Parameters**:
- `dataUrl` - Data URL string

**Returns**: Pure base64 string

**Usage**:
```typescript
import { dataUrlToBase64 } from '@/utils/imageUtils';

const dataUrl = 'data:image/png;base64,iVBORw0KGgo...';
const base64 = dataUrlToBase64(dataUrl);
```

---

### Validation Functions

#### `isValidImageFile(file: File): boolean`

Validates if a file is a supported image format.

**Parameters**:
- `file` - File to validate

**Returns**: boolean

**Supported formats**: PNG, JPEG, JPG, GIF, WebP

**Usage**:
```typescript
import { isValidImageFile } from '@/utils/imageUtils';

const file = event.target.files[0];
if (isValidImageFile(file)) {
  // Process image
  predict(file);
} else {
  alert('Please upload a valid image file');
}
```

---

### Image Information Functions

#### `getImageDimensions(dataUrl: string): Promise<{width: number, height: number}>`

Gets image dimensions without loading the full image.

**Parameters**:
- `dataUrl` - Data URL or base64 string

**Returns**: Promise resolving to object with width and height

**Usage**:
```typescript
import { getImageDimensions } from '@/utils/imageUtils';

const dimensions = await getImageDimensions(imageDataUrl);
console.log(`Image size: ${dimensions.width}x${dimensions.height}`);

if (dimensions.width < 200) {
  alert('Image is too small (minimum 200x200)');
}
```

---

#### `formatFileSize(bytes: number): string`

Converts file size in bytes to human-readable format.

**Parameters**:
- `bytes` - File size in bytes

**Returns**: Formatted string (e.g., "2.5 MB")

**Usage**:
```typescript
import { formatFileSize } from '@/utils/imageUtils';

const file = event.target.files[0];
const fileSize = formatFileSize(file.size);
console.log(`File size: ${fileSize}`);
```

---

### Image Processing Functions

#### `compressImage(file: File, quality: number = 0.8): Promise<File>`

Compresses an image while maintaining format and dimensions.

**Parameters**:
- `file` - Original image file
- `quality` - Compression quality 0-1 (default: 0.8)

**Returns**: Promise resolving to compressed File

**Usage**:
```typescript
import { compressImage } from '@/utils/imageUtils';

const file = event.target.files[0];
const compressed = await compressImage(file, 0.7);
console.log(`Original: ${formatFileSize(file.size)}`);
console.log(`Compressed: ${formatFileSize(compressed.size)}`);

// Send compressed file
await predict(compressed);
```

---

#### `convertImageFormat(file: File, targetFormat: string = 'image/png'): Promise<File>`

Converts image to a different format.

**Parameters**:
- `file` - Original image file
- `targetFormat` - Target MIME type (e.g., 'image/jpeg', 'image/png')

**Returns**: Promise resolving to converted File

**Usage**:
```typescript
import { convertImageFormat } from '@/utils/imageUtils';

const jpgFile = event.target.files[0];
const pngFile = await convertImageFormat(jpgFile, 'image/png');
console.log(`Converted to: ${pngFile.type}`);
```

---

#### `createThumbnail(file: File, width: number = 100, height: number = 100): Promise<string>`

Creates a thumbnail preview of an image.

**Parameters**:
- `file` - Original image file
- `width` - Thumbnail width in pixels (default: 100)
- `height` - Thumbnail height in pixels (default: 100)

**Returns**: Promise resolving to data URL

**Usage**:
```typescript
import { createThumbnail } from '@/utils/imageUtils';

const file = event.target.files[0];
const thumbnail = await createThumbnail(file, 150, 150);

<img src={thumbnail} alt="Preview" style={{ width: '150px' }} />
```

---

### Batch Operations

#### `batchFileToBase64(files: File[]): Promise<string[]>`

Converts multiple files to base64 strings.

**Parameters**:
- `files` - Array of image files

**Returns**: Promise resolving to array of base64 strings

**Usage**:
```typescript
import { batchFileToBase64 } from '@/utils/imageUtils';

const files = Array.from(fileInput.files);
const base64Array = await batchFileToBase64(files);

// Send multiple predictions
const predictions = await Promise.all(
  base64Array.map(b64 => predictTB(b64))
);
```

---

## Complete Example: Image Upload Component

```typescript
import React, { useState } from 'react';
import { 
  fileToBase64, 
  base64ToDataUrl, 
  isValidImageFile, 
  formatFileSize,
  compressImage 
} from '@/utils/imageUtils';

export function ImageUploadComponent() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) return;

    // Validate
    if (!isValidImageFile(selectedFile)) {
      alert('Please select a valid image file');
      return;
    }

    // Show file info
    setInfo(`Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`);

    // Compress if large
    let processedFile = selectedFile;
    if (selectedFile.size > 5 * 1024 * 1024) { // > 5MB
      processedFile = await compressImage(selectedFile, 0.7);
      setInfo(`Compressed to: ${formatFileSize(processedFile.size)}`);
    }

    // Create preview
    const base64 = await fileToBase64(processedFile);
    const dataUrl = base64ToDataUrl(base64);
    setPreview(dataUrl);

    setFile(processedFile);
  };

  const handlePredict = async () => {
    if (!file) return;

    const base64 = await fileToBase64(file);
    // Send to Redux/API
    console.log('Sending prediction for:', file.name);
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />}
      {info && <p>{info}</p>}
      
      <button onClick={handlePredict} disabled={!file}>
        Analyze
      </button>
    </div>
  );
}
```

---

## Usage in Redux

```typescript
import { fileToBase64 } from '@/utils/imageUtils';

export const predictTB = createAsyncThunk(
  'tb/predict',
  async (imageFile: File) => {
    // Convert to base64 automatically
    const base64Image = await fileToBase64(imageFile);
    
    // Send to API
    const response = await axios.post('/predict/tuberculosis', {
      image_base64: base64Image
    });
    
    return response.data;
  }
);
```

---

## Best Practices

### 1. Always Validate Input
```typescript
if (!isValidImageFile(file)) {
  // Show error
  return;
}
```

### 2. Compress Large Images
```typescript
if (file.size > 3 * 1024 * 1024) { // > 3MB
  file = await compressImage(file, 0.7);
}
```

### 3. Handle Errors
```typescript
try {
  const base64 = await fileToBase64(file);
} catch (error) {
  console.error('Conversion failed:', error);
  setError('Failed to process image');
}
```

### 4. Clean Up Data URLs
```typescript
// When done with preview
if (preview && preview.startsWith('blob:')) {
  URL.revokeObjectURL(preview);
  setPreview(null);
}
```

### 5. Use TypeScript
```typescript
// Good - typed and safe
const base64: string = await fileToBase64(file);

// Avoid - untyped
const base64: any = await fileToBase64(file);
```

---

## Performance Tips

| Operation | Time | Notes |
|-----------|------|-------|
| fileToBase64 | ~50-200ms | Depends on file size |
| compressImage | ~100-500ms | Larger reduction = longer |
| createThumbnail | ~50-150ms | Fast operation |
| getImageDimensions | ~30ms | Very fast |
| convertImageFormat | ~100-300ms | Depends on format |

**Optimization Tips**:
- Use compression for files > 3MB
- Lazy load image processing
- Cache thumbnails
- Debounce file operations

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| FileReader | ✅ | ✅ | ✅ | ✅ |
| Canvas | ✅ | ✅ | ✅ | ✅ |
| Blob | ✅ | ✅ | ✅ | ✅ |
| Image | ✅ | ✅ | ✅ | ✅ |

All utilities work in all modern browsers.

---

## API Reference

### Export Options

**Named imports** (Recommended):
```typescript
import { fileToBase64, base64ToFile } from '@/utils/imageUtils';
```

**Namespace import**:
```typescript
import { ImageUtils } from '@/utils/imageUtils';
const base64 = await ImageUtils.fileToBase64(file);
```

**Default import**:
```typescript
import ImageUtils from '@/utils/imageUtils';
const base64 = await ImageUtils.fileToBase64(file);
```

---

## Troubleshooting

### Issue: "Failed to read file"
- Check file permissions
- Ensure file is readable
- Try a different file

### Issue: "Failed to convert image"
- Ensure image format is valid
- Check browser canvas support
- Clear cache and try again

### Issue: "Image dimensions undefined"
- Wait for image to load
- Verify data URL format
- Check image file integrity

---

## Future Enhancements

- [ ] WebGL-based image processing
- [ ] Batch processing queue
- [ ] Image filters (brightness, contrast)
- [ ] Rotation and transformation
- [ ] EXIF data extraction
- [ ] Progressive image loading

---

**Last Updated**: March 30, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
