import { io } from "socket.io-client";

// 🔥 backend URL
const URL = "https://blogwebsite-20pw.onrender.com";

export const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false, // 🔥 manual connect
});