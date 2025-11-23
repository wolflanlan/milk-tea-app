
const CACHE_NAME = 'milk-tea-journal-v1';

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event: Cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // We try to cache the core files. 
        // Note: CDN resources (React, Tailwind) will be cached dynamically upon first use below.
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network first, then Cache, then Offline
// For a robust offline app that relies on CDNs, we use a strategy where we cache 
// everything we successfully fetch.
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests that might cause issues or non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // Return cached response if found
        if (response) {
          // Optional: We can still fetch in background to update cache (Stale-while-revalidate)
          // But for pure offline stability, returning cache is priority.
          fetch(event.request).then((networkResponse) => {
             if(networkResponse && networkResponse.status === 200) {
                 cache.put(event.request, networkResponse.clone());
             }
          }).catch(() => {}); // Eat errors if offline

          return response;
        }

        // Otherwise, fetch from network
        return fetch(event.request).then((networkResponse) => {
          // If valid response, cache it for next time
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic' && networkResponse.type !== 'cors' && networkResponse.type !== 'opaque'
          ) {
            return networkResponse;
          }

          // Cache the new resource (like the CDN scripts)
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
