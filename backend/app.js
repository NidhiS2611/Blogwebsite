const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
require('./utils/passport');
require('dotenv').config();
const connectDB = require('./config/mongooseconnect');
const User = require('./models/usermodel');
const Message = require('./models/Messagemodel');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Connect Databa

// Server Setup
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: 'https://blogwebsite-pi-silk.vercel.app',
    credentials: true,
  },
});

// Middleware
app.use(passport.initialize());
app.use(cors({
  origin: 'https://blogwebsite-pi-silk.vercel.app',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes
app.use('/conversation', require('./route/conversationroute'));
app.use('/comment', require('./route/commentroute'));
app.use('/notification', require('./route/notificationroutes'));
app.use('/auth', require('./route/goggleroutes'));
app.use('/blog', require('./route/blogroutes'));
app.use('/user', require('./route/userroutes'));

// Socket State
let users = [];

const addUser = (userId, socketId) => {
  const existing = users.find((u) => u.userId.toString() === userId.toString());
  if (existing) {
    existing.socketId = socketId;
  } else {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const getUser = (userId) => users.find((u) => u.userId.toString() === userId.toString());

// Socket Connection
io.on("connection", async (socket) => {
  console.log("🟢 Connected:", socket.id);

  const userId = socket.handshake.auth?.userId;
  if (userId) {
    addUser(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: null });
    io.emit("getUsers", users);
  }

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    const { senderId, receiverId, text, messageId: tempId } = data;

    try {
      // 1. Save to DB first
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text: text,
        status: getUser(receiverId) ? "delivered" : "sent"
      });

      // 2. Emit to Receiver
      const receiver = getUser(receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("receive_message", {
          senderId,
          receiverId,
          text,
          messageId: newMessage._id,
          status: newMessage.status,
        });
      }

      // 3. Confirm to Sender with original tempId to replace UI
      io.to(socket.id).emit("message_status", {
        messageId: newMessage._id,
        status: newMessage.status,
        tempId: tempId // Frontend mein isse match karke replace karna
      });
    } catch (err) {
      console.error("Socket Send Error:", err);
    }
  });

  // SEEN MESSAGE
  socket.on("seen_message", async ({ messageId, senderId }) => {
    await Message.findByIdAndUpdate(messageId, { status: "seen", seenAt: new Date() });
    const sender = getUser(senderId);
    if (sender) {
      io.to(sender.socketId).emit("message_status", { messageId, status: "seen" });
    }
  });

  // DISCONNECT
  socket.on("disconnect", async () => {
    const user = users.find((u) => u.socketId === socket.id);
    if (user) {
      await User.findByIdAndUpdate(user.userId, { isOnline: false, lastSeen: new Date() });
      removeUser(socket.id);
      io.emit("getUsers", users);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});