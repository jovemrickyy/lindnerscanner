const C='lindner-v25';
const A=['./','./index.html','./logo.png','./manifest.json','./icon-192.png','./icon-512.png','./firebase-config.js','./jspdf.umd.min.js','./top-gard-plus.png','./mellis-vet.jpg','./probiotico-pet.jpg'];
self.addEventListener('install',e=>{
  // cada arquivo é guardado separadamente: se algum faltar, a instalação NÃO falha
  e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(
    fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request))
  );
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus' in c)return c.focus()}
    return clients.openWindow('./');
  }));
});
