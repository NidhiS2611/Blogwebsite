import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyBRdjGj_kuBWJJ9F695VrLUPeJ1iaw3F1c",
  authDomain: "blogweb-1bb35.firebaseapp.com",
  projectId: "blogweb-1bb35",
  storageBucket: "blogweb-1bb35.firebasestorage.app",
  messagingSenderId: "724692448623",
  appId: "1:724692448623:web:7f1adbae146fe1075b649a",
  measurementId: "G-XD5DMQL72G"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
