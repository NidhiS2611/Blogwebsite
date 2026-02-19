import admin from "firebase-admin";
import firebaseServiceAccount from "./firebaseServiceAccount.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  });
}

export default admin;
