
const CACHE = 'ei-examenes-v1';
self.addEventListener('install', e=>{
  e.waitUntil((async()=>{
    const c = await caches.open(CACHE);
    const scope = self.registration.scope;
    await c.addAll([
      scope, scope+'index.html',
      scope+'assets/css/styles.css',
      scope+'assets/js/app.js',
      scope+'students/index.html',
      scope+'parents/index.html',
      scope+'admin/index.html',
      scope+'plans/index.html',
      scope+'checkout/index.html'
    ]);
  })());
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
