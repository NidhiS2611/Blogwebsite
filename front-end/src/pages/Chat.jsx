import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";
import { socket } from "../socket.js";

export default function Chat() {
  const { user: currentUser } = useAuth();

  const params = new URLSearchParams(useLocation().search);
  const userId = params.get("userId");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ================= SOCKET LISTEN ================= //
  useEffect(() => {
    if (!currentUser?._id) return;

    // 🟢 ONLINE USERS
    const handleUsers = (users) => {
      setOnlineUsers(users);
    };

    // 📩 RECEIVE MESSAGE
    const handleReceive = (data) => {
      if (data.senderId.toString() === userId.toString()) {
        setMessages((prev) => [
          ...prev,
          {
            _id: data.messageId,
            sender: data.senderId,
            text: data.text,
            status: data.status || "delivered",
          },
        ]);

        // 👀 mark as seen
        socket.emit("seen_message", {
          messageId: data.messageId,
          senderId: data.senderId,
        });
      }
    };

    // ✔ STATUS UPDATE
    const handleStatus = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status } : m
        )
      );
    };

    socket.on("getUsers", handleUsers);
    socket.on("receive_message", handleReceive);
    socket.on("message_status", handleStatus);

    return () => {
      socket.off("getUsers", handleUsers);
      socket.off("receive_message", handleReceive);
      socket.off("message_status", handleStatus);
    };
  }, [currentUser, userId]);

  // ================= FETCH OLD MESSAGES ================= //
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/message/${userId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.log("Fetch error", err);
      }
    };

    if (userId) fetchMessages();
  }, [userId]);

  // ================= SEND MESSAGE ================= //
  const sendMessage = async () => {
    if (!text.trim()) return;

    const tempId = Date.now();

    const tempMsg = {
      _id: tempId,
      sender: currentUser._id,
      text,
      status: "sent",
    };

    // 🔥 UI instant
    setMessages((prev) => [...prev, tempMsg]);
    setText("");

    // 🔥 SOCKET SEND
    socket.emit("send_message", {
      senderId: currentUser._id,
      receiverId: userId,
      text,
      messageId: tempId,
    });

    try {
      const res = await api.post("/conversation/send", {
        receiverId: userId,
        text,
      });

      // 🔥 replace temp with DB message
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? res.data.message : m
        )
      );
    } catch (err) {
      console.log("Send error", err);
    }
  };

  // ================= ONLINE CHECK FIX ================= //
  const isOnline = onlineUsers.some(
    (u) => u.userId.toString() === userId.toString()
  );

  // ================= UI ================= //
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="p-3 border-b">
        <h2>
          {isOnline ? "🟢 Online" : "⚫ Offline"}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {messages.map((msg) => {
          const isMe =
            msg.sender?.toString() === currentUser._id.toString();

          return (
            <div key={msg._id} className={isMe ? "text-right" : ""}>
              <div className="inline-block bg-gray-700 p-2 rounded">
                {msg.text}
              </div>

              {/* STATUS */}
              {isMe && (
                <div className="text-xs">
                  {msg.status === "sent" && "✔"}
                  {msg.status === "delivered" && "✔✔"}
                  {msg.status === "seen" && "✔✔👀"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="flex p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
          className="flex-1 bg-gray-800 p-2 outline-none"
        />
        <button onClick={sendMessage}>
          <Send />
        </button>
      </div>
    </div>
  );
}