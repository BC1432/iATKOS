const version = 'v1.0.0'; // Incrementa esto cada vez que actualices el Service Worker
const staticCacheName = `site-static-${version}`;
const assets = [
  // Lista de archivos a cachear
  '/',
  '/index.html',
  '/icon-192x192.png',
  '/icon-256x256.png',
  '/icon-384x384.png',
  '/icon-512x512.png'
  // etc.
];

// Instalación del Service Worker y manejo de la caché de activos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log(`Caching shell assets (version: ${version})`);
      cache.addAll(assets);
    })
  );
});

// Activación del Service Worker y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key)) // Elimina versiones antiguas de la caché
      );
    })
  );
  console.log(`Service Worker ${version} activado`);
});

// Fetch event para obtener datos de la caché si es posible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheResponse => {
      return cacheResponse || fetch(event.request);
    })
  );
});

// Evento push para mostrar notificaciones
self.addEventListener('push', function(event) {
  const promiseChain = self.registration.showNotification('New guide', {
    body: 'New guide available!',
    icon: 'icon-256x256.png',
    tag: 'guide'
  });

  event.waitUntil(promiseChain);
});

// Evento click en la notificación para navegar a la página
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === 'https://www.iatkos.in/') {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow('https://www.iatkos.in/');
    }
  });

  event.waitUntil(promiseChain);
});