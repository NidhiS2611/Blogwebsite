import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Authcomponent from "../component/Authcomponent";


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
      await axios.post("http://localhost:3000/user/register", {
        name,
        email,
        password,
      });

      navigate("/login"); // ✔ Signup → Login
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Authcomponent title="Create Account" subtitle="Join StudyHub Today">

      <form onSubmit={handleSignup} className="space-y-4">

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4">
          Create Account
        </button>
      </form>

      <p className="text-center mt-6 text-purple-600 font-semibold">
        <Link to="/login">Already have an account? Sign In</Link>
      </p>

    </Authcomponent>
  );
}
