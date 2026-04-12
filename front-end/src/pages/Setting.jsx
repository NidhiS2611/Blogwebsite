import { Link } from "react-router-dom";
// Trash2 icon add kar lena lucide-react se
import { User, Bell, Trash2 } from "lucide-react"; 

const Setting = () => {
  return (
    <div className=" bg-black py-10 text-white">
      <div className="max-w-5xl mx-auto px-4">

        {/* Page Title */}
        <h1 className="text-xl md:text-2xl font-bold mb-8">
          Settings
        </h1>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Left Column (Links only) */}
          <div className="space-y-4">
            <Link
              to="/settings/account"
              className="flex items-center gap-3 py-2 text-sm md:text-base text-gray-300 hover:text-violet-400 transition"
            >
              <User size={18} />
              Account Settings
            </Link>

            <hr className="border-neutral-800" />

            <Link
              to="/settings/notifications"
              className="flex items-center gap-3 py-2 text-sm md:text-base text-gray-300 hover:text-violet-400 transition"
            >
              <Bell size={18} />
              Notification Settings
            </Link>

            <hr className="border-neutral-800" />

            {/* --- DANGER ZONE LINK ADDED HERE --- */}
            <Link
              to="/settings/danger-zone"
              className="flex items-center gap-3 py-2 text-sm md:text-base text-gray-300 hover:text-violet-400 transition font-medium"
            >
              <Trash2 size={18} />
              Danger Zone
            </Link>

            <hr className="border-neutral-800" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Setting;




