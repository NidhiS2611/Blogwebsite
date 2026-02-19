const Notification = require("../models/notificationmodel");
const User = require("../models/usermodel");
const sendNotification = require("./sendNotification");

const notifyOnFollow = async ({ senderId, receiverId }) => {
  try {
    // sender = jisne follow kiya
    const sender = await User.findById(senderId).select("name");

    // receiver = jisko follow kiya
    const receiver = await User.findById(receiverId).select(
      "fcmToken notificationSettings"
    );

    if (!sender || !receiver) return;

    // 🔹 STEP 1: ALWAYS CREATE DB NOTIFICATION (silent)
    const notification = await Notification.create({
      receiver: receiverId,
      sender: senderId,
      type: "FOLLOW",
      message: `${sender.name} started following you`,
      link: `/profile/${senderId}`,
      isRead: false,
      isPushSent: false,
    });

    // 🔹 STEP 2: CHECK PUSH PERMISSION
    const isPushAllowed =
      receiver.fcmToken &&
      receiver.notificationSettings?.follow === true;
      console.log( "receiver.notificationSettings", receiver.notificationSettings);
      

    // 🔹 STEP 3: SEND PUSH (only if allowed)
    if (isPushAllowed) {
      const pushSent = await sendNotification(
        receiver.fcmToken,
        "New Follower 👤",
        `${sender.name} started following you`
      );

      // 🔹 STEP 4: UPDATE FLAG
      if (pushSent) {
        notification.isPushSent = true;
        await notification.save();
      }
    }

    console.log("✅ Follow notification created");
  } catch (error) {
    console.error("❌ notifyOnFollow error:", error);
  }
};

module.exports = notifyOnFollow;
