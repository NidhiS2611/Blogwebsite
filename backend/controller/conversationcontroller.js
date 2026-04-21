const Conversation = require("../models/conversationmodel");
const Message = require("../models/Messagemodel");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    // 1. Conversation find/create
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    // 2. Message save (Status default "sent" rahega)
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
    const getUser = req.app.get("getUser");
    const receiver = getUser(receiverId);

    if (receiver) {
      // Receiver Online hai -> Status update karo
      message = await Message.findByIdAndUpdate(
        message._id, 
        { status: "delivered" }, 
        { new: true } // new: true se updated object wapas milega
      );
      
      // Pura message object bhej, jisme status "delivered" hai
      io.to(receiver.socketId).emit("receive_message", message);
    }

    res.status(200).json({ message });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { sendMessage };