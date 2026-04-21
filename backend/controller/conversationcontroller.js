const Conversation = require("../models/conversationmodel");
const Message = require("../models/Messagemodel");
const { getUser } = require("../server"); // 🔥 Directly import karo

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    // 1. Conversation
    let conversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
    if (!conversation) {
      conversation = await Conversation.create({ members: [senderId, receiverId] });
    }

    // 2. Message Save (Status 'sent' ke saath)
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
      
    });

    // 3. Update conversation
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // 4. SOCKET LOGIC
    const io = req.app.get("io");
    const receiver = getUser(receiverId);

    if (receiver) {
      // Receiver Online hai -> Status 'delivered' update karo
      message.status = "delivered";
      await message.save(); // DB mein update karo
      
      io.to(receiver.socketId).emit("receive_message", message);
      
      // Sender ko bhi update bhejo ki deliver ho gaya
      io.to(req.user.socketId).emit("message_status", { 
        messageId: message._id, 
        status: "delivered" 
      });
    }

    res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};