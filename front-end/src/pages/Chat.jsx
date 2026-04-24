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

  // 🔥 menu state
  const [openMenuId, setOpenMenuId] = useState(null);

  // ================= SOCKET ================= //
  useEffect(() => {
    if (!currentUser?._id || !userId) return;

    const handleUsers = (users) => setOnlineUsers(users || []);

    const handleReceive = (data) => {
      if (data?.sender?.toString() === userId?.toString()) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleStatus = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m?._id === messageId ? { ...m, status } : m
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

  // ================= SEEN ================= //
  useEffect(() => {
    if (!currentUser?._id) return;

    messages.forEach((msg) => {
      if (
        msg &&
        msg.sender?.toString() !== currentUser?._id?.toString() &&
        msg.status !== "seen" &&
        typeof msg._id === "string"
      ) {
        socket.emit("seen_message", {
          messageId: msg._id,
          senderId: msg.sender,
        });
      }
    });
  }, [messages, currentUser]);

  // ================= FETCH ================= //
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversation/get/${userId}`);
        setMessages((res.data || []).filter(Boolean));
      } catch (err) {
        console.log("Fetch error", err);
      }
    };

    if (userId) fetchMessages();
  }, [userId]);

  // ================= SEND ================= //
  const sendMessage = async () => {
    if (!text.trim() || !currentUser?._id) return;

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
      const res = await api.post("/conversation/send", {
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
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  // ================= DELETE ================= //
  const handleDeleteForMe = async (id) => {
    try {
      const res = await api.put(`/conversation/delete-for-me/${id}`);

      setMessages((prev) =>
        prev.map((m) => (m._id === id ? res.data : m))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteForEveryone = async (id) => {
    try {
      const res = await api.put(`/conversation/delete-for-everyone/${id}`);

      setMessages((prev) =>
        prev.map((m) => (m._id === id ? res.data : m))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const isOnline = onlineUsers.some(
    (u) => u?.userId?.toString() === userId?.toString()
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* HEADER */}
      <div className="p-3 border-b border-gray-800">
        <h2>{isOnline ? "🟢 Online" : "⚫ Offline"}</h2>
      </div>

      {/* CHAT */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {messages.map((msg) => {
          if (!msg) return null;

          const isMe =
            msg.sender?.toString() ===
            currentUser?._id?.toString();

          // hide if deleted for me
          const isDeletedForMe = msg.deletedFor?.includes(currentUser._id);
          if (isDeletedForMe) return null;

          return (
            <div
              key={msg._id}
              className={`${isMe ? "text-right" : "text-left"} mb-2`}
            >
              <div className="inline-block relative">

                {/* MESSAGE BOX */}
                <div
                  className={`p-2 pr-8 rounded relative ${
                    isMe ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {/* TEXT */}
                  {msg.isDeletedForEveryone
                    ? "This message was deleted"
                    : msg.text}

                  {/* 🔥 3 DOT INSIDE */}
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === msg._id ? null : msg._id
                      )
                    }
                    className="absolute top-1 right-1 text-gray-300 text-xs"
                  >
                    ⋮
                  </button>
                </div>

                {/* 🔥 MENU */}
                {openMenuId === msg._id && (
                  <div className="absolute right-0 mt-1 bg-gray-800 text-white text-xs rounded shadow p-2 z-10">
                    <div
                      onClick={() => handleDeleteForMe(msg._id)}
                      className="cursor-pointer hover:text-red-400"
                    >
                      Delete for me
                    </div>

                    {isMe && (
                      <div
                        onClick={() =>
                          handleDeleteForEveryone(msg._id)
                        }
                        className="cursor-pointer hover:text-red-400 mt-1"
                      >
                        Delete for everyone
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 🔥 STATUS OUTSIDE */}
              {isMe && (
                <div className="text-xs text-gray-400 mt-1 mr-1">
                  {msg.status === "sent" && "✔"}
                  {msg.status === "delivered" && "✔✔"}
                  {msg.status === "seen" && (
                    <span className="text-blue-400">✔✔</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="flex p-2 border-t border-gray-800">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
          className="flex-1 bg-gray-800 p-2 outline-none rounded"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-600 rounded ml-2"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}