// Service Worker: 离线缓存策略
const CACHE = 'seatgame-v1';
const PRECACHE = [
  './',
  './index.html',
  './prototype.html',
  './manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
  // 只缓存同源 HTML 文件（关卡生成是动态的，不需要缓存）
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('github.io') || req.url.includes('localhost')) {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
