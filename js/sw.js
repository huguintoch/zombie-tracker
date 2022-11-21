/* Service worker to cache files */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/index.html',
        '/css/style.css',
        '/css/leaflet.css',
        '/css/nav-menu.css',
        '/js/main.js',
        '/js/sw.js',
        '/js/map.js',
        '/js/leaflet.js',
      ]);
    })
  );
});

/* Add images to cache after fetching them */
self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('tile')) {
    event.respondWith(
      caches.open('v1').then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  }
});

// self.addEventListener("fetch", function(event) {
//   event.respondWith(
//     fetch(event.request).catch(function() {
//       return caches.match(event.request.url);
//     })
//   );
// });