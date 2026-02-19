const admin = require('../firebase/firebaseadmin'); // ye wahi file hai jo tu ne abhi banayi

const sendNotification = async (fcmToken, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent to:", fcmToken);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
    return null;
  }
};

module.exports = sendNotification;