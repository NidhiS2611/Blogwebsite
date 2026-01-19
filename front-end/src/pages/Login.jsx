import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Mail, Lock } from "lucide-react";
import Authcomponent from "../component/Authcomponent";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authcomponent title="Welcome Back" subtitle="Login to StudyHub">

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type="password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit btn */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-center mt-6 text-purple-600 font-semibold">
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")} className="underline">
          Create Account
        </button>
      </p>

    </Authcomponent>
  );
}


