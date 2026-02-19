export default function Authcomponent({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      {/* WRAPPER */}
      <div className="w-full max-w-sm py-12">

        {/* BRAND */}
    

        {/* PAGE TITLE */}
        <h2 className="text-xl font-medium text-gray-200 mb-1">
          {title}
        </h2>

        {subtitle && (
          <p className="text-gray-400 text-sm mb-8">
            {subtitle}
          </p>
        )}

        {/* FORM / CONTENT */}
        {children}

      </div>
    </div>
  );
}




