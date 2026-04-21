const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const User = require('./models/usermodel');
const Message = require('./models/Messagemodel'); // Apna model path check kar lena

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'https://blogwebsite-pi-silk.vercel.app', credentials: true },
});

// 🔥 BRIDGE FOR CONTROLLER
app.set("io", io);

// Middlewares & Routes (Same as your code)
app.use(cors({ origin: 'https://blogwebsite-pi-silk.vercel.app', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// SOCKET LOGIC
let users = [];
const addUser = (userId, socketId) => {
  const existing = users.find((u) => u.userId.toString() === userId.toString());
  existing ? (existing.socketId = socketId) : users.push({ userId, socketId });
};
const removeUser = (socketId) => { users = users.filter((u) => u.socketId !== socketId); };
const getUser = (userId) => users.find((u) => u.userId.toString() === userId.toString());

io.on("connection", async (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    addUser(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: null });
    io.emit("getUsers", users);
  }

  socket.on("seen_message", async ({ messageId, senderId }) => {
    await Message.findByIdAndUpdate(messageId, { status: "seen" });
    const sender = getUser(senderId);
    if (sender) io.to(sender.socketId).emit("message_status", { messageId, status: "seen" });
  });

  socket.on("disconnect", async () => {
    const user = users.find((u) => u.socketId === socket.id);
    if (user) {
      await User.findByIdAndUpdate(user.userId, { isOnline: false, lastSeen: new Date() });
      removeUser(socket.id);
      io.emit("getUsers", users);
    }
  });
});

module.exports = { app, io, getUser }; // Export taaki controller use kar sake

server.listen(3000, () => console.log("🚀 Server running on port 3000"));