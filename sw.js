/**
 * SERVICE WORKER FOR 3D PORTFOLIO PWA
 * Caches core shell assets for instant load and offline capability.
 * Employs Stale-While-Revalidate for dynamic assets and Cache-First for shell.
 */

const CACHE_NAME = 'portfolio-cache-v2.6';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/animations.css',
  './js/data.js',
  './js/particles.js',
  './js/three-hero.js',
  './js/projects.js',
  './js/coverflow-3d.js',
  './js/xray-viewer.js',
  './js/main.js',
  './js/admin.js',
  './js/command-palette.js',
  './js/terminal.js',
  './js/resume.js',
  './data/projects.json',
  './manifest.webmanifest',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.png',
  './assets/projects/radpose-chest.jpg',
  './assets/projects/radpose-abdomen.jpg',
  './assets/projects/radpose-cspine.jpg',
  './assets/projects/radpose-graphic-banner.jpg',
  './assets/projects/wtk-music-graphic-banner.jpg',
  './assets/projects/rtpi-graphic-banner.jpg',
  './assets/projects/phumtify-graphic-banner.jpg',
  './assets/projects/bloom-care-graphic-banner.jpg',
  './assets/projects/mt5-ea-graphic-banner.jpg',
  './assets/projects/radiar-xr-graphic-banner.jpg',
  './assets/projects/election-live-graphic-banner.jpg',
  './assets/projects/photobooth-graphic-banner.jpg',
  './assets/projects/badminton-graphic-banner.jpg',
  './assets/projects/dochub-graphic-banner.jpg',
  './assets/projects/lucky-wheel-graphic-banner.jpg',
  './assets/projects/phumshop-graphic-banner.jpg',
  './assets/projects/smo-attendance-graphic-banner.jpg',
  './assets/projects/live-phumshop02.png',
  './assets/projects/live-radpose3d.png',
  './assets/projects/live-music-pi.png',
  './assets/projects/live-rtpi.png'
];

// External High-Performance CDN Assets for 3D & Advanced Interactions
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js',
  'https://cdn.jsdelivr.net/npm/@popperjs/core@2/dist/umd/popper.min.js',
  'https://cdn.jsdelivr.net/npm/tippy.js@6/dist/tippy.umd.min.js',
  'https://cdn.jsdelivr.net/npm/tippy.js@6/dist/tippy.css',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
];

// Offline Fallback SVG placeholder for broken external images
const OFFLINE_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#0f1026"/>
  <rect x="20" y="20" width="760" height="460" rx="20" fill="none" stroke="#00f2fe" stroke-width="2" stroke-dasharray="8 8"/>
  <circle cx="400" cy="220" r="48" fill="rgba(0, 242, 254, 0.1)" stroke="#00f2fe" stroke-width="3"/>
  <path d="M375 220 H425 M400 195 V245" stroke="#00f2fe" stroke-width="3" stroke-linecap="round"/>
  <text x="400" y="310" text-anchor="middle" fill="#00f2fe" font-family="'Orbitron', sans-serif" font-size="22" font-weight="700" letter-spacing="3">OFFLINE PREVIEW</text>
  <text x="400" y="340" text-anchor="middle" fill="#9aa5be" font-family="'Inter', sans-serif" font-size="14">ภาพตัวอย่างโปรเจค (เชื่อมต่ออินเทอร์เน็ตเพื่อดูภาพเต็ม)</text>
</svg>`;

// Install Event: Precache core assets and warm cache CDN libraries
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Warm CDN cache reliably in parallel
      await Promise.all(
        CDN_ASSETS.map(url =>
          fetch(url, { mode: 'no-cors' })
            .then(res => {
              if (res) return cache.put(url, res);
            })
            .catch(err => {
              console.warn('[SW] Warm CDN asset failed:', url, err);
            })
        )
      );

      return cache.addAll(CORE_ASSETS).then(() => self.skipWaiting());
    })
  );
});

// Activate Event: Clear old cache versions & take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and non-http(s) protocols
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Handle local shell assets: Cache-First, then network fallback
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background using URL string to avoid navigation request mode conflicts
          fetch(request.url).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
            }
          }).catch(() => {/* Ignore network revalidation failure */});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        }).catch(() => {
          // If offline and request is an HTML page
          if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html').then(res => res || caches.match('index.html'));
          }
        });
      })
    );
    return;
  }

  // Handle External Assets (Unsplash images, Google Fonts, CDNs)
  // Stale-While-Revalidate with image fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          }
          return networkResponse;
        }).catch(() => {
          if (cachedResponse) return cachedResponse;
          return new Response(OFFLINE_IMAGE_SVG, {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Generic external fetch: try network first, cache fallback (support opaque cross-origin scripts/fonts)
  event.respondWith(
    fetch(request).then((response) => {
      if (response && (response.status === 200 || response.type === 'opaque')) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
      }
      return response;
    }).catch(() => {
      return caches.match(request);
    })
  );
});

// Listen for message to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
