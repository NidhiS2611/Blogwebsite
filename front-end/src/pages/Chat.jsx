import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";
import { socket } from "../server";

export default function Chat() {
  const { user: currentUser } = useAuth();
  const params = new URLSearchParams(useLocation().search);
  const userId = params.get("userId");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ================= SOCKET LISTENERS ================= //
  useEffect(() => {
    if (!currentUser?._id) return;

    const handleUsers = (users) => setOnlineUsers(users);

    // 📩 RECEIVE MESSAGE
    const handleReceive = (data) => {
      // Backend se jo message aayega, usme 'data.sender' hoga
      if (data.sender.toString() === userId.toString()) {
        setMessages((prev) => [...prev, data]);
      }
    };

    // ✔ STATUS UPDATE (Delivered/Seen)
    const handleStatus = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, status } : m))
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

  // ================= SEEN LOGIC ================= //
  useEffect(() => {
    messages.forEach((msg) => {
      // Sirf receiver ke aaye huye messages ko mark karo
      if (
        msg.sender?.toString() !== currentUser._id.toString() &&
        msg.status !== "seen" &&
        typeof msg._id === "string" // Real MongoDB ID check
      ) {
        socket.emit("seen_message", {
          messageId: msg._id,
          senderId: msg.sender,
        });
      }
    });
  }, [messages, currentUser._id]);

  // ================= FETCH OLD MESSAGES ================= //
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversation/${userId}`);
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

    // 1. Instant UI update (Temp ID)
    const tempId = Date.now();
    const tempMsg = {
      _id: tempId,
      sender: currentUser._id,
      text,
      status: "sent",
    };

    setMessages((prev) => [...prev, tempMsg]);
    setText("");

    try {
      // 2. API se message bhejo
      const res = await api.post("/conversation/send", {
        receiverId: userId,
        text,
      });

      // 3. 🔥 SYNC: Temp ID ko DB wali REAL ID se replace karo
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.data.message : m))
      );
    } catch (err) {
      console.log("Send error", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const isOnline = onlineUsers.some((u) => u.userId.toString() === userId.toString());

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <h2>{isOnline ? "🟢 Online" : "⚫ Offline"}</h2>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {messages.map((msg) => {
          const isMe = msg.sender?.toString() === currentUser._id.toString();
          return (
            <div key={msg._id} className={isMe ? "text-right" : ""}>
              <div className={`inline-block p-2 rounded ${isMe ? "bg-blue-600" : "bg-gray-700"}`}>
                {msg.text}
              </div>
              {isMe && (
                <div className="text-xs text-gray-400">
                  {msg.status === "sent" && "✔"}
                  {msg.status === "delivered" && "✔✔"}
                  {msg.status === "seen" && "✔✔👀"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex p-2 border-t border-gray-800">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
          className="flex-1 bg-gray-800 p-2 outline-none rounded"
        />
        <button onClick={sendMessage} className="p-2 bg-blue-600 rounded ml-2">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}