import { create } from "zustand";

interface IUserSettings {
    profile: {
        showActivityStatus: boolean;
        showLastSeen: boolean;
        profileVisibility: "public" | "followers" | "private";
    };
    login: {
        biometricEnabled: boolean;
        pinEnabled: boolean;
    };
    notifications: {
        likes: boolean;
        comments: boolean;
        followers: boolean;
        reposts: boolean;
        liveReels: boolean;
        interactedPosts: boolean;
        mentions: boolean;
        sound: boolean;
        vibration: boolean;
        // 🔔 Email notifications
        email: {
            feedbackEmails: boolean;      // surveys, feedback requests
            reminderEmails: boolean;      // reminders, scheduled actions
            promotionalEmails: boolean;   // marketing & promos
            productEmails: boolean;       // product updates, new features
            supportEmails: boolean;       // support replies, ticket updates
            securityEmails: boolean;      // password reset, login alerts
        };
    };
    security: {
        authenticatorSecret: string;
        securityQuestionEnabled: boolean;
        securityQuestion?: {
            questionId: string;
            answerHash: string;
        };

        twoFactorEnabled: boolean;
        twoFactorMethods: {
            authenticator: boolean;
            sms: boolean;
            email: boolean;
        };
        loginAlerts: boolean;
        authorizedDevices: {
            device: string;
            ip: string;
            lastActive: Date;
        }[];
    };
    activity: {
        recentSearches: string[];
        loginHistory: {
            device: string;
            location: string;
            ip: string;
            date: Date;
        }[];
    };
    privacy: {
        allowTagsFrom: "everyone" | "followers" | "no_one";
        allowMessagesFrom: "everyone" | "followers";
        dataDownload: boolean;
    };
    restrictions: {
        mutedUsers: string[];
        restrictedUsers: string[];
    };
    support: {
        reports: {
            category: string;
            description: string;
            images: string[];
            createdAt: Date;
        }[];
    };
    legal: {
        termsAccepted: boolean;
        privacyPolicyAccepted: boolean;
    };
}

interface TransactionPin {
  pinHash: string;
  pinSet: boolean;
  pinUpdatedAt: Date;
  failedAttempts: number;
  lockedUntil?: Date;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  transactionalPin?: TransactionPin;
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
  settings: IUserSettings;
}

interface UserState {
  user: User | null;
  getUserById: (id: string) => Promise<void>;
  updateUserById: (id: string, user: Partial<User>) => Promise<void>;
  followUser: (userId: string, targetUserId: string) => Promise<void>;
  unfollowUser: (userId: string, targetUserId: string) => Promise<void>;
  changePassword: (id: string, currentPassword: string, newPassword: string) => Promise<boolean>;
  setTransactionPin: (userId: string, pin: string) => Promise<void>;
  verifyTransactionPin: (userId: string, pin: string) => Promise<boolean>;
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

  changePassword: async (id, currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/${id}/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      console.log("Response:", response);
      const data = await response.json();
      console.log("Password changed:", data);

      // ❗ Throw on backend failure
      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }
      
      return data.success;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  },

  setTransactionPin: async (userId, pin) => {
    try {
      const response = await fetch(`${API_URL}/${userId}/set-transactional-pin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          transactionalPin: String(pin),
         }),
      });
      const data = await response.json();
      console.log("Transaction pin set:", data);
      set((state) => ({
        user: state.user ? { ...state.user, transactionalPin: data.transactionalPin } : null,
      }));
    } catch (error) {
      console.error("Error setting transaction pin:", error);
    }
  },

  verifyTransactionPin: async (userId, pin) => {
    try {
      const response = await fetch(`${API_URL}/${userId}/verify-transactional-pin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      console.log("Transaction pin verified:", data);
      return data.valid;
    } catch (error) {
      console.error("Error verifying transaction pin:", error);
      return false;
    }
  },
}));
