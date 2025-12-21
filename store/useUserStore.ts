import { create } from "zustand";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  bio: string;
  gender: string;
  marital_status: string;
  friends?: string[];
  followers?: string[];
  following?: string[];
  profilePicture?: string;
  posts?: string[];
  groups?: string[];
  pages?: string[];
  friendRequests?: string[];
  blockedUsers?: string[];
  stories?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface UserState {
  user: User | null;
  getUserById: (id: string) => Promise<void>;
  updateUserById: (id: string, user: Partial<User>) => Promise<void>;
  followUser: (userId: string, targetUserId: string) => Promise<void>;
  unfollowUser: (userId: string, targetUserId: string) => Promise<void>;
}

const API_URL = "https://uniqnk.onrender.com/api/v1/users";

export const useUserStore = create<UserState>((set) => ({
  user: null,

  // Fetch user by ID
  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();
      console.log("Fetched user:", data.user);
      // if (data?.user) {
        set({ user: data.user });
        return data.user; // ✅ Important: Return user for external use
      // }
      // return null;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },

  // Update user by ID
  updateUserById: async (id, user) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log("Updated user:", data);
      if (data?.user) {
        set({ user: data.user });
        return data.user; // ✅ Important: Return user for external use
      }
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  // Follow another user
  followUser: async (userId, targetUserId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}/follow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await response.json();
      console.log("Followed user:", data);
      set({ user: data.user });
    } catch (error) {
      console.error("Error following user:", error);
    }
  },

  // Unfollow a user
  unfollowUser: async (userId, targetUserId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}/unfollow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await response.json();
      console.log("Unfollowed user:", data);
      set({ user: data.user });
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  },
}));
