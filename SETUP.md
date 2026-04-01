# Client Setup Guide - TB Detection System

## Configuration Overview

This client has been configured with:
- **Redux Toolkit** - For state management and API queries
- **Tailwind CSS** - For styling with TB-focused color theme
- **Axios** - For HTTP requests
- **React Router** - For navigation

## Project Structure

```
src/
├── redux/
│   ├── store.ts              # Redux store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   └── slices/
│       └── tbSlice.ts        # TB prediction state and async thunks
├── services/
│   └── tbApi.ts              # API service layer
├── components/
│   └── TBPredictionComponent.tsx  # Example TB prediction component
└── pages/
    ├── Tuberculosis.tsx      # TB detection page
    └── LandingPage.tsx       # Landing page
```

## Redux Setup

### Store Configuration
The Redux store is configured in `src/redux/store.ts` with a TB slice for:
- Image prediction state
- Loading states
- Error handling
- Success tracking

### TB Slice Features
Location: `src/redux/slices/tbSlice.ts`

**Async Thunks:**
- `predictTB(imageFile)` - Send image to backend and get prediction

**Actions:**
- `resetPrediction()` - Clear prediction state
- `clearError()` - Clear error messages

**State:**
```typescript
{
  loading: boolean;
  prediction: {
    prediction: string;      // "Normal" or "Abnormal"
    confidence: number;      // 0-1
    heatmap?: string;        // Base64 encoded image
  } | null;
  error: string | null;
  success: boolean;
}
```

## Using Redux in Components

### Import Hooks
```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { predictTB, resetPrediction } from '../redux/slices/tbSlice';
```

### Dispatch Async Action
```typescript
const dispatch = useAppDispatch();

// In your component
await dispatch(predictTB(imageFile));
```

### Access State
```typescript
const { loading, prediction, error, success } = useAppSelector(state => state.tb);
```

## Tailwind Color Scheme

TB-focused custom colors available:
- `tb-primary` (#1f2937) - Dark gray-blue for main text
- `tb-secondary` (#dc2626) - Red for abnormal/alerts
- `tb-success` (#16a34a) - Green for normal results
- `tb-warning` (#ea580c) - Orange for caution
- `tb-light` (#f3f4f6) - Light backgrounds
- `tb-accent` (#2563eb) - Blue for buttons/accents

### Usage Examples
```html
<div class="bg-tb-light text-tb-primary">
  <button class="bg-tb-accent text-white">Analyze</button>
</div>

<div class="border-2 border-tb-success text-tb-success">
  Normal Result
</div>
```

## Environment Configuration

Create a `.env` file in the client root:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

Or copy from the template:
```bash
cp .env.example .env
```

## API Configuration

API calls are made through `src/services/tbApi.ts`:

```typescript
import { tbApi } from '../services/tbApi';

// In your component or thunk
const result = await tbApi.predict(imageFile);
```

## Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build
```

## Component Example

See `src/components/TBPredictionComponent.tsx` for a complete example of:
- File upload handling
- Redux dispatch usage
- Loading states
- Error handling
- Result display with TB-specific styling

## Backend Integration

The Redux setup expects the backend to provide:
- POST `/predict/tuberculosis` - Image prediction endpoint
- GET `/health` - Health check
- GET `/tb/info` - Model information (optional)

Form data format for predictions:
```
Content-Type: multipart/form-data
Body: file (image file)
```

Expected response format:
```json
{
  "prediction": "Normal" | "Abnormal",
  "confidence": 0.95,
  "heatmap": "base64_encoded_image_optional"
}
```

## Next Steps

1. Update backend API endpoints in `src/services/tbApi.ts` if needed
2. Customize the landing page and Tuberculosis page
3. Add additional Redux slices if needed (e.g., auth, user preferences)
4. Deploy to production (build and serve the dist folder)
