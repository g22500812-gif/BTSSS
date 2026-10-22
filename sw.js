const CACHE = "btsss-v1";
const CORE = ["./", "./index.html", "./manifest.json", "./icon-192-1.png", "./icon-512-1.png"];/manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.pathname.startsWith("/api/")) return;
  e.respondWith(
    caches.match(r).then(hit => hit || fetch(r).then(res => {
      // кешуємо й CDN (three.js, шрифти) після першого завантаження
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
