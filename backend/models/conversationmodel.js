// models/conversationModel.js

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// 🔥 same 2 users ke liye duplicate conversation na bane
conversationSchema.index({ members: 1 });

export default mongoose.model("Conversation", conversationSchema);