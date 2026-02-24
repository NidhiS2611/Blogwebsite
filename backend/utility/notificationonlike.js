const Notification = require("../models/notificationmodel");
const User = require("../models/usermodel");
const sendNotification = require("./sendNotification");
const blogmodel = require("../models/blogmodel");

const notifyOnlike = async ({ senderId, receiverId , blogId }) => {
  try {
    // sender = jisne follow kiya
    const sender = await User.findById(senderId).select("name");

    // receiver = jisko follow kiya
    const receiver = await User.findById(receiverId).select(
      "fcmToken notificationSettings"
    );
    const blog = await blogmodel.findById(blogId).select("title");
    if (!sender || !receiver) return;

    // 🔹 STEP 1: ALWAYS CREATE DB NOTIFICATION (silent)
    const notification = await Notification.create({
      receiver: receiverId,
      sender: senderId,
      type: "LIKE",
      message: `${sender.name} liked your post "${blog.title}"`,
      link: `/profile/${senderId}`,
      isRead: false,
      isPushSent: false,
    });

    // 🔹 STEP 2: CHECK PUSH PERMISSION
    const isPushAllowed =
      receiver.fcmToken &&
      receiver.notificationSettings?.like === true;
      console.log( "receiver.notificationSettings", receiver.notificationSettings);
       console.log("fcmToken of rece", receiver.fcmToken);
       

    // 🔹 STEP 3: SEND PUSH (only if allowed)
    if (isPushAllowed) {
      const pushSent = await sendNotification(
        receiver.fcmToken,
        "New Like 👍",
        `${sender.name} liked your post "${blog.title}"`
      );

      // 🔹 STEP 4: UPDATE FLAG
      if (pushSent) {
        notification.isPushSent = true;
        await notification.save();
      }
    }

    console.log("✅  notification created");
  } catch (error) {
    console.error("❌ notifyOnLike error:", error);
  }
};

module.exports = notifyOnlike;