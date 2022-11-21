/* Service worker to cache files */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/offlineIndex.html',
        '/css/style.css',
        '/css/nav-menu.css',
      ]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match("offlineIndex.html");
    })
  );
});