// backend/firebase/firebaseAdmin.js
const admin = require("firebase-admin");

if (!process.env.SERVICE_ACCOUNT) {
  throw new Error("SERVICE_ACCOUNT env variable not found");
}

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;