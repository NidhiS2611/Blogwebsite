import { useNavigate } from "react-router-dom";

export default function AuthLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* NAVBAR */}
      <nav className="w-full px-6 py-4 border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight text-white">
          BlogSphere
        </h1>
      </nav>

      {/* MAIN */}
      <div className="flex flex-1 flex-col md:flex-row">

        {/* LEFT SECTION */}
        <div className="flex-1 flex items-center justify-center px-10 py-16">
          <div className="max-w-md">
            <div className="text-5xl mb-6 text-gray-400">✦</div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Read & Write <br /> Meaningful Blogs
            </h1>

            <p className="text-gray-400 mt-4 text-lg leading-relaxed">
              A calm, distraction-free space to explore ideas,
              stories, and knowledge from creators around the world.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION (SIMPLE – NO CARD) */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">

            <h2 className="text-2xl font-semibold mb-6">
              Get started
            </h2>

            <button
              className="
                w-full bg-neutral-800 text-white py-3 rounded-full
                font-medium mb-3 hover:bg-neutral-700 transition
              "
            >
              Continue with Google
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-neutral-700" />
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-neutral-700" />
            </div>

            <button
              onClick={() => navigate("/signup")}
              className="
                w-full bg-violet-600 py-3 rounded-full
                font-semibold hover:bg-violet-700 transition
              "
            >
              Create account
            </button>

            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              By continuing, you agree to our{" "}
              <span className="text-violet-400 hover:underline cursor-pointer">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-violet-400 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </p>

            <div className="mt-8">
              <p className="text-gray-400 mb-2 text-sm">
                Already have an account?
              </p>

              <button
                onClick={() => navigate("/login")}
                className="
                  w-full border border-neutral-700 py-3 rounded-full
                  font-medium hover:bg-neutral-800 transition
                "
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

