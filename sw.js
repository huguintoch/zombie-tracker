// This one stores an offline webpage in cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/offlineIndex.html", "/css/style.css", "/css/nav-menu.css"]);
    })
  );
});

// This one loads the saved webpage when the client is offline
self.addEventListener("fetch", function (event) {
  console.log('@fetch', event);
  if (event.request.url.includes('/tile/')) {
    event.respondWith(
      caches.open("v1").then(function (cache) {
        return fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  } else {
    let cachedFileName = "";
    if (event.request.url.includes("/css/nav-menu.css")) {
      cachedFileName = "/css/nav-menu.css";
    } else if (event.request.url.includes("/css/style.css")) {
      cachedFileName = "/css/style.css";
    } else {
      cachedFileName = "/offlineIndex.html";
    }

    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(cachedFileName);
      })
    );
  }
});