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
      await api.post("/user/forgot-password", { email }
        
      );
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
      await api.post("/user/reset-password", { email, newPassword, otp });
      alert("Password badal gaya! Login karle ab.");
      window.location.href = "/login";
    } catch (err) { alert("Kuch gadbad ho gayi!"); }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm mx-auto">
        
        {/* HEADER - Login Screen jaisa style */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {step === 1 && "Reset Password"}
            {step === 2 && "Verification"}
            {step === 3 && "Secure Account"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {step === 1 && "Enter your email to get OTP"}
            {step === 2 && "Enter 6-digit code sent to your mail"}
            {step === 3 && "Set a new strong password"}
          </p>
        </div>

        {/* Main Card - Login Screen se matching (Pitch Black) */}
        <div className="bg-black border border-neutral-800 rounded-2xl px-6 py-7 sm:px-7 sm:py-8">
          
          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-full text-sm font-medium transition text-white">
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="Enter OTP"
                  className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600 tracking-[4px] font-bold"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-full text-sm font-medium transition text-white">
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <form onSubmit={resetPass} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  className="w-full pl-10 py-3 bg-neutral-900 text-white rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-600"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 py-3 rounded-full text-sm font-medium transition text-white">
                Update Password
              </button>
            </form>
          )}

          {/* FOOTER - Login jaisa logic */}
          <p className="text-center mt-6 text-sm text-gray-400">
            Remembered?{" "}
            <button
              onClick={() => window.location.href = "/login"}
              className="text-white underline"
            >
              ← Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}