import { useNavigate } from "react-router-dom";

export default function AuthLanding() {
  const navigate = useNavigate();

  return (
    /* h-screen aur overflow-hidden se scrollbar gayab ho jayega */
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* NAVBAR */}
      <nav className="w-full px-6 py-4 border-b border-neutral-800 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-white">
          BlogSphere
        </h1>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

        {/* LEFT SECTION (Content thoda chota kiya mobile ke liye) */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-8 md:py-16 border-b md:border-b-0 md:border-r border-neutral-800">
          <div className="max-w-md text-center md:text-left">
            <div className="text-3xl md:text-5xl mb-4 text-gray-400">✦</div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Read & Write <br className="hidden md:block" /> Meaningful Blogs
            </h1>
            <p className="text-gray-400 mt-2 md:mt-4 text-sm md:text-lg leading-relaxed hidden sm:block">
              A calm, distraction-free space to explore ideas.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION (Buttons ko tight kiya mobile ke liye) */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 md:py-12 bg-neutral-900/20">
          <div className="w-full max-w-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:text-6xl">
              Get started
            </h2>

            <div className="space-y-3">
              <button className="w-full bg-neutral-800 text-white py-3 rounded-full font-medium hover:bg-neutral-700 transition text-sm">
                Continue with Google
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="px-3 text-gray-500 text-xs uppercase">or</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <button
                onClick={() => navigate("/signup")}
                className="w-full bg-violet-600 py-3 rounded-full font-semibold hover:bg-violet-700 transition text-sm"
              >
                Create account
              </button>

              <p className="text-[10px] text-gray-500 mt-2 text-center">
                By continuing, you agree to our{" "}
                <span className="text-violet-400 underline cursor-pointer">Terms</span>
              </p>
            </div>

            <div className="mt-6 border-t border-neutral-800 pt-6">
              <p className="text-gray-400 mb-2 text-xs text-center">
                Already have an account?
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full border border-neutral-700 py-2.5 rounded-full font-medium hover:bg-neutral-800 transition text-sm"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

