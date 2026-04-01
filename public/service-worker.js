/* E-Afya Service Worker */
const CACHE_NAME = 'e-afya-v1';
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Only cache these specific files - don't cache routes
      return cache.addAll(urlsToCache).catch(() => {
        // Continue even if some files fail to cache
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and other non-http schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip non-GET/HEAD requests (cannot cache POST, PUT, DELETE, etc)
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    event.respondWith(fetch(request).catch(() => {
      return new Response('Network error', { status: 503 });
    }));
    return;
  }

  // Skip API requests - always go to network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => {
      return new Response('Network error', { status: 503 });
    }));
    return;
  }

  // For navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      // Try network first for latest content
      fetch(request)
        .then(response => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            // Only cache GET requests
            if (request.method === 'GET') {
              cache.put(request, responseToCache).catch(() => {
                // Silently fail if cache.put fails (e.g., from extension requests)
              });
            }
          });
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then(cachedResponse => {
            // If cached, return it
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not cached, return index.html (SPA fallback)
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // For other requests (assets, etc)
  event.respondWith(
    caches.match(request).then(response => {
      // Return cached response if available
      if (response) {
        return response;
      }

      return fetch(request)
        .then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            // Only cache GET requests
            if (request.method === 'GET') {
              cache.put(request, responseToCache).catch(() => {
                // Silently fail if cache.put fails (e.g., from extension requests)
              });
            }
          });

          return response;
        })
        .catch(() => {
          // Offline fallback - return cached or generic offline response
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || new Response('Offline - please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        });
    })
  );
});
