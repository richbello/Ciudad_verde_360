// Verde360 — service worker: instala la app y la deja funcionando sin internet.
// Guarda la página, la librería del mapa, las fuentes y los pedazos de mapa ya vistos.
const CACHE = "verde360-v5";
const BASE = ["./", "./index.html", "./manifest.json", "./icon.svg",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"];
const EXTERNOS = ["unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com", "tile.openstreetmap.org"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Red primero (datos frescos); sin conexión, usa la copia guardada.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const propio = url.origin === location.origin;
  const externo = EXTERNOS.some(h => url.hostname.endsWith(h));
  if (!propio && !externo) return;              // backend y demás: siempre en vivo
  e.respondWith(
    // «no-cache»: revisa siempre con el servidor si hay versión nueva (no usa la copia vieja del navegador)
    fetch(e.request, propio ? { cache: "no-cache" } : undefined).then(r => {
      if (r.ok || r.type === "opaque") {
        const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia));
      }
      return r;
    }).catch(() => caches.match(e.request).then(m => m || (e.request.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
