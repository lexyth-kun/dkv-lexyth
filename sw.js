/* ============================================================================
 * BINA BANGSA NEXUS — SERVICE WORKER (PWA OFFLINE SHELL & SMART CACHE)
 * ============================================================================ */
const SW_VERSION = "bb-nexus-pwa-v34";
const STATIC_CACHE = `bb-static-${SW_VERSION}`;
const RUNTIME_CACHE = `bb-runtime-${SW_VERSION}`;

const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/about/",
  "/about/index.html",
  "/dashboard-guru.html",
  "/dashboard/",
  "/kumpul-tugas.html",
  "/kumpul-tugas/",
  "/materi-siswa.html",
  "/materi-siswa/",
  "/database-tugas.html",
  "/database-tugas/",
  "/absensi.html",
  "/absensi/",
  "/panduan-guru.html",
  "/script-mengajar-kelas.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/images/logo.png",
  "/images/adrian-hologram.webp",
  "/assets/fonts/Inter-Variable.ttf",
  "/assets/dashboard-fonts.css",
  "/assets/dashboard-ui.css",
  "/assets/lusion-portal.css",
  "/assets/lusion-portal.js",
  "/assets/lusion-experience.css",
  "/assets/lusion-experience.js",
  "/assets/pwa-mobile.css",
  "/assets/pwa-shell.js",
  "/assets/bina-bangsa-seed.js",
  "/assets/bina-bangsa-db.js",
  "/assets/pdf-materi-embed.js",
  "/assets/kuis-materi.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.allSettled(
        APP_SHELL_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Jangan intercept Range video streaming atau upload/API mutasi Apps Script
  if (req.headers.has("range")) return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  if (
    url.hostname.includes("script.google.com") ||
    url.hostname.includes("script.googleusercontent.com") ||
    url.pathname.endsWith(".mp4")
  ) {
    return;
  }

  // Navigasi HTML, drive-config.json, serta core DB/UI JS & CSS -> Network First agar semua perangkat selalu pakai logika sinkronisasi terbaru
  const isNav = req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/" || url.pathname === "/about" || url.pathname === "/about/" || url.pathname.endsWith("/drive-config.json");
  const isCoreAsset =
    url.pathname.endsWith("/assets/bina-bangsa-db.js") ||
    url.pathname.endsWith("/assets/bina-bangsa-seed.js") ||
    url.pathname.endsWith("/assets/dashboard-ui.css") ||
    url.pathname.endsWith("/assets/index-D0mw0hQR.js") ||
    url.pathname.endsWith("/assets/lusion-experience.js") ||
    url.pathname.endsWith("/assets/lusion-experience.css");

  if (isNav || isCoreAsset) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req, { ignoreSearch: true });
          if (cached) return cached;
          if (isCoreAsset) return Response.error();
          if (url.pathname.includes("kumpul-tugas")) {
            return (await caches.match("/kumpul-tugas.html")) || caches.match("/");
          }
          if (url.pathname.includes("dashboard")) {
            return (await caches.match("/dashboard-guru.html")) || caches.match("/");
          }
          return caches.match("/dashboard-guru.html") || caches.match("/index.html");
        })
    );
    return;
  }

  // Same-origin static assets & CDN fonts/icons -> Stale-While-Revalidate
  const isCacheableOrigin =
    url.origin === self.location.origin ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("fonts.cdnfonts.com") ||
    url.hostname.includes("unpkg.com") ||
    url.hostname.includes("cdn.jsdelivr.net") ||
    url.hostname.includes("cdnjs.cloudflare.com");

  if (isCacheableOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const netFetch = fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              const copy = res.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || netFetch;
      })
    );
  }
});
