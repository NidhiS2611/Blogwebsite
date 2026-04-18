import { io } from "socket.io-client";

// 🔥 backend URL (local ya deployed)
const URL =
  process.env.NODE_ENV === "production"
    ? "https://blogwebsite-20pw.onrender.com"   // 👉 deploy hone ke baad change karna
    : "http://localhost:3000";

// 🔥 socket instance
export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"], // fast & stable
});