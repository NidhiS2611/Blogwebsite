// models/messageModel.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    image: {
      type: String, // optional (future use)
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    seenAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;