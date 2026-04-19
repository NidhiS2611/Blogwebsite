import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";
import { socket } from "../socket";

export default function Chat() {
  const { user: currentUser } = useAuth();

  const params = new URLSearchParams(useLocation().search);
  const userId = params.get("userId");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 🔥 SOCKET LISTEN
  useEffect(() => {
    socket.on("getUsers", setOnlineUsers);

    socket.on("receive_message", (data) => {
      if (data.senderId === userId) {
        setMessages((prev) => [
          ...prev,
          {
            _id: data.messageId,
            sender: data.senderId,
            text: data.text,
            status: data.status,
          },
        ]);

        socket.emit("seen_message", {
          messageId: data.messageId,
          senderId: data.senderId,
        });
      }
    });

    socket.on("message_status", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status } : m
        )
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_status");
      socket.off("getUsers");
    };
  }, [userId]);

  // 🔥 SEND MESSAGE
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
      const res = await api.post("/message/send", {
        receiverId: userId,
        text,
      });

      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? res.data.message : m
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const isOnline = onlineUsers.some((u) => u.userId === userId);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      <div className="p-3 border-b">
        <h2>
          {isOnline ? "🟢 Online" : "⚫ Offline"}
        </h2>
      </div>

      <div className="flex-1 p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser._id;

          return (
            <div key={msg._id} className={isMe ? "text-right" : ""}>
              <div className="inline-block bg-gray-700 p-2 rounded">
                {msg.text}
              </div>

              <div className="text-xs">
                {msg.status === "sent" && "✔"}
                {msg.status === "delivered" && "✔✔"}
                {msg.status === "seen" && "✔✔👀"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-gray-800 p-2"
        />
        <button onClick={sendMessage}>
          <Send />
        </button>
      </div>
    </div>
  );
}