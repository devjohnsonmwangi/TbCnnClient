import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import './index.css';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { store } from './redux/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <Toaster
          position="top-right"
          richColors
          expand
          closeButton
          theme="light"
        />
        <App />
      </QueryProvider>
    </Provider>
  </React.StrictMode>
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  // Unregister all old service workers to clear cache
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js?v=' + Date.now())
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Clear old cache storage if needed
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    }).catch(() => {
      // Cache API not available
    });
  });
}
