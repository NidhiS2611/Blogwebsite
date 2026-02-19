const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // 🔔 kisko notification ja rahi hai
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    // 👤 kisne action kiya (optional)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    // 🔥 notification type
    type: {
      type: String,
      enum: ["BLOG", "FOLLOW", "LIKE", "COMMENT"],
      required: true,
    },

    // 📝 message jo UI me dikhega
    message: {
      type: String,
      required: true,
    },

    // 🔗 deep link (blog / profile)
    link: {
      type: String, // eg: /blog/123 , /profile/45
    },

    // 👀 read / unread
    isRead: {
      type: Boolean,
      default: false,
    },

    // 📱 FCM push ke liye (optional)
    isPushSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;