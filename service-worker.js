const CACHE_NAME = 'world-pulse-v14-perfect-glass';
const SHELL_ASSETS = [
  './',
  './index.html',
  './style.css?v=20260830-perfect-glass-1',
  './script.js?v=20260830-perfect-glass-1',
  './manifest.webmanifest',
  './assets/map/world-v1.geojson'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(SHELL_ASSETS.map(asset => cache.add(asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isWeather = url.hostname.includes('open-meteo.com');
  const isNews = url.hostname.includes('gdeltproject.org');
  const isMap = url.pathname.endsWith('.geojson') || url.pathname.endsWith('.json');

  if (isWeather || isNews) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.mode === 'navigate' || isMap || url.origin === self.location.origin) {
    if (request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/style.css') || url.pathname.endsWith('/script.js')) {
      event.respondWith(networkFirst(request));
      return;
    }
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}
