import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const listenToForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("🔥 FOREGROUND MESSAGE RECEIVED:", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.data?.title || payload.notification?.title, {
        body: payload.data?.body || payload.notification?.body,
      });
    }
  });
};
