import { useEffect } from "react";
import { listenToForegroundMessages } from "../firebase/FirebaseMessaging";

const Notificationlistener = () => {
  useEffect(() => {
    listenToForegroundMessages();
  }, []);

  return null;
};

export default Notificationlistener;


