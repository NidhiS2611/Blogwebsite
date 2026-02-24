// backend/firebase/firebaseAdmin.js
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(
  __dirname,
  '../serviceAccountKey.json'
));
console.log(serviceAccount);





admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;