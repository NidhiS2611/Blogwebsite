import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Authcomponent from "../component/Authcomponent";
 import api from "../services/Axiosinstance";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/user/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Authcomponent>

      {/* MAIN CARD */}
      <div className="w-full max-w-sm mx-auto bg-black border border-neutral-800 
      rounded-2xl px-6 py-7 sm:px-7 sm:py-8">

        {/* HEADER INSIDE CARD */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Join BlogSphere today
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">

          {error && (
            <div className="p-2 text-sm text-red-400 bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}

          {/* NAME */}
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Full name"
              className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm
              placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm
              placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm
              placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700
            py-3 rounded-full text-sm font-medium transition"
          >
            Create account
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-white ">
            Sign in
          </Link>
        </p>
      </div>

    </Authcomponent>
  );
}










