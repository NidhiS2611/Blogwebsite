import { useNavigate } from "react-router-dom";
import api from "../services/Axiosinstance";

export default function AuthLanding() {
  const navigate = useNavigate();
  const handleGoogleAuth = () => {
    // Yahan tera Google Auth logic aayega (Firebase ya Passport)
    console.log("Google Auth Clicked");
    // Example for Passport
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  }

  return (
    /* h-[100dvh] (dynamic viewport height) aur overflow-hidden sabse zaroori hai */
    <div className=" h-[100dvh] bg-black text-white flex flex-col overflow-hidden">

      {/* NAVBAR: border-b aur padding thodi kam ki */}
      <nav className="w-full px-6 py-3 border-b border-neutral-800 shrink-0">
        <h1 className="text-lg font-bold tracking-tight text-white">
          BlogSphere
        </h1>
      </nav>

      {/* MAIN: flex-col mobile pe, md:flex-row desktop pe */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">

        {/* LEFT SECTION: Padding aur Gap kam kiya mobile ke liye */}
        <div className="flex-[0.8] md:flex-1 flex items-center justify-center px-6 py-4 md:py-16">
          <div className="max-w-md text-center md:text-left">
            <div className="text-3xl md:text-5xl mb-2 md:mb-6 text-gray-400">✦</div>
            <h1 className="text-2xl md:text-5xl font-bold leading-tight">
              Read & Write <br className="hidden md:block" /> Meaningful Blogs
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-lg hidden sm:block">
              A calm, distraction-free space for creators.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION: Spacing tight ki taaki niche se cut na ho */}
        <div className="flex-1 flex items-start md:items-center justify-center px-6 pb-8 md:py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
              Get started
            </h2>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleGoogleAuth}
                className="w-full bg-neutral-800 text-white py-3 rounded-full font-medium hover:bg-neutral-700 transition text-sm"
              >
                Continue with Google
              </button>

              <div className="flex items-center my-1">
                <div className="flex-1 h-px bg-neutral-800" />
                <span className="px-3 text-gray-500 text-xs">OR</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <button
                onClick={() => navigate("/signup")}
                className="w-full bg-violet-600 py-3 rounded-full font-semibold hover:bg-violet-700 transition text-sm shadow-lg shadow-violet-900/20"
              >
                Create account
              </button>

              <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight">
                By continuing, you agree to our{" "}
                <span className="text-violet-400 hover:underline cursor-pointer">Terms</span>
              </p>
            </div>

            {/* ALREADY HAVE ACCOUNT: Isko niche fix kiya */}
            <div className="mt-6 md:mt-10 border-t border-neutral-900 pt-6">
              <p className="text-gray-500 mb-2 text-xs text-center">
                Already have an account?
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full border border-neutral-800 py-3 rounded-full font-medium hover:bg-neutral-900 transition text-sm"
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

