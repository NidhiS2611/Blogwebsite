const Notification = require("../models/notificationmodel");
const User = require("../models/usermodel");
const Blog = require("../models/blogmodel");
const sendNotification = require("./sendNotification");

const notifyOnComment = async ({
  senderId,
  receiverId,
  blogId,
  commentText,
}) => {
  try {
    // ❌ khud ke blog pe comment → notification nahi
    if (senderId.toString() === receiverId.toString()) return;

    const sender = await User.findById(senderId).select("name");
    const receiver = await User.findById(receiverId).select(
      "fcmToken notificationSettings"
    );
    const blog = await Blog.findById(blogId).select("title");

    if (!sender || !receiver || !blog) return;

    // 🔹 comment thoda short (insta style)
    const shortComment =
      commentText.length > 80
        ? commentText.slice(0, 80) + "..."
        : commentText;

    // 🔹 STEP 1: DB notification (ALWAYS)
    const notification = await Notification.create({
      receiver: receiverId,
      sender: senderId,
      type: "COMMENT",
      message: `${sender.name} commented on "${blog.title}": ${shortComment}`,
      link: `/blog/${blogId}`,
      isRead: false,
      isPushSent: false,
    });

    // 🔹 STEP 2: PUSH permission check
    const isPushAllowed =
      receiver.fcmToken &&
      receiver.notificationSettings?.comment === true; // default ON

    // 🔹 STEP 3: SEND PUSH
    if (isPushAllowed) {
      const pushSent = await sendNotification(
        receiver.fcmToken,
        "New Comment 💬",
        `${sender.name}: ${shortComment}`
      );

      if (pushSent) {
        notification.isPushSent = true;
        await notification.save();
      }
    }

    console.log("✅ Comment notification sent");
  } catch (error) {
    console.error("❌ notifyOnComment error:", error);
  }
};

module.exports = notifyOnComment;
