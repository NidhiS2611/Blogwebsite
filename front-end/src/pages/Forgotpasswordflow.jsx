import React, { useState } from "react";
import { ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import api from '../services/Axiosinstance';

export default function Forgotpasswordflow() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/forgot-password", { email });
      setStep(2);
    } catch (err) { alert("Email nahi mila bhai!"); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/verify-otp", { email, otp });
      setStep(3);
    } catch (err) { alert("Galat OTP hai!"); }
  };

  const resetPass = async (e) => {
    e.preventDefault();
    try {
      // Backend par check karna password hash ho raha hai ya nahi
      await api.post("/user/reset-password", { email, newPassword, otp });
      alert("Password badal gaya! Login karle ab.");
      window.location.href = "/login";
    } catch (err) { alert("Kuch gadbad ho gayi!"); }
  };

  return (
    // Background ko dark gradient kar diya hai
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4 shadow-xl">
             {/* Yahan apna logo ya text dalo */}
            <h2 className="text-2xl font-bold text-purple-500">BS</h2>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">BlogSphere</h1>
          <p className="text-zinc-400 mt-2">
            {step === 1 && "Password bhool gaye? Koi baat nahi!"}
            {step === 2 && "OTP check karo bhai"}
            {step === 3 && "Naya password set karo"}
          </p>
        </div>

        {/* Main Card (Black theme) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8">
          
          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={sendOtp}>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-500" /> Forgot Password
              </h2>
              <input
                type="email"
                required
                placeholder="Registered email dalo"
                className="w-full mb-6 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
                Send OTP <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-purple-500" /> Verify OTP
              </h2>
              <p className="text-xs text-zinc-500 mb-4">OTP sent to: <span className="text-purple-400">{email}</span></p>
              <input
                type="text"
                required
                maxLength="6"
                placeholder="000000"
                className="w-full mb-6 px-4 py-3 bg-zinc-800 border border-zinc-700 text-purple-500 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none font-bold text-center text-3xl tracking-[8px]"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
                Verify OTP <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <form onSubmit={resetPass}>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Lock className="h-5 w-5 text-purple-500" /> Reset Password
              </h2>
              <input
                type="password"
                required
                placeholder="Naya password dalo"
                className="w-full mb-6 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="submit" className="w-full bg-white hover:bg-zinc-200 transition-all text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl">
                Update Password <ShieldCheck className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center border-t border-zinc-800 pt-6">
            <a href="/user/login" className="text-sm text-zinc-500 hover:text-purple-400 transition-colors font-medium">
              ← Back to Login
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}