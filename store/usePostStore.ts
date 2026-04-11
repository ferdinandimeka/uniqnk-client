// store/usePostStore.ts
import { create } from "zustand";

export interface Reaction {
  user: string; // ObjectId
  type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
  timestamp: string;
}

export interface Location {
    name?: string;
    latitude?: number;
    longitude?: number;
}

export interface User {
    _id: "string",
    fullName: "string",
    username: "string",
    profilePicture: "string",
}

export interface Post {
  _id: string;
  user: User;
  content: string;
  mediaUrls?: string[];
  location?: Location;
  likes: string[];
  comments: string[];
  shares: string[];
  reactions: Reaction[];
  rank?: number;
  createdAt: string;
  updatedAt: string;
}

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;

  getRankedPosts: (userId: string) => Promise<void>;
  getAllPosts: () => Promise<void>;
  getPostById: (postId: string) => Promise<Post | null>;
  createPost: (post: Partial<Post>) => Promise<Post | null>;
  updatePost: (postId: string, post: Partial<Post>) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<void>;

  likePost: (postId: string, userId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  sharePost: (postId: string, userId: string) => Promise<void>;
  unsharePost: (postId: string, userId: string) => Promise<void>;
  reactToPost: (postId: string, reactionType: Reaction["type"]) => Promise<void>;
  unreactToPost: (postId: string, userId: string, reactionType: Reaction["type"]) => Promise<void>;
  commentToPost: (postId: string, userId: string, comment: string) => Promise<void>;
  uncommentToPost: (postId: string, commentId: string) => Promise<void>;
}

const API_URL = "https://uniqnk.onrender.com/api/v1/posts"; // adjust base URL

export const usePostStore = create<PostState>((set, get) => ({
    posts: [],
    isLoading: false,
    error: null,

    getRankedPosts: async (userId) => {
        set({ isLoading: true, error: null });
        try {
        const res = await fetch(`${API_URL}/ranked?userId=${userId}`);
        const data = await res.json();
        // console.log("Fetched ranked posts:", data);
        set({ posts: data.data ?? data, isLoading: false });
        } catch (err) {
        set({ error: `Failed to fetch ranked posts: ${err}`, isLoading: false });
        }
    },
    getAllPosts: async () => {
        // const { posts } = get();
        set({ isLoading: true, error: null });
        try {
        const res = await fetch(`${API_URL}/all`);
        const data = await res.json();
        // console.log("Fetched all posts:", data);
        set({ posts: data.data ?? data, isLoading: false });
        } catch (err) {
        set({ error: `Failed to fetch all posts: ${err}`, isLoading: false });
        }
    },

    getPostById: async (postId) => {
        try {
        const res = await fetch(`${API_URL}/${postId}`);
        const data = await res.json();
        // console.log("Fetched post by id:", data);
        return data.data;
        } catch {
        return null;
        }
    },

    createPost: async (post) => {
        try {
        const res = await fetch(`${API_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
        });
        const data = await res.json();
        set({ posts: [data.data, ...get().posts] });
        console.log("Created post:", data);
        return data.data;
        } catch {
        return null;
        }
    },

    updatePost: async (postId, post) => {
        try {
        const res = await fetch(`${API_URL}/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
        });
        const data = await res.json();
        set({
            posts: get().posts.map((p) => (p._id === postId ? data.data : p)),
        });
        return data.data;
        } catch {
        return null;
        }
    },

    deletePost: async (postId) => {
        try {
        await fetch(`${API_URL}/${postId}`, { method: "DELETE" });
        set({ posts: get().posts.filter((p) => p._id !== postId) });
        } catch {}
    },

    likePost: async (postId, userId) => {
        try {
            const response = await fetch(`${API_URL}/${postId}/like-post`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            // console.log("Like post request sent:", { postId, userId });
            if (!response.ok) throw new Error("Failed to like post");
            const data = await response.json();
            console.log("Like post response data:", data);
            set((state) => ({
            posts: state.posts.map((p) =>
                p._id === postId ? { ...p, likes: [...p.likes, userId] } : p
            ),
            isLoading: false,
            }));
        } catch (error) {
            set({ error: `Failed to like post: ${error}`, isLoading: false });
        }
    },

    unlikePost: async (postId, userId) => {
        try {
            const response = await fetch(`${API_URL}/${postId}/unlike`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            console.log("UnLike post request sent:", { postId, userId });
            console.log("Response status:", response);
            if (!response.ok) throw new Error("Failed to unlike post");
            const data = await response.json();
            console.log("UnLike post response data:", data);
            set((state) => ({
            posts: state.posts.map((p) =>
                p._id === postId
                ? { ...p, likes: p.likes.filter((id) => id !== userId) }
                : p
            ),
            isLoading: false,
            }));
        } catch (error) {
            set({ error: `Failed to unlike post: ${error}`, isLoading: false });
        }
    },

    sharePost: async (postId, userId) => {
        await fetch(`${API_URL}/${postId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        });
        await get().getPostById(postId);
    },

    unsharePost: async (postId, userId) => {
        await fetch(`${API_URL}/${postId}/unshare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        });
        await get().getPostById(postId);
    },

    reactToPost: async (postId, reactionType) => {
        await fetch(`${API_URL}/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType }),
        });
        await get().getPostById(postId);
    },

    unreactToPost: async (postId, userId, reactionType) => {
        await fetch(`${API_URL}/${postId}/unreact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reactionType }),
        });
        await get().getPostById(postId);
    },

    commentToPost: async (postId, userId, comment) => {
        try {
            const res = await fetch(`${API_URL}/${postId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment, userId }),
            });
            const data = await res.json();
            console.log("🟩 Incoming comment data:", { postId, userId, comment });
            console.log("Commented to post:", data);
            set({
                posts: get().posts.map((p) => (p._id === postId ? data.data : p)),
            });
            return data.data;
            } catch {
            return null;
        }
        // await get().getPostById(postId);
    },

    uncommentToPost: async (postId, commentId) => {
        await fetch(`${API_URL}/${postId}/uncomment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
        });
        await get().getPostById(postId);
    },
}));
