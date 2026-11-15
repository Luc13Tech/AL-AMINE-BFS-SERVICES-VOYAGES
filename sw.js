/* Service worker — Al Amine BFS Services Voyages
   Incrémenter CACHE_VERSION à chaque livraison pour forcer la mise à jour. */
var CACHE_VERSION = "v1";
var CACHE_NAME = "al-amine-bfs-" + CACHE_VERSION;

var PRECACHE = [
  "./",
  "index.html",
  "omra.html",
  "hajj.html",
  "services.html",
  "videos.html",
  "photos.html",
  "agence.html",
  "contact.html",
  "mentions-legales.html",
  "assets/css/style.css",
  "assets/js/main.js",
  "favicon.svg",
  "manifest.webmanifest",
  "assets/img/photos/logo-al-amine.png",
  "assets/img/icons/icon-192.png",
  "assets/img/icons/icon-512.png",
  "assets/img/icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Chaque fichier est mis en cache séparément : un fichier absent ne bloque pas l'installation.
      return Promise.all(
        PRECACHE.map(function (url) {
          return cache.add(new Request(url, { cache: "reload" })).catch(function () {});
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key.indexOf("al-amine-bfs-") === 0 && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;            // polices, cartes, WhatsApp… : réseau direct
  if (request.headers.has("range")) return;                    // lecture vidéo
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) return;         // vidéos non mises en cache

  // Pages : réseau d'abord, cache ensuite (contenu toujours à jour, consultable hors ligne)
  if (request.mode === "navigate" || (request.headers.get("accept") || "").indexOf("text/html") !== -1) {
    event.respondWith(
      fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      }).catch(function () {
        return caches.match(request, { ignoreSearch: true }).then(function (cached) {
          return cached || caches.match("index.html");
        });
      })
    );
    return;
  }

  // CSS, JS, images : cache d'abord, mise à jour en arrière-plan
  event.respondWith(
    caches.match(request).then(function (cached) {
      var network = fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      }).catch(function () {
        return cached;
      });
      return cached || network;
    })
  );
});
