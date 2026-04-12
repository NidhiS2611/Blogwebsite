import { useEffect, useState } from "react";
import api from "../services/Axiosinstance";

const Notificationsetting = () => {
  const [settings, setSettings] = useState({
    blog: false,
    comment: false,
    follow: false,
    like: false,
  });

  const [loading, setLoading] = useState(false);

  // 🔹 GET settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get(
          "/user/get-notification",
          { withCredentials: true }
        );
        setSettings(res.data.notificationSettings);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSettings();
  }, []);

  // 🔹 checkbox change (sirf local state)
  const handleChange = (type) => {
    setSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 🔹 SAVE button → backend update
  const handleSave = async () => {
    setLoading(true);
    try {
      for (const key in settings) {
        await api.put(
          "/user/update-notification",
          {
            type: key,
            value: settings[key],
          },
          { withCredentials: true }
        );
      }
      alert("✅ Notification settings updated");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to update settings");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md text-white px-4 md:px-0 mx-4 ">
      <Link to="/settings" className="p-2 hover:bg-neutral-900 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
      <h2 className="text-xl font-semibold mb-6">
        Notification Settings
      </h2>

      {/* Black theme, no box */}
      <div className="space-y-4">

        <label className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <span className="text-gray-300">New Blog Post</span>
          <input
            type="checkbox"
            checked={settings.blog}
            onChange={() => handleChange("blog")}
            className="accent-violet-500"
          />
        </label>

        <label className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <span className="text-gray-300">Comments</span>
          <input
            type="checkbox"
            checked={settings.comment}
            onChange={() => handleChange("comment")}
            className="accent-violet-500"
          />
        </label>

        <label className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <span className="text-gray-300">Follows</span>
          <input
            type="checkbox"
            checked={settings.follow}
            onChange={() => handleChange("follow")}
            className="accent-violet-500"
          />
        </label>

        <label className="flex justify-between items-center border-b border-neutral-800 pb-2">
          <span className="text-gray-300">Likes</span>
          <input
            type="checkbox"
            checked={settings.like}
            onChange={() => handleChange("like")}
            className="accent-violet-500"
          />
        </label>

        {/* ✅ Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>

      </div>
    </div>
  );
};

export default Notificationsetting;



