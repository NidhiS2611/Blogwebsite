const express = require('express');
const app = express();
const path = require('path');

const http = require('http'); // 🔥 ADD
const { Server } = require('socket.io'); // 🔥 ADD

const passport = require('passport');
require('./utils/passport');

require('dotenv').config();
const connectDB = require('./config/mongooseconnect');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// 🔥 DB conne

// 🔥 create server
const server = http.createServer(app);

// 🔥 socket setup
const io = new Server(server, {
  cors: {
    origin: 'https://blogwebsite-pi-silk.vercel.app',
    credentials: true,
  },
});

// 🔥 middleware
app.use(passport.initialize());
app.use(cors({
  origin: 'https://blogwebsite-pi-silk.vercel.app',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 🔥 routes
const userRoutes = require('./route/userroutes');
const blogRoutes = require('./route/blogroutes');
const commentRoutes = require('./route/commentroute');
const notificationRoutes = require('./route/notificationroutes');
const authRoutes = require('./route/goggleroutes');

app.use('/comment', commentRoutes);
app.use('/notification', notificationRoutes);
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/user', userRoutes);

// ================= SOCKET LOGIC ================= //

// ================= SOCKET LOGIC ================= //

let users = [];

// 🔥 add / update user
const addUser = (userId, socketId) => {
  const existingUser = users.find(u => u.userId === userId);

  if (existingUser) {
    existingUser.socketId = socketId; // update if already exists
  } else {
    users.push({ userId, socketId });
  }
};

// 🔥 remove user
const removeUser = (socketId) => {
  users = users.filter(u => u.socketId !== socketId);
};

// 🔥 get user
const getUser = (userId) => {
  return users.find(u => u.userId === userId);
};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🔥 auth se userId lo (BEST METHOD)
  const userId = socket.handshake.auth?.userId;

  if (userId) {
    addUser(userId, socket.id);
    console.log("🔥 userId:", userId);
  }

  io.emit("getUsers", users);

  // 💬 SEND MESSAGE (FIXED)
  socket.on("send_message", (data) => {
    const { senderId, receiverId, text } = data;

    const receiver = getUser(receiverId);

    if (receiver) {
      // ✅ sirf receiver ko bhej
      io.to(receiver.socketId).emit("receive_message", {
        senderId,
        text,
      });
    } else {
      console.log("⚠️ Receiver offline:", receiverId);
    }
  });

  // ❌ disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ================= START SERVER ================= //

const PORT = process.env.PORT || 3000;

// ❌ remove app.listen
// ✅ use server.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});