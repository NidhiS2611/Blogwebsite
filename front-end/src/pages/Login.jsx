import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Mail, Lock } from "lucide-react";
import Authcomponent from "../component/Authcomponent";
import { requestPermissionAndGetToken } from "../firebase/requestPermission";
import api from "../services/Axiosinstance";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);

  // 🔥 COMMON FUNCTION (FCM + REDIRECT)
  const handlePostLogin = async () => {
    try {
      await requestPermissionAndGetToken(); // ✅ ek hi jagah FCM
    } catch (err) {
      console.log("FCM error:", err);
    }

    navigate("/home", { replace: true }); // ✅ ek hi jagah redirect
  };

  // 🔥 GOOGLE REDIRECT HANDLE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isGoogle = params.get("google");

    if (isGoogle) {
      setIsGoogleLogin(true);
      handlePostLogin(); // ✅ reuse
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);

      await handlePostLogin(); // ✅ SAME function
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADER UI (Google login ke liye)
  if (isGoogleLogin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-400">
          Signing you in with Google...
        </p>
      </div>
    );
  }

  return (
    <Authcomponent>
      <div className="w-full max-w-sm mx-auto bg-black border border-neutral-800 
      rounded-2xl px-6 py-7 sm:px-7 sm:py-8 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Login to BlogSphere
          </p>
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-neutral-900 border border-neutral-800 
          py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-all mb-6"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-5 h-5" 
          />
          Continue with Google
        </button>

        {/* DIVIDER */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500 font-medium">OR</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 py-3 bg-neutral-900/50 text-white rounded-lg text-sm
              border border-transparent focus:border-violet-600 transition-all outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 py-3 bg-neutral-900/50 text-white rounded-lg text-sm
              border border-transparent focus:border-violet-600 transition-all outline-none"
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

          {error && (
            <p className="text-sm text-red-400 text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700
            py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-violet-600/20"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-8 text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-white font-medium hover:underline underline-offset-4"
          >
            Create account
          </button>
        </p>
      </div>
    </Authcomponent>
  );
}




