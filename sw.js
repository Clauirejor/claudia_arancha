const CACHE_NAME = 'claudia-v1';
const ASSETS = [
  '/claudia_arancha/',
  '/claudia_arancha/index.html',
  '/claudia_arancha/manifest.json',
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
      if(response && response.status === 200 && e.request.method === 'GET'){
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});
