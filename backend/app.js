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

// 🔥 DB connect
connectDB();

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

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((u) => u.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🔥 user online
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // 💬 basic message
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // ❌ disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
    console.log("User disconnected:", socket.id);
  });
});

// ================= START SERVER ================= //

const PORT = process.env.PORT || 3000;

// ❌ remove app.listen
// ✅ use server.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});