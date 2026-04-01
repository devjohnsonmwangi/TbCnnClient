# Redux Store - Quick Start Guide

## 🚀 Your Redux Store is Ready!

Everything is configured and set up. Here's how to use it:

---

## 1. Start Development

```bash
# Navigate to client directory
cd client

# Start development server
pnpm start
```

The app will open at `http://localhost:3000` with Redux DevTools support.

---

## 2. Basic Usage in Components

### Import hooks:
```typescript
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { predictTB, resetPrediction } from '@/redux/slices/tbSlice';
```

### Use in component:
```typescript
export function MyComponent() {
  const dispatch = useAppDispatch();
  const { loading, prediction, error } = useAppSelector(state => state.tb);

  const handlePredict = async (file: File) => {
    await dispatch(predictTB(file));
  };

  const handleReset = () => {
    dispatch(resetPrediction());
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {prediction && <p>Prediction: {prediction.prediction}</p>}
    </div>
  );
}
```

---

## 3. Store Structure

```
Redux Store (RootState)
└── tb (TB Slice)
    ├── loading: boolean
    ├── prediction: { prediction, confidence, heatmap }
    ├── error: string | null
    └── success: boolean
```

---

## 4. Available Actions

| Action | Type | Usage |
|--------|------|-------|
| `predictTB(file)` | Async Thunk | `dispatch(predictTB(imageFile))` |
| `resetPrediction()` | Sync | `dispatch(resetPrediction())` |
| `clearError()` | Sync | `dispatch(clearError())` |

---

## 5. Complete Prediction Flow

```typescript
const handleUploadAndPredict = async (file: File) => {
  // 1. Dispatch async thunk
  const result = await dispatch(predictTB(file));

  // 2. Check result status
  if (result.meta.requestStatus === 'fulfilled') {
    // Prediction successful
    console.log('Success!', prediction);
  } else {
    // Prediction failed
    console.log('Error:', error);
  }

  // 3. Reset when needed
  dispatch(resetPrediction());
};
```

---

## 6. Redux DevTools Usage

### Chrome Extension:
1. Install from [Redux DevTools Chrome Extension](https://chrome.google.com/webstore)
2. Open DevTools (F12)
3. Go to "Redux" tab

### What you can do:
- 📊 See all dispatched actions
- 🔍 Inspect state changes
- ⏱️ Time travel debug (jump to any previous state)
- 🎬 Replay actions
- 📝 Dispatch actions manually

### Tips:
```
- Look for 'tb/predict/pending' action when starting
- Look for 'tb/predict/fulfilled' when done
- Check state panel to see prediction object
```

---

## 7. Environment Configuration

### .env file (already created):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

### Update if needed:
- Change `REACT_APP_API_URL` to your backend server
- The value is used in `tbSlice.ts` for API calls

---

## 8. File Organization

```
src/
├── redux/
│   ├── store.ts              # ⭐ Main store config
│   ├── hooks.ts              # ⭐ useAppDispatch, useAppSelector
│   ├── slices/
│   │   └── tbSlice.ts        # ⭐ TB state & actions
│   └── README.md
├── services/
│   └── tbApi.ts              # API client (uses dispatch in slices)
├── components/
│   └── TBPredictionComponent.tsx  # ⭐ Example: using Redux
├── pages/
│   ├── Tuberculosis.tsx       # TB detection page
│   └── LandingPage.tsx
├── App.tsx                     # ⭐ Provider wrapping
├── index.tsx
├── tsconfig.json               # ⭐ TypeScript config
├── .env                        # ⭐ Environment variables
└── REDUX_SETUP.md
```

---

## 9. Common Patterns

### Pattern 1: Upload & Analyze
```typescript
const [file, setFile] = useState<File | null>(null);
const dispatch = useAppDispatch();
const { loading, prediction, error } = useAppSelector(state => state.tb);

<input 
  type="file"
  onChange={(e) => setFile(e.target.files?.[0] || null)}
/>

<button onClick={() => file && dispatch(predictTB(file))}>
  {loading ? 'Analyzing...' : 'Analyze'}
</button>
```

### Pattern 2: Error Handling
```typescript
const { error } = useAppSelector(state => state.tb);
const dispatch = useAppDispatch();

useEffect(() => {
  if (error) {
    // Show error toast
    showNotification(error, 'error');
    // Clear error after showing
    dispatch(clearError());
  }
}, [error, dispatch]);
```

### Pattern 3: Success Feedback
```typescript
const { success, prediction } = useAppSelector(state => state.tb);

useEffect(() => {
  if (success && prediction) {
    showNotification('Analysis complete!', 'success');
  }
}, [success, prediction]);
```

---

## 10. Debugging Tips

### Check Redux DevTools:
1. Look for action `tb/predict/pending` - predicting started
2. Look for action `tb/predict/fulfilled` - success
3. Look for action `tb/predict/rejected` - error
4. Click to see state before/after

### In Console:
```javascript
// Access store directly (if in Redux DevTools)
// See action dispatches and state changes

// Or use Redux DevTools browser extension
```

### TypeScript Issues:
- Make sure importing from `@/redux/hooks` not `redux`
- Full paths work: `from './redux/hooks'`

---

## 11. Next Steps

1. ✅ **Now**: Redux store is ready to use
2. 🔜 **Next**: Update `.env` with your backend URL
3. 🔜 **Then**: Test with `pnpm start`
4. 🔜 **Upload**: Test TB prediction with sample chest X-rays
5. 🔜 **Deploy**: Build and deploy `pnpm build`

---

## 12. Production Checklist

- [ ] Update `.env` with production API URL
- [ ] Disable Redux DevTools action tracing (optional)
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test success responses
- [ ] Check bundle size
- [ ] Run `pnpm build`
- [ ] Test built version locally
- [ ] Deploy to production

---

## 13. Useful Commands

```bash
# Install dependencies
pnpm install

# Start dev server (with hot reload)
pnpm start

# Build for production
pnpm build

# Run tests
pnpm test

# Check for TypeScript errors
pnpm types

# Format code
pnpm format
```

---

## 14. Resources

- [Redux Documentation](https://redux.js.org)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools-extension)
- [Axios Documentation](https://axios-http.com)

---

## 15. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Check import path, verify file exists |
| State not updating | Check Redux DevTools for action dispatch |
| API call fails | Update REACT_APP_API_URL in .env |
| TypeScript errors | Use hooks from `@/redux/hooks` |
| DevTools not showing | Ensure Redux DevTools extension installed |

---

**You're all set!** 🎉

Start developing with:
```bash
pnpm start
```

Open Redux DevTools (F12 → Redux tab) to see your actions in real-time.

---

## Quick Reference

### State Access:
```typescript
const state = useAppSelector(state => state.tb);
// { loading, prediction, error, success }
```

### Dispatch Action:
```typescript
const dispatch = useAppDispatch();
await dispatch(predictTB(file));
```

### Reset State:
```typescript
dispatch(resetPrediction());
```

**Happy coding! 🚀**
