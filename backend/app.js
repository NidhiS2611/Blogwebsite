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

const cookieParser = require('cookie-parser');
const cors = require('cors');

// 🔥 DB CONNECT


// 🔥 CREATE SERVER
const server = http.createServer(app);

// 🔥 SOCKET SETUP
const io = new Server(server, {
  cors: {
    origin: 'https://blogwebsite-pi-silk.vercel.app',
    credentials: true,
  },
});
app.set("io", io)
app.set("getUser", getUser);

// 🔥 MIDDLEWARE
app.use(passport.initialize());
app.use(cors({
  origin: 'https://blogwebsite-pi-silk.vercel.app',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// 🔥 ROUTES
const userRoutes = require('./route/userroutes');
const blogRoutes = require('./route/blogroutes');
const commentRoutes = require('./route/commentroute');
const notificationRoutes = require('./route/notificationroutes');
const authRoutes = require('./route/goggleroutes');
const conversationRoutes = require('./route/conversationroute');


app.use('/conversation', conversationRoutes);
app.use('/comment', commentRoutes);
app.use('/notification', notificationRoutes);
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/user', userRoutes);

// ================= SOCKET LOGIC ================= //

let users = [];

// ✅ ADD / UPDATE USER
const addUser = (userId, socketId) => {
  const existing = users.find(
    (u) => u.userId.toString() === userId.toString()
  );

  if (existing) {
    existing.socketId = socketId;
  } else {
    users.push({ userId, socketId });
  }
};

// ✅ REMOVE USER
const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

// ✅ GET USER
const getUser = (userId) => {
  return users.find(
    (u) => u.userId.toString() === userId.toString()
  );
};

// ================= SOCKET CONNECTION ================= //

io.on("connection", async (socket) => {
  console.log("🟢 Connected:", socket.id);

  const userId = socket.handshake.auth?.userId;

  if (userId) {
    // 🔥 add user in memory
    addUser(userId, socket.id);

    // 🔥 DB → ONLINE
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: null,
    });

    console.log("🔥 user online:", userId);
  }

  // 🔥 SEND ONLINE USERS LIST
  io.emit("getUsers", users);

  // ================= SEND MESSAGE ================= //

  // socket.on("send_message", (data) => {
  //   console.log("📩 message:", data);

  //   const receiver = getUser(data.receiverId);

  //   if (receiver) {
  //     // ✅ RECEIVER ONLINE → DELIVERED
  //     io.to(receiver.socketId).emit("receive_message", {
  //       senderId: data.senderId,
  //       receiverId: data.receiverId,
  //       text: data.text,
  //       messageId: data.messageId,
  //       status: "delivered",
  //     });

  //     // 🔥 sender ko update (double tick)
  //     io.to(socket.id).emit("message_status", {
  //       messageId: data.messageId,
  //       status: "delivered",
  //     });

  //   } else {
  //     // ❌ RECEIVER OFFLINE → SENT
  //     io.to(socket.id).emit("message_status", {
  //       messageId: data.messageId,
  //       status: "sent",
  //     });

  //     console.log("⚠️ Receiver offline:", data.receiverId);
  //   }
  // });

  // ================= SEEN MESSAGE ================= //

  socket.on("seen_message", ({ messageId, senderId }) => {
    const sender = getUser(senderId);

    if (sender) {
      io.to(sender.socketId).emit("message_status", {
        messageId,
        status: "seen",
      });
    }
  });

  // ================= DISCONNECT ================= //

  socket.on("disconnect", async () => {
    console.log("🔴 Disconnected:", socket.id);

    const user = users.find((u) => u.socketId === socket.id);

    if (user) {
      // 🔥 DB → OFFLINE
      await User.findByIdAndUpdate(user.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      console.log("❌ user offline:", user.userId);
    }

    removeUser(socket.id);

    // 🔥 UPDATE ONLINE USERS
    io.emit("getUsers", users);
  });
});

// ================= START SERVER ================= //

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

