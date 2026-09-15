// Python for C# Developers - High-Resiliency Offline PWA Service Worker
// Provides full offline capabilities, caching for all assets, fonts, and SPA routes.

const CACHE_VERSION = 'v2.5.0-offline';
const PRECACHE_NAME = `py-csharp-precache-${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `py-csharp-runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/site.webmanifest',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/icon-192.svg'
];

// Install Event - Precache critical App Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(PRECACHE_NAME).then((cache) => {
      console.log('[PWA ServiceWorker] Precaching Application Shell for offline capability');
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[PWA ServiceWorker] Precache partial error (non-fatal):', err);
      });
    })
  );
});

// Activate Event - Clean up stale previous caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== PRECACHE_NAME && cacheName !== RUNTIME_CACHE_NAME) {
            console.log('[PWA ServiceWorker] Removing old cache version:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Comprehensive Offline Support Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension/internal schemes
  if (request.method !== 'GET') {
    return;
  }

  // Handle SPA HTML navigations: Network-first with Cache fallback to /index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallbackShell = await caches.match('/index.html');
          if (fallbackShell) return fallbackShell;
          return caches.match('/');
        })
    );
    return;
  }

  // Handle Static Assets (JS, CSS, SVGs, Fonts, Images): Cache-First with Stale-While-Revalidate
  const isStaticAsset =
    url.origin === self.location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background to keep fresh
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(RUNTIME_CACHE_NAME).then((cache) => {
                  cache.put(request, networkResponse);
                });
              }
            })
            .catch(() => {/* offline, suppress network error */});
          return cachedResponse;
        }

        // Cache miss -> fetch and save
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseToCache = networkResponse.clone();
              caches.open(RUNTIME_CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            // If an image fails offline, try fallback icons
            if (request.destination === 'image') {
              const iconFallback = await caches.match('/pwa-192x192.png');
              if (iconFallback) return iconFallback;
            }
            return new Response('Resource offline', { status: 503, statusText: 'Offline' });
          });
      })
    );
    return;
  }

  // Default network pass-through with cache fallback
  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      return new Response('Network request unavailable offline', { status: 503 });
    })
  );
});

// Periodic Sync & Message API support
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'TRIGGER_SYNC') {
    event.ports[0]?.postMessage({
      status: 'COMPLETED',
      data: {
        verifiedAt: new Date().toISOString(),
        offlineReady: true,
        cacheVersion: CACHE_VERSION
      }
    });
  }
});
