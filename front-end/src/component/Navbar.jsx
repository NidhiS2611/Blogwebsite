import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Bell,
  PenLine,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  BookmarkCheck,
  BarChart, // ✅ Naya icon import kiya
} from "lucide-react";
import { useAuth } from "../context/Authcontext";
import api from "../services/Axiosinstance";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!user) return;
    api
      .get("/notification/unread-count", { withCredentials: true })
      .then((res) => setUnreadCount(res.data.count))
      .catch(console.log);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-black border-b border-neutral-800 flex items-center px-4 z-50">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="text-white" />
        </button>

        <span className="text-white font-semibold ml-3 mr-auto">BlogSphere</span>

        <div className="flex items-center gap-3 relative" ref={mobileDropdownRef}>
          {/* ✅ Mobile par Bookmarks ka quick access chaho toh yahan bhi icon de sakte ho, 
              par humne sidebar mein de diya hai niche */}
          
          <button onClick={() => navigate("/notifications")} className="relative">
            <Bell className="text-white" size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          <button onClick={() => setMobileProfileOpen((p) => !p)}>
            <img
              src={user?.profilepicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-8 h-8 rounded-full object-cover"
              alt="profile"
            />
          </button>

          {mobileProfileOpen && (
            <div className="absolute right-0 top-12 w-44 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg text-sm z-50">
              <button
                onClick={() => {
                  navigate(`/profile/${user?._id}`);
                  setMobileProfileOpen(false);
                }}
                className="w-full px-4 py-2 flex gap-2 hover:bg-neutral-800 text-gray-300"
              >
                <User size={14} /> Profile
              </button>

            

              <button
                onClick={() => {
                  navigate("/settings");
                  setMobileProfileOpen(false);
                }}
                className="w-full px-4 py-2 flex gap-2 hover:bg-neutral-800 text-gray-300"
              >
                <Settings size={14} /> Settings
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileProfileOpen(false);
                }}
                className="w-full px-4 py-2 flex gap-2 hover:bg-neutral-800 text-red-400"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/60 z-40 md:hidden" />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-black border-r border-neutral-800 
        flex flex-col justify-between z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          <div className="h-16 flex items-center justify-between px-6 text-white font-semibold text-lg border-b border-neutral-800">
            BlogSphere
            <button className="md:hidden" onClick={closeSidebar}>
              <X />
            </button>
          </div>

          <nav className="px-4 py-4 space-y-2 text-sm">
            <SidebarLink to="/home" icon={<Home size={18} />} label="Home" onClick={closeSidebar} />

            <div className="hidden md:block">
              <SidebarLink to="/notifications" icon={<Bell size={18} />} label="Notifications" />
            </div>

            <SidebarLink to="/explore" icon={<Compass size={18} />} label="Explore" onClick={closeSidebar} />
            
            {/* ✅ Bookmarks Link - Mobile aur Desktop dono ke liye sidebar mein */}
            <SidebarLink to="/bookmarks" icon={<BookmarkCheck size={18} />} label="Saved" onClick={closeSidebar} />

            <SidebarLink to="/createblog" icon={<PenLine size={18} />} label="Write" highlight onClick={closeSidebar} />
            <SidebarLink to="/getstats" icon={<BarChart size={18} />} label="Analytics" onClick={closeSidebar} />
          </nav>
        </div>

        {/* BOTTOM PROFILE (DESKTOP) */}
        <div className="relative px-4 py-4 border-t border-neutral-800 hidden md:block" ref={dropdownRef}>
          <button onClick={() => setProfileOpen(!profileOpen)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800">
            <img
              src={user?.profilepicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-9 h-9 rounded-full object-cover"
              alt="profile"
            />
            <span className="text-gray-300 text-sm truncate">{user?.name || "Profile"}</span>
          </button>

          {profileOpen && (
            <div className="absolute bottom-16 left-4 w-52 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg text-sm">
              <button onClick={() => navigate(`/profile/${user?._id}`)} className="w-full px-4 py-2 flex gap-2 hover:bg-neutral-800 text-gray-300">
                <User size={14} /> Profile
              </button>
              
            

              <button onClick={() => navigate("/settings")} className="w-full px-4 py-2 flex gap-2 hover:bg-neutral-800 text-gray-300">
                <Settings size={14} /> Settings
              </button>
              <button onClick={handleLogout} className="w-full px-4 py-2 flex gap-2 hover:bg-neutral-800 text-red-400">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, highlight, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${isActive ? "bg-neutral-800 text-white font-medium" : "text-gray-400 hover:bg-neutral-800"}
        ${highlight && !isActive ? "text-violet-400" : ""}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

















