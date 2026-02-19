importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({

  apiKey: "AIzaSyAexj_q_eSd1viPZqnt5tbC4yEwG1sLqR0",
  authDomain: "blog-b4e98.firebaseapp.com",
  projectId: "blog-b4e98",
  storageBucket: "blog-b4e98.appspot.com",
  messagingSenderId: "1061457257071",
  appId: "1:1061457257071:web:b3bad165e124419d60239a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png',
  });
});