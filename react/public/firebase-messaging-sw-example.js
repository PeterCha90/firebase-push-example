importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "****",
    authDomain: "****",
    projectId: "****",
    storageBucket: "****",
    messagingSenderId: "****",
    appId: "****",
    measurementId: "****"
  });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg',
  };
  
  // Frontend에 메시지 전달 - 앱 내부에서 메세지를 확인하고 싶은 경우.
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage({
        messageType: 'push-received',
        notification: payload.notification,
      });
    });
  });

  self.registration.showNotification(notificationTitle, notificationOptions);
});