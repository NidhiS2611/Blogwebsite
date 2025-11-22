import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();
    // Dummy user (temporary)
  const currentUser = {
    name: "Nidhi Shakya",
    avatar: "👩‍💻",
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/#blog" },
    { label: "Categories", href: "/#categories" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">📚</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            StudyHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-700 hover:text-purple-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <Link to="/create-blog" className="hover:text-purple-600">
                ✍️ Create Blog
              </Link>
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                <span className="text-2xl">{currentUser.avatar || "👤"}</span>
                <span className="hidden lg:inline text-gray-700">{currentUser.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-600">
                Login
              </Link>
              <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-200 space-y-2">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="block py-2">
              {link.label}
            </a>
          ))}

          <hr className="border-gray-300" />

          {currentUser ? (
            <>
              <Link to="/create-blog" onClick={() => setIsOpen(false)} className="block py-2">
                ✍️ Create Blog
              </Link>
              <Link to="/profile" className="block py-2" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className="block py-2 text-left text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2">
                Login
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 bg-purple-600 text-white rounded-lg text-center">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
