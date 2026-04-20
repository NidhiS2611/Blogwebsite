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

  // ================= SOCKET LISTEN ================= //
  useEffect(() => {
    if (!currentUser?._id) return;

    const handleUsers = (users) => {
      setOnlineUsers(users);
    };

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

        socket.emit("seen_message", {
          messageId: data.messageId,
          senderId: data.senderId,
        });
      }
    };

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

    const tempId = Date.now();
    const tempMsg = {
      _id: tempId,
      sender: currentUser._id,
      text,
      status: "sent",
    };

    setMessages((prev) => [...prev, tempMsg]);
    setText("");

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

      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? res.data.message : m))
      );
    } catch (err) {
      console.log("Send error", err);
    }
  };

  const isOnline = onlineUsers.some(
    (u) => u.userId.toString() === userId.toString()
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="font-bold">
          {isOnline ? "🟢 Online" : "⚫ Offline"}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => {
          const isMe = msg.sender?.toString() === currentUser._id.toString();

          return (
            <div
              key={msg._id}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`p-3 rounded-lg ${
                    isMe ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>

                {/* STATUS */}
                {isMe && (
                  <div className="text-[10px] text-gray-400 mt-1 self-end">
                    {msg.status === "sent" && "✔"}
                    {msg.status === "delivered" && "✔✔"}
                    {msg.status === "seen" && "✔✔👀"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-gray-800 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 outline-none focus:border-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
} 