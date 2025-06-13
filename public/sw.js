
const CACHE_NAME = 'homework-system-pwa-basic-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Basic install event (for PWA readiness)');
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Basic activate event (for PWA readiness)');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated and ready');
      self.clients.claim(); 
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching from network (basic handler):', event.request.url);
  event.respondWith(fetch(event.request));
});
