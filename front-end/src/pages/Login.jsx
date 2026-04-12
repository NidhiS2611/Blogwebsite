import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Mail, Lock } from "lucide-react";
import Authcomponent from "../component/Authcomponent";
import { requestPermissionAndGetToken } from "../firebase/requestPermission";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      requestPermissionAndGetToken();
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authcomponent>

      {/* INNER CARD (same as Signup) */}
      <div className="w-full max-w-sm mx-auto bg-black border border-neutral-800 
      rounded-2xl px-6 py-7 sm:px-7 sm:py-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Login to BlogSphere
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm
              placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm
              placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
            />
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-violet-400 hover:text-violet-300 transition"
            >
              Forgot password?
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700
            py-3 rounded-full text-sm font-medium transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-white "
          >
            Create account
          </button>
        </p>
      </div>

    </Authcomponent>
  );
}




