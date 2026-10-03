// Network-first service worker so lab/code updates are picked up immediately.
// (Cache-first would pin students to stale app.js/CSS after you push fixes.)
var CACHE = "vulnerable-labs-v2";

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(["/", "/index.html", "/home/index.html", "/assets/app.js", "/assets/styles.css"]);
    })
  );
});

self.addEventListener("activate", function (event) {
  // Drop old caches from previous versions.
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(function (resp) {
        // Cache a copy of successful same-origin responses for offline fallback.
        if (resp && resp.ok && resp.type === "basic") {
          var copy = resp.clone();
          caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
        }
        return resp;
      })
      .catch(function () { return caches.match(event.request); })
  );
});
