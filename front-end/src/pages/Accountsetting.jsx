import { useState } from "react";
import axios from "axios";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Accountsetting = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return toast.error("Dono password bhar bhai");
    }

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:3000/user/change-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Password changed");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold">Account Settings</h1>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock size={18} /> Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-black border border-zinc-700 focus:outline-none"
                placeholder="Enter old password"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-black border border-zinc-700 focus:outline-none"
                placeholder="Enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Accountsetting;
