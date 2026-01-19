import Navbar from "../component/Navbar";
import { Outlet } from "react-router-dom";

export default function Homelayout() {
  return (
    <div className="min-h-screen ">

      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* PAGE CONTENT */}
      <div className="pt-10 ">
        <Outlet />
      </div>

    </div>
  );
}