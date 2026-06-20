/*
 * StayEasy service worker — minimal, update-safe offline shell.
 *
 * Strategy:
 *  - Navigations: network-first, falling back to the cached app shell when
 *    offline. This means a new deploy is always shown when online (no stale UI).
 *  - Hashed build assets (/assets/*): cache-first — safe because the filename
 *    changes whenever the content does.
 *  - Everything else passes through to the network.
 */
const CACHE = 'stayeasy-v1'
const SHELL = new URL('./', self.registration.scope).pathname // app shell (index.html)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.add(SHELL)).catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // Navigations → network-first with offline shell fallback.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req)
        } catch {
          const cache = await caches.open(CACHE)
          return (await cache.match(SHELL)) || Response.error()
        }
      })(),
    )
    return
  }

  // Content-hashed assets → cache-first.
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE)
        const hit = await cache.match(req)
        if (hit) return hit
        const res = await fetch(req)
        if (res.ok) cache.put(req, res.clone())
        return res
      })(),
    )
  }
})
