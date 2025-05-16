importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCkOTn-SRxV5j6yN5FwGVp7RgPxHg96wdc",
    authDomain: "peter-noti.firebaseapp.com",
    projectId: "peter-noti",
    storageBucket: "peter-noti.firebasestorage.app",
    messagingSenderId: "535823655228",
    appId: "1:535823655228:web:a554980a3f1ce29600fe39",
    measurementId: "G-K2MPMERYL8"
  });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});