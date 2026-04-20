import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import { socket } from "../server";
import api from "../services/Axiosinstance";

export default function Chat() {
  const { user: currentUser } = useAuth();
  const userId = new URLSearchParams(useLocation().search).get("userId");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // FETCH INITIAL MESSAGES
  useEffect(() => {
    api.get(`/conversation/${userId}`).then((res) => setMessages(res.data.messages || []));
  }, [userId]);

  // SOCKET LISTENERS
  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      socket.emit("seen_message", { messageId: msg._id, senderId: msg.sender });
    };

    const handleStatus = (data) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (data.tempId && m._id === data.tempId) return { ...m, _id: data.messageId, status: data.status };
          if (m._id === data.messageId) return { ...m, status: data.status };
          return m;
        })
      );
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_status", handleStatus);
    return () => { socket.off("receive_message"); socket.off("message_status"); };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const tempId = Date.now();
    setMessages((prev) => [...prev, { _id: tempId, sender: currentUser._id, text, status: "sent" }]);
    socket.emit("send_message", { senderId: currentUser._id, receiverId: userId, text, messageId: tempId });
    setText("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => {
          const isMe = msg.sender?.toString() === currentUser._id.toString();
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col">
                <div className={`p-3 rounded ${isMe ? "bg-blue-600" : "bg-gray-700"}`}>{msg.text}</div>
                {isMe && (
                  <div className="text-[10px] text-gray-400">
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
      <div className="p-4 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 bg-gray-800 p-2" />
        <button onClick={sendMessage}><Send /></button>
      </div>
    </div>
  );
} 