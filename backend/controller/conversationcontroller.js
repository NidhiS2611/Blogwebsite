const Conversation = require("../models/conversationmodel")
const Message = require("../models/Messagemodel");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id; // auth middleware se

    // 🔥 1. conversation find ya create
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    // 🔥 2. message save
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    // 🔥 3. update conversation
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // 🔥 4. SOCKET → specific user ko bhejo
   

    res.status(200).json({ message });

  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendMessage,
};