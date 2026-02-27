import { create } from "zustand";

/* =======================
   Types
======================= */

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  followers: boolean;
  reposts: boolean;
  liveReels: boolean;
  interactedPosts: boolean;
  profileViews: boolean;
  mentions: boolean;
  sound: boolean;
  vibration: boolean;
  email: {
    feedbackEmails: boolean,
    reminderEmails: boolean,
    promotionalEmails: boolean,
    productEmails: boolean,
    supportEmails: boolean,
  }
}

export interface ProfileSettings {
  showActivityStatus: boolean;
  showLastSeen: boolean;
  profileVisibility: "public" | "followers" | "private";
}

export interface SecuritySettings {
  authenticatorSecret: string;
  securityQuestionEnabled: boolean;
  securityQuestion?: {
    questionId: string;
    answer: string;
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
}

export interface PrivacySettings {
  allowTagsFrom: "everyone" | "followers" | "no_one";
  allowMessagesFrom: "everyone" | "followers";
  dataDownload: boolean;
}

export interface Login {
  biometricEnabled: boolean;
  pinEnabled: boolean;
}

export interface UserSettings {
  profile: ProfileSettings;
  login: Login;
  notifications: NotificationSettings;
  security: SecuritySettings;
  privacy: PrivacySettings;
}

/* =======================
   Store State
======================= */

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;

  fetchSettings: (userId: string) => Promise<void>;
  updateNotifications: (
    userId: string,
    data: Partial<NotificationSettings>
  ) => Promise<void>;

  updateAuth: (
    userId: string,
    data: Partial<Login>
  ) => Promise<void>;

  updateProfile: (
    userId: string,
    data: Partial<ProfileSettings>
  ) => Promise<void>;

  updatePrivacy: (
    userId: string,
    status: boolean
  ) => Promise<void>;

  setSecurityQuestion: (
    userId: string,
    questionId: string,
    answer: string
  ) => Promise<void>;

  enableAccount:(userId: string) => Promise<void>;
  disableAccount:(userId: string, reason: string) => Promise<void>;
  deactivateAccount:(userId: string, reason: string) => Promise<void>;
  reactivateAccount:(userId: string) => Promise<void>;
  restrictAccount:(userId: string, reason: string) => Promise<void>;
  unRestrictAccount:(userId: string) => Promise<void>;
}

/* =======================
   API BASE
======================= */

const API_BASE = "https://uniqnk.onrender.com/api/v1/settings";

/* =======================
   Zustand Store
======================= */

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  /* -----------------------
     Fetch All Settings
  ----------------------- */
  fetchSettings: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${userId}`);
      const data = await res.json();
      console.log("Fetched Settings:", data);
      set({
        settings: data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: `${error}` });
    }
  },

  /* -----------------------
     Update Notifications
  ----------------------- */
  updateNotifications: async (
    userId: string,
    payload: Partial<NotificationSettings>
  ) => {
    if (!userId) {
      console.warn("updateNotifications aborted: missing userId");
      return;
    }

    console.log("🚀 updateNotifications API call", {
      userId,
      payload,
    });

    try {
      const res = await fetch(`${API_BASE}/${userId}/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Optional: sync local store
      set(state => ({
        settings: state.settings
          ? {
              ...state.settings,
              notifications: {
                ...state.settings.notifications,
                ...payload,
              },
            }
          : state.settings,
      }));

      return data.data;
    } catch (error) {
      set({ error: `${error}` });
    }
  },

  updateAuth: async (
    userId: string,
    payload: Partial<Login>
  ) => {
    if (!userId) {
      console.warn("updateAuth aborted: missing userId");
      return;
    }

    console.log("🚀 updateAuth API call", {
      userId,
      payload,
    });

    try {
      const res = await fetch(`${API_BASE}/${userId}/login`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Optional: sync local store
      set(state => ({
        settings: state.settings
          ? {
              ...state.settings,
              login: {
                ...state.settings.login,
                ...payload,
              },
            }
          : state.settings,
      }));

      return data.data;
    } catch (error) {
      set({ error: `${error}` });
    }
  },

  /* -----------------------
     Update Profile Settings
  ----------------------- */
  updateProfile: async (userId, updates) => {
    set({ isLoading: true, error: null });
    try {
      await fetch(`${API_BASE}/${userId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      set((state) => ({
        settings: state.settings
          ? {
              ...state.settings,
              profile: {
                ...state.settings.profile,
                ...updates,
              },
            }
          : state.settings,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: `${error}` });
    }
  },

  /* -----------------------
     Update Privacy Settings
  ----------------------- */
  updatePrivacy: async (userId, status) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${userId}/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "status": status
        }),
      });

      const data = await res.json();
      console.log("Update Privacy Response:", data?.data);

      set((state) => ({
        settings: state.settings
          ? {
              ...state.settings,
              privacy: {
                ...state.settings.privacy,
                status,
              },
            }
          : state.settings,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: `${error}` });
    }
  },

  setSecurityQuestion: async (
    userId: string,
    questionId: string,
    answer: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${userId}/security-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          answer,
        }),
      });
      const data = await res.json();
      console.log("Set Security Question Response:", data);
      set((state) => ({
        settings: state.settings
          ? {
              ...state.settings,
              securityQuestionEnabled: true,
              securityQuestion: {
                questionId,
                answer,
              },
            }
          : state.settings,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: `${error}` });
    }
  },
  enableAccount: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${userId}/enable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
        const data = await res.json();
        console.log("Enable Account Response:", data);
      set((state) => ({
        settings: state.settings
          ? {
              ...state.settings,
              accountEnabled: true,
            }
          : state.settings,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: `${error}` });
    }
  },
  disableAccount: async (userId: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${userId}/disable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      console.log("Disable Account Response:", data);
      set((state) => ({
        settings: state.settings
          ? {
              ...state.settings,
              accountEnabled: false,
            }
          : state.settings,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false, error: `${error}` });
    }
  },
  deactivateAccount:async(userId: string, reason: string)=>{
    set({ isLoading: true, error: null });
    try{
      await fetch(`${API_BASE}/${userId}/deactivate-account`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ reason }),
      })
      set((state)=>({
        settings : state.settings
          ?{
            ...state.settings,
            accountStatus:"deactivated"
          }
          :state.settings,
          isLoading:false
      }))
    }catch(error){
      set({isLoading:false,error:`${error}`})
    }
  },
  reactivateAccount: async(userId: string)=>{
    set({isLoading:true,error:null});
    try{
      await fetch(`${API_BASE}/${userId}/reactivate-account`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
      })
      set((state)=>({
        settings : state.settings
          ?{
            ...state.settings,
            accountStatus:"active"
          }
          :state.settings,
          isLoading:false
      }))
    }catch(error){
      set({isLoading:false,error:`${error}`})
    }
  },

  restrictAccount: async(userId: string, reason: string)=>{
    set({isLoading:true,error:null});
    try {
      await fetch(`${API_BASE}/${userId}/restrict`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ reason }),
      })
      set((state)=>({
        settings : state.settings
          ?{
            ...state.settings,
            restrictions: reason
          }
          :state.settings,
          isLoading:false
      }))
    }catch(error){
      set({isLoading:false,error:`${error}`})
    }
  },

  unRestrictAccount: async(userId: string)=>{
    set({isLoading:true,error:null});

    try {
      await fetch(`${API_BASE}/${userId}/unrestrict`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        }
      })
      set((state)=>({
        settings : state.settings
          ?{
            ...state.settings,
            restrictions: null
          }
          :state.settings,
          isLoading:false
      }))
    }catch(error){
      set({isLoading:false,error:`${error}`})
    }
  },

}));