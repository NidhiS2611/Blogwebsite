importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
  
  apiKey: "AIzaSyBRdjGj_kuBWJJ9F695VrLUPeJ1iaw3F1c",
  authDomain: "blogweb-1bb35.firebaseapp.com",
  projectId: "blogweb-1bb35",
  storageBucket: "blogweb-1bb35.firebasestorage.app",
  messagingSenderId: "724692448623",
  appId: "1:724692448623:web:7f1adbae146fe1075b649a"

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png',
  });
});