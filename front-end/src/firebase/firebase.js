import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAexj_q_eSd1viPZqnt5tbC4yEwG1sLqR0",
  authDomain: "blog-b4e98.firebaseapp.com",
  projectId: "blog-b4e98",
  storageBucket: "blog-b4e98.appspot.com",
  messagingSenderId: "1061457257071",
  appId: "1:1061457257071:web:b3bad165e124419d60239a",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
