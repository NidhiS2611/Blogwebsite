import Navbar from "../component/Navbar";
import { Outlet } from "react-router-dom";

export default function Homelayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* SIDEBAR + MOBILE TOPBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="md:ml-64 pt-14">
        <Outlet />
      </main>

    </div>
  );
}


