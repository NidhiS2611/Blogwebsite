import { getToken } from "firebase/messaging";
import axios from "axios";
import { messaging } from "./firebase";
import api  from "../services/Axiosinstance"

export const requestPermissionAndGetToken = async () => {
  try {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service worker not supported");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification denied");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    console.log("🔥 VAPID FROM ENV:", vapidKey);

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("❌ Token not generated");
      return;
    }

    console.log("✅ FCM TOKEN:", token);

    await api.post(
      "/user/save-token",
      { token },
      { withCredentials: true }
    );

  } catch (err) {
    console.error("❌ FCM ERROR:", err);
  }
};

