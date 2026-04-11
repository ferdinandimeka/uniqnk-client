import { useNotificationStore } from "@/store/useNotificationStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://uniqnk.onrender.com");

export const useNotificationSocket = (userId: string) => {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    socket.emit("join", userId);

    socket.on("notification:new", (notification) => {
      addNotification(notification);
    });

    return () => {
      socket.off("notification:new");
    };
  }, [userId]);
};