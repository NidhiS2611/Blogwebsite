import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();

  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");

  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  /* ================= FETCH RECEIVER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/profile/${userId}`);
        setReceiver(res.data.profile);
      } catch (err) {
        console.log("User fetch error", err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  /* ================= FETCH MESSAGES ================= */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/message/${userId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.log("Message fetch error", err);
      }
    };

    if (userId) fetchMessages();
  }, [userId]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const tempMsg = {
      _id: Date.now(),
      sender: currentUser._id,
      receiver: userId,
      text,
    };

    // UI instant update
    setMessages((prev) => [...prev, tempMsg]);
    setText("");

    try {
      const res = await api.post("/message/send", {
        receiverId: userId,
        text,
      });

      // replace temp message
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMsg._id ? res.data.message : m))
      );
    } catch (err) {
      console.log("Send error", err);
    }
  };

  if (!receiver) return <div className="text-white p-5">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 border-b border-neutral-800">
        <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />

        <img
          src={
            receiver.profilepicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          className="w-8 h-8 rounded-full"
        />

        <span className="font-semibold">{receiver.name}</span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser._id;

          return (
            <div
              key={msg._id}
              className={`max-w-[70%] p-2 rounded text-sm ${
                isMe
                  ? "bg-purple-600 ml-auto"
                  : "bg-neutral-800 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 p-3 border-t border-neutral-800">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-900 p-2 rounded outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 p-2 rounded"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}