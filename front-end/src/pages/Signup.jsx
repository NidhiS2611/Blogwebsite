import { useState } from "react";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Authcomponent from "../component/Authcomponent";
import api from "../services/Axiosinstance";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    // Google Auth Logic here (Firebase or Passport)
    console.log("Redirecting to Google Auth...");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/user/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authcomponent>
      {/* MAIN CARD */}
      <div className="w-full max-w-sm mx-auto bg-black border border-neutral-800 
      rounded-2xl px-6 py-7 sm:px-7 sm:py-8 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Join BlogSphere today
          </p>
        </div>

        {/* 🔹 GOOGLE SIGNUP */}
        <button
          onClick={handleGoogleSignup}
          type="button"
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

        {/* 🔹 DIVIDER */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500 font-medium">OR</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* NAME */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 py-3 bg-neutral-900/50 text-white rounded-lg text-sm
              border border-transparent focus:border-violet-600 transition-all outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-3 bg-neutral-900/50 text-white rounded-lg text-sm
              border border-transparent focus:border-violet-600 transition-all outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-3 bg-neutral-900/50 text-white rounded-lg text-sm
              border border-transparent focus:border-violet-600 transition-all outline-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700
            py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-violet-600/20 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-8 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </Authcomponent>
  );
}










