/*
 * Safari Lab - service worker (Stage 13).
 *
 * DOCTRINE: cache the APP SHELL ONLY. Cross-origin requests (ad scripts, consent
 * scripts, ad containers) are NEVER cached or intercepted. Same-origin
 * navigations are network-first (fresh online, cached offline), same-origin
 * static assets are stale-while-revalidate. A precached /offline page is the
 * last resort.
 *
 * This SW does NOT call skipWaiting: a new version waits until all tabs close,
 * so an update can never take over during an active gym session.
 */
const VERSION = 'safari-lab-v1';
const OFFLINE_URL = '/offline/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      try {
        await cache.add(OFFLINE_URL);
      } catch {
        /* offline page will be cached on first successful navigation */
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never touch cross-origin requests (ads, fonts CDNs, anything external).
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  if (['script', 'style', 'font', 'image'].includes(req.destination)) {
    event.respondWith(staleWhileRevalidate(req));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    const offline = await cache.match(OFFLINE_URL);
    return offline ?? Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);
  return cached ?? (await network) ?? Response.error();
}
