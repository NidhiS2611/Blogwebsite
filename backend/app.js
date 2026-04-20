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

// ================= DB ================= //
connectDB();

// ================= SERVER ================= //
const server = http.createServer(app);

// ================= SOCKET ================= //
const io = new Server(server, {
  cors: {
    origin: 'https://blogwebsite-pi-silk.vercel.app',
    credentials: true,
  },
});

// ================= MIDDLEWARE ================= //
app.use(passport.initialize());
app.use(cors({
  origin: 'https://blogwebsite-pi-silk.vercel.app',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ================= ROUTES ================= //
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

// ================= USERS ================= //
let users = [];

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

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(
    (u) => u.userId.toString() === userId.toString()
  );
};

// ================= SOCKET ================= //
io.on("connection", async (socket) => {
  console.log("🟢 Connected:", socket.id);

  const userId = socket.handshake.auth?.userId;

  if (userId) {
    addUser(userId, socket.id);

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: null,
    });
  }

  io.emit("getUsers", users);

  // ================= SEEN ================= //
  socket.on("seen_message", async ({ messageId, senderId }) => {
    try {
      const message = await Message.findById(messageId);

      if (!message) return;

      message.status = "seen";
      message.seenAt = new Date();
      await message.save();

      const sender = getUser(senderId);

      if (sender) {
        io.to(sender.socketId).emit("message_status", {
          messageId,
          status: "seen",
        });
      }

    } catch (err) {
      console.log(err);
    }
  });

  // ================= TYPING ================= //
  socket.on("typing", (data) => {
    const receiver = getUser(data.receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("typing", {
        senderId: data.senderId,
      });
    }
  });

  // ================= DISCONNECT ================= //
  socket.on("disconnect", async () => {
    const user = users.find((u) => u.socketId === socket.id);

    if (user) {
      await User.findByIdAndUpdate(user.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
    }

    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// ================= START ================= //
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});