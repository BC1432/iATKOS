self.addEventListener('push', function(event) {
    const promiseChain = self.registration.showNotification('New guide', {
      body: 'New guide',
      icon: 'icon-256x256.png',
      tag: 'guide'
    });
  
    event.waitUntil(promiseChain);
  });
  
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