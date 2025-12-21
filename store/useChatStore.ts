
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

export interface Chat {
    id: string;
    participants: string[];
    lastMessage: ChatMessage;
}

export interface ChatMessage {
    id: string;
    chatId: string;
    sender: string;
    receiver: string;
    text: string;
    mediaUrls?: string[];
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ChatState {
    socket: Socket | null;
    chats: Chat[];
    messages: Record<string, ChatMessage[]>;
    selectedChatId: string | null;
    typing: Record<string, boolean>; // track typing per chat
    loading: boolean;
    error: string | null;

    // socket actions
    connectSocket: (userId: string) => void;
    disconnectSocket: () => void;

    // Sync actions
    setChats: (chats: Chat[]) => void;
    addChat: (chat: Chat) => void;
    selectChat: (chatId: string | null) => void;
    clearChats: () => void;

    // API calls
    fetchUserChats: (userId: string) => Promise<Chat[] | void>;
    fetchMessages: (chatId: string) => Promise<ChatMessage[] | void>;
    createChat: (participants: string[]) => Promise<Chat | null>;
    sendMessage: (
        chatId: string,
        sender: string,
        receiver: string,
        text?: string,
        mediaUrls?: string[]
    ) => Promise<ChatMessage | null>;
    setTyping: (chatId: string, isTyping: boolean) => void;
    markChatMessageAsRead: (chatId: string) => void;
    deleteChat: (chatId: string) => Promise<void>;
    deleteMessage: (chatId: string, messageId: string) => Promise<void>;
}

const API_URL = "https://uniqnk.onrender.com/api/v1/chat"

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  chats: [],
  messages: {} as Record<string, ChatMessage[]>,
  selectedChatId: null,
  typing: {} as Record<string, boolean>,
  loading: false,
  error: null,

  connectSocket: (userId) => {
    const socket = io("https://uniqnk.onrender.com", {
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
        console.log("⚠️ Socket error:", err.message);
    });

    socket.on("newMessage", (message: ChatMessage) => {
      console.log("📩 Incoming socket message:", message);
      const { chatId } = message;
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message],
        },
      }));
    });

    // Typing indicator from other users
    socket.on("typing", ({ chatId, senderId, isTyping }: any) => {
        set((state) => ({
            typing: { ...state.typing, [chatId]: isTyping },
        }));
    });

        set({ socket });
    },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  setTyping: (chatId, isTyping) =>
  set((state) => ({
    typing: { ...state.typing, [chatId]: isTyping },
  })),

  setChats: (chats) => set({ chats }),
   addChat: (chat) =>
    set((state) => ({
      chats: state.chats.some((c) => c.id === chat.id)
        ? state.chats
        : [...state.chats, chat],
    })),
  selectChat: (chatId) => set({ selectedChatId: chatId }),
  clearChats: () => set({ chats: [], messages: {}, selectedChatId: null }),

  /**
   * 🔹 Fetch all chats for a user
   */
    fetchUserChats: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/user/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch chats");
            const data = await response.json();
            const jsonData = JSON.parse(JSON.stringify(data.data, null, 2));
            set({ chats: jsonData, loading: false });
            return jsonData;
        } catch (error) {
            set({ error: `Failed to fetch chats: ${error}`, loading: false });
        } finally {
            set({ loading: false });
        }
    },

    /**
     * 🔹 Fetch all messages in a chat
     */
    fetchMessages: async (chatId) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/${chatId}/all-messages`);
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            set((state) => ({
                messages: { ...state.messages, [chatId]: data.data },
                loading: false,
            }));
            return data.data;
        } catch (error) {
            set({ error: `Failed to fetch messages: ${error}`, loading: false });
        }
    },

    /**
     * 🔹 Create a new chat
     */
    createChat: async (participants) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participants }),
            });
            if (!response.ok) throw new Error("Failed to create chat");
            const data: Chat = await response.json();
            set({ chats: [...get().chats, data], loading: false });
            return data;
        } catch (error) {
            set({ error: `Failed to create chat: ${error}`, loading: false });
            return null;
        }
    },

    /**
     * 🔹 Send a message (updates messages + chat)
     */
    sendMessage: async (chatId, sender, receiver, text, mediaUrls) => {
        set({ loading: true, error: null });

        const { socket } = get();

        // Build the message payload
        const payload: ChatMessage = {
            id: String(Date.now()),
            chatId,
            sender,
            receiver,
            text,
            mediaUrls,
            isRead: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

            // ✅ Optimistically update UI
        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: [...(state.messages[chatId] || []), payload],
            },
        }));
        
        try {
            // ✅ Use Socket.IO if connected
            if (socket && socket.connected) {
                console.log("📤 Sending via Socket.IO:", payload);
                socket.emit("sendMessage", payload);
                // return payload;
            // }

                // 🔁 Otherwise fallback to REST API
                // console.log("🌐 Socket offline → sending via HTTP");

                const response = await fetch(`${API_URL}/send`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatId, sender, receiver, text, mediaUrls }),
                });

                if (!response.ok) throw new Error("Failed to send message");

                const resData = await response.json();
                console.log("API response data: ", resData);

                if (!resData || !resData.data) throw new Error("No data returned from API");

                // Normalize lastMessage to an array
                const lastMsgArray = Array.isArray(resData.data.lastMessage)
                ? resData.data.lastMessage
                : [resData.data.lastMessage];

                const newMsg = lastMsgArray[0] || payload;
                if (!newMsg) throw new Error("No message returned from API");

                set({
                // messages: {
                //     ...state.messages,
                //     [chatId]: [...(state.messages[chatId] || []), newMsg],
                // },
                loading: false,
                });
            

                return newMsg; // return the actual message
            }
        } catch (error) {
            console.error("Error sending message:", error);
            set({ error: `Failed to send message: ${error}`, loading: false });
            return null;
        }
    },

   /**
     * Mark all messages as read in a chat
     * 
     * @param chatId - ID of the chat
     */
    markChatMessageAsRead: async (chatId: string) => {
        try {
            const response = await fetch(`${API_URL}/read/${chatId}`, {
                method: "PUT",
            });
            if (!response.ok) throw new Error("Failed to mark messages as read");

            // Only update messages for the given chatId
            const updatedMessages = { ...get().messages };
            if (updatedMessages[chatId]) {
                updatedMessages[chatId] = updatedMessages[chatId].map((msg) => ({
                    ...msg,
                    isRead: true,
                }));
            }

            set({ messages: updatedMessages });
            return true;
        } catch (error) {
            set({ error: `Failed to mark messages as read: ${error}`, loading: false });
            return false;
        }
    },


    /**
     * 🔹 Delete a chat
     */
    deleteChat: async (chatId) => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/${chatId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete chat");
            set((state) => ({
                chats: state.chats.filter((chat) => chat.id !== chatId),
                loading: false,
            }));
        } catch (error) {
            set({ error: `Failed to delete message: ${error}`, loading: false });
        }
    },

    /**
     * 🔹 Delete a specific message
     */
    deleteMessage: async (chatId, messageId) => {
        try {
            const response = await fetch(`${API_URL}/${chatId}/message/${messageId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete message");
            set((state) => ({
                messages: { ...state.messages, [chatId]: (state.messages[chatId] || []).filter((msg) => msg.id !== messageId) },
                loading: false,
            }));
        } catch (error) {
            set({ error: `Failed to delete message: ${error}`, loading: false });
        }
    },
}));
