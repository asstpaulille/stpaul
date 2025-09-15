const CACHE_NAME = 'as-saint-paul-lille-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com/',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Network-first strategy for data files
  if (requestUrl.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(networkResponse => {
            // Got a response from the network.
            // Update the cache with the new response.
            cache.put(event.request, networkResponse.clone());
            // And return the network response.
            return networkResponse;
          })
          .catch(() => {
            // Network request failed, probably offline.
            // Try to serve from cache.
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // Cache-first strategy for everything else
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, go to network.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response to cache.
            // Opaque responses (from no-cors requests like CDNs) can't have their status checked, but are fine to cache.
            if (!response || (response.status !== 200 && response.type !== 'opaque') || response.type === 'error') {
              return response;
            }
            
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // We don't cache requests to the AI Studio CDN as they are handled by the browser cache.
                if (!event.request.url.startsWith('https://aistudiocdn.com')) {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});