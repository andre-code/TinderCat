const SHELL_CACHE_NAME = 'shell-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';

/*
 * Installation 
 */
self.addEventListener('install', event => {
  // Resources that will be always be cached 😉
  const shellCache = caches.open(SHELL_CACHE_NAME).then( cache => {
    return cache.addAll([
      '/',
      'index.html',
      'css/styles.css',
      'js/app.js',
    ]);
  });

  // Forces the waiting service worker to become the active service worker.
  self.skipWaiting();
  event.waitUntil(shellCache);
});

/*
 * Activation
 */
self.addEventListener("activate", event => {
  // Delete old cache 🥶🥶
  const deleteOldCache = caches.keys().then( cacheNames => {
    return Promise.all(
      cacheNames.map( cacheName => {
        if (SHELL_CACHE_NAME !== cacheName &&  cacheName.startsWith("shell-")) {
          return caches.delete(cacheName);
        }
      })
    );
  });

  event.waitUntil(deleteOldCache);
});

/*
 * Fetch
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( myCache => {
      // Return from cache otherwise from network 👌
      return myCache || fetch(event.request)
      .then( response => {
        // success response, codes 2xx, 4xx, 5xx etc...
        return response;
      }).catch( () => {
        // ... here is where the magic happens 🧙‍ 
        // If both fail, show a generic fallback:
        return new Response(
          '[{"url": "offline"}]',
          {
            headers: {
              'content-type': 'application/json',
          }
        });
      })
    })
  );
});
