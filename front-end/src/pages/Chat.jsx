import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";
import { socket } from "../socket"; // ⚠️ make sure same file use ho

export default function Chat() {
  const { user: currentUser } = useAuth();

  const params = new URLSearchParams(useLocation().search);
  const userId = params.get("userId");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState(false);

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

        // 👀 SEEN
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

    // ✍️ TYPING
    const handleTyping = (data) => {
      if (data.senderId === userId) {
        setTyping(true);

        setTimeout(() => setTyping(false), 2000);
      }
    };

    socket.on("getUsers", handleUsers);
    socket.on("receive_message", handleReceive);
    socket.on("message_status", handleStatus);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("getUsers", handleUsers);
      socket.off("receive_message", handleReceive);
      socket.off("message_status", handleStatus);
      socket.off("typing", handleTyping);
    };
  }, [currentUser, userId]);

  // ================= FETCH OLD ================= //
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversation/${userId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) fetchMessages();
  }, [userId]);

  // ================= SEND ================= //
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

    // 🔥 SOCKET
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

      const realMsg = res.data.message;

      // 🔥 replace temp msg
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? realMsg : m
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  // ================= TYPING SEND ================= //
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: userId,
    });
  };

  // ================= ONLINE ================= //
  const isOnline = onlineUsers.some(
    (u) => u.userId.toString() === userId.toString()
  );

  // ================= UI ================= //
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="p-3 border-b flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        ></span>

        <div>
          <p className="text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>

          {typing && (
            <p className="text-xs text-green-400">
              typing...
            </p>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {messages.map((msg) => {
          const isMe =
            msg.sender?.toString() === currentUser._id.toString();

          return (
            <div
              key={msg._id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  isMe
                    ? "bg-green-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>

                {isMe && (
                  <div className="text-[10px] text-right mt-1">

                    {msg.status === "sent" && "✔"}

                    {msg.status === "delivered" && "✔✔"}

                    {msg.status === "seen" && (
                      <span className="text-blue-400">
                        ✔✔
                      </span>
                    )}

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="flex p-2 border-t border-gray-800">
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 p-2 rounded-l outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 px-4 rounded-r"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}