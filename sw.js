/* Schatzinsel v3: Versionscache für Hauptspiel und spielbaren Kartentest. */
const CACHE_VERSION = "schatzinsel-v3-20261105";
const PRECACHE = [
  "./", "./index.html", "./kartentest.html", "./manifest.webmanifest",
  "./res/style.css", "./res/kartentest.css",
  "./res/app.js", "./res/pwa.js", "./res/kartentest.js", "./res/karte.js",
  "./res/karte-dschungel.js", "./res/karte-unterwasser.js", "./res/karte-weltraum.js",
  "./res/aufgaben-dschungel.js", "./res/aufgaben-unterwasser.js", "./res/aufgaben-weltraum.js",
  "./res/icons/icon-192.png", "./res/icons/icon-512.png", "./res/icons/apple-touch-icon.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("schatzinsel-") && key !== CACHE_VERSION).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => (await caches.match(request, { ignoreSearch: true })) || (await caches.match("./index.html"))));
  } else {
    event.respondWith(caches.match(request, { ignoreSearch: true }).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)));
      }
      return response;
    })));
  }
});
