// Spider Solitaire service worker — build 494e81b1
// Precaches the app shell so the game opens with no network; fonts are cached as they load.
const VERSION = 'spider-494e81b1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'spider-fonts').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Fonts: serve from cache, refresh in the background (stale-while-revalidate).
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open('spider-fonts').then(async (c) => {
        const hit = await c.match(e.request);
        const refresh = fetch(e.request).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(e.request, res.clone()); return res; }).catch(() => hit);
        return hit || refresh;
      })
    );
    return;
  }

  // App shell: cache first, network fallback (and cache what the network returns).
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
        if (res && res.ok) caches.open(VERSION).then(c => c.put(e.request, res.clone()));
        return res;
      }))
    );
  }
});
