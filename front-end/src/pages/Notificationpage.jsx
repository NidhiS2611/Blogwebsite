import { useEffect, useState } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/Axiosinstance";

export default function Notificationpage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "/notification/getnotification",
        { withCredentials: true }
      );
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch(
        "/notification/mark-all-read",
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(
        `/notification/notificationdelete/${id}`,
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="bg-black border-b border-neutral-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 flex items-center gap-3">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-lg sm:text-xl font-semibold">
          🔔 Notifications
        </h2>

      </div>

      {/* LIST */}
      <div className="w-full">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-sm">
            No notifications
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex justify-between gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b border-neutral-800
                ${n.isRead ? "bg-black" : "bg-neutral-900"}
              `}
            >
              <div className="flex gap-3">
                <img
                  src={
                    n.sender?.profilepicture ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  alt="sender"
                />

                <div>
                  <p
                    className={`text-xs sm:text-sm ${
                      !n.isRead
                        ? "font-semibold text-white"
                        : "text-gray-300"
                    }`}
                  >
                    {n.message}
                  </p>

                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteNotification(n._id)}
                className="text-red-500 hover:text-red-400 mt-1"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}






