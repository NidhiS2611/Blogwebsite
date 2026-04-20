import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Notificationlistener from "./component/Notificationlisner.jsx";
import Homelayout from "./layout/Homelayout ";
import AuthLanding from "./pages/Authlandingpage.jsx";
import Forgotpasswordflow from "./pages/Forgotpasswordflow.jsx";
import Chat from "./pages/Chat.jsx";

import { useAuth } from "./context/Authcontext";
import { socket } from "./server.js"; // ✅ FIXED

// 🔥 Lazy Pages
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Blogdetails = lazy(() => import("./pages/Blogdetails"));
const Createblog = lazy(() => import("./pages/Createblog"));
const Explore = lazy(() => import("./pages/Explore"));
const Profile = lazy(() => import("./pages/Profile"));
const Setting = lazy(() => import("./pages/Setting.jsx"));
const Bookmarks = lazy(() => import("./pages/Bookmarks.jsx"));
const DangerZone = lazy(() => import("./pages/DangerZone.jsx"));
const Notificationsetting = lazy(() =>
  import("./pages/Notificationsetting.jsx")
);
const Accountsetting = lazy(() =>
  import("./pages/Accountsetting.jsx")
);
const Notificationpage = lazy(() =>
  import("./pages/Notificationpage.jsx")
);

function App() {

  const { user } = useAuth(); // ✅ hook top pe

  // 🔔 Notification + SW
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification Permission:", permission);
      });
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((reg) => console.log("✅ SW Registered:", reg))
        .catch((err) => console.error("❌ SW failed:", err));
    }
  }, []);

  // ================= SOCKET CONNECT ================= //
  useEffect(() => {
    if (!user?._id) return;

    // 🔥 auth pass karo
    socket.auth = {
      userId: user._id,
    };

    // 🔥 connect karo (autoConnect false hai)
    socket.connect();

    // 🟢 CONNECT
    const onConnect = () => {
      console.log("🟢 Connected:", socket.id);
    };

    // ❌ ERROR
    const onError = (err) => {
      console.log("❌ Socket Error:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);

      // ⚠️ optional: disconnect mat kar agar pura app me use ho raha
      // socket.disconnect();
    };
  }, [user]);

  // ================= UI ================= //
  return (
    <Router>
      <Notificationlistener />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notifications" element={<Notificationpage />} />
          <Route path="/" element={<AuthLanding />} />
          <Route path="/forgot-password" element={<Forgotpasswordflow />} />

          {/* Chat */}
          <Route path="/chat" element={<Chat />} />

          {/* Layout */}
          <Route element={<Homelayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="blog/:id" element={<Blogdetails />} />
            <Route path="createblog" element={<Createblog />} />
            <Route path="explore" element={<Explore />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="settings" element={<Setting />} />
            <Route
              path="settings/notifications"
              element={<Notificationsetting />}
            />
            <Route
              path="settings/account"
              element={<Accountsetting />}
            />
            <Route path="settings/danger-zone" element={<DangerZone />} />
            <Route path="bookmarks" element={<Bookmarks />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;



