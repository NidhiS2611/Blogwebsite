const notificationModel = require('../models/notificationmodel');
const usermodel = require('../models/usermodel');
const sendNotification = require('./sendNotification');

const notifyOnNewBlog = async ({ blogId, blogOwnerId }) => {
  try {
    const owner = await usermodel
      .findById(blogOwnerId)
      .populate('followers')
      .populate('following');

    if (!owner) return;

    // followers + following (unique)
    const usersMap = new Map();
    [...owner.followers, ...owner.following].forEach(u => {
      usersMap.set(u._id.toString(), u);
    });

    const notifyUsers = Array.from(usersMap.values());

    for (const user of notifyUsers) {
      if (user._id.toString() === owner._id.toString()) continue;

      // 🔹 STEP 1: ALWAYS CREATE NOTIFICATION (Silent)
      const notif = await notificationModel.create({
        receiver: user._id,
        sender: owner._id,
        type: "BLOG",
        message: `${owner.name} posted a new blog`,
        link: `/blog/${blogId}`,
        isRead: false,
        isPushSent: false,
        createdAt: new Date(),
      });

      // 🔹 STEP 2: PUSH ONLY IF ALLOWED
      const allowPush =
        user.fcmToken &&
        user.notificationSettings?.blog === true;

      if (allowPush) {
        const pushRes = await sendNotification(
          user.fcmToken,
          "New Blog",
          `${owner.name} posted a new blog`
        );

        if (pushRes) {
          notif.isPushSent = true;
          await notif.save();
        }
      }
    }

    console.log("✅ Notifications created (silent + push where allowed)");
  } catch (err) {
    console.error("❌ Notification error:", err);
  }
};

module.exports = notifyOnNewBlog;


