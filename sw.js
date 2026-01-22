self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("vulnerable-labs-v1").then(function (cache) {
      return cache.addAll(["/", "/index.html", "/home/index.html", "/assets/app.js", "/assets/styles.css"]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (resp) {
      return resp || fetch(event.request);
    })
  );
});
