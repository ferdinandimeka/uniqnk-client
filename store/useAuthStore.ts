import { create } from "zustand";

// interface User {
//   _id: string;
//   email: string;
//   name?: string;
//   photo_url?: string;
//   email_verified: boolean;
//   user_type?: string;
// }

export interface User {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  profilePicture?: string;
  friends?: string[];
  followers?: string[];
  following?: string[];
  posts?: string[];
  groups?: string[];
  pages?: string[];
  friendRequests?: string[];
  blockedUsers?: string[];
  stories?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface AuthState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  users: User | null;
  error: string | null;
  signup: (email: string, password: string, phone: string, username: string, fullName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoggingIn: false,
  users: null,
  error: null,

  login: async (email, password) => {
    set({ isLoggingIn: true, error: null });

    try {
      console.log("🚀 Starting login fetch with", { email, password });

      // Android Emulator
      const API_URL = "https://uniqnk.onrender.com/api/v1/auth/login/";

      // or for physical device
      // const API_URL = "http://192.168.1.45:4000/api/v1/auth/login/";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("✅ Fetch status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        set({ error: "Server error", isLoggingIn: false });
        return;
      }

      console.log("📦 Login response:", data);

      if (!res.ok) {
        set({
          error: data.error || "Invalid credentials",
          isLoggingIn: false,
        });
        return;
      }

      set({ isAuthenticated: true, users: data, isLoggingIn: false });
    } catch (err) {
      console.error("🌐 Network error:", err);
      set({ error: "Network error", isLoggingIn: false });
    }
  },

  signup: async (email, password, phone, username, fullName) => {
    set({ isLoggingIn: true, error: null });

    try {
      console.log("🚀 Starting signup fetch with", { email, password, phone, username, fullName });

      // Android Emulator
      const API_URL = "https://uniqnk.onrender.com/api/v1/auth/register/";

      // or for physical device
      // const API_URL = "http://192.168.1.45:4000/api/v1/auth/login/";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone, username, fullName }),
      });

      console.log("✅ Fetch status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("❌ Failed to parse JSON:", err);
        set({ error: "Server error", isLoggingIn: false });
        return;
      }

      console.log("📦 Signup response:", data);

      if (!res.ok) {
        set({
          error: data.error || data.message || "Signup failed",
          isLoggingIn: false,
        });
        return;
      }

      // set({ isAuthenticated: true, user: data, isLoggingIn: false });
      set({ isLoggingIn: false });
    } catch (err) {
      console.error("🌐 Network error:", err);
      set({ error: "Network error", isLoggingIn: false });
    }
  },

  logout: () => set({ isAuthenticated: false, users: null }),
  clearError: () => set({ error: null }),
}));
