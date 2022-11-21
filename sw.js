const filesToCache = ['/js/leaflet.js', '/js/main.js', '/js/map.js', '/css/leaflet.css', '/css/nav-menu.css', '/css/style.css'];

// This one stores an offline webpage in cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Take control of all pages under this SW's scope immediately, instead of waiting for reload/navigation.
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// This one loads the saved webpage when the client is offline
self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('/tile/')) {
    event.respondWith(
      caches.open('v1').then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        }).catch(function () {
          return caches.match(event.request);
        });
      })
    );
  } else {
    let cachedFileName = 'index.html';
    filesToCache.some((file) => {
      if (event.request.url.includes(file)) {
        cachedFileName = file;
        return true;
      }
    });
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(cachedFileName);
      })
    );
  }
});