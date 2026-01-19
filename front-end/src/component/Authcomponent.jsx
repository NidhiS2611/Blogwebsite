export default function Authcomponent({ title, subtitle, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center px-4">

      {/* Blurred Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-4">
              <span className="text-white font-bold text-2xl">📚</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {title}
            </h1>

            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="text-center text-white/80 text-sm mt-6">
          By signing in, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
}

