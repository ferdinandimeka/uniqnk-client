import { create } from "zustand";

interface users {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface Notification {
  _id?: string;
  user: string | number;
  type: string;
  actors: users[];
  count: number;
  post?: string | number;
  comment?: string | number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  getUserNotifications: (userId: string) => Promise<void>;
  getUnreadNotification: (userId: string) => Promise<void>;

  addNotification: (notification: Notification) => void;

  markAsRead: (notificationId: string, userId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;

  deleteOlderNotifications: (date: Date) => Promise<void>;
}

const API_URL = "https://uniqnk.onrender.com/api/v1/notifications";

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // fetch notifications
  getUserNotifications: async (userId: string) => {
    try {
      set({ isLoading: true });

      const res = await fetch(`${API_URL}/user/${userId}`);
      const data = await res.json();
      // const response = JSON.stringify(data, null, 2)
      console.log("API Response:", JSON.stringify(data, null, 2))

      set({
        notifications: data || [],
        isLoading: false,
      });

      // return data.data
    } catch (err) {
      set({ error: "Failed to fetch notifications", isLoading: false });
    }
  },

  // fetch unread count
  getUnreadNotification: async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/unread-count/${userId}`);
      const data = await res.json();

      set({
        unreadCount: data.data || 0,
      });
    } catch {
      set({ unreadCount: 0 });
    }
  },

  // add realtime notification
  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // mark single notification as read
  markAsRead: async (notificationId: string, userId: string) => {
    try {
      const res = await fetch(`${API_URL}/mark-as-read/${notificationId}/${userId}`, {
        method: "PUT",
      });

      const data = await res.json()
      console.log("res: ", data)

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  // mark all notifications as read
  markAllAsRead: async (userId: string) => {
    try {
      await fetch(`${API_URL}/read-all/${userId}`, {
        method: "PUT",
      });

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    } catch {}
  },

  // delete old notifications
  deleteOlderNotifications: async (date: Date) => {
    try {
      await fetch(`${API_URL}/delete-older`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      set((state) => ({
        notifications: state.notifications.filter(
          (n) => new Date(n.createdAt) > date
        ),
      }));
    } catch {}
  },
}));