import { create } from "zustand";

export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  },
  post: {
    _id: string;
    user: string;
    content: string;
    mediaUrls?: string[];
  } // ObjectId
  likes: string[]; // Array of ObjectId
  createdAt: Date;
  updatedAt: Date;
}

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;

    // You can add methods for fetching, adding, updating, and deleting comments here
    replyToPost: (postId: string, commentId: string) => Promise<void>;
    getCommentById: (id: string) => Promise<Comment | null>;
    likeAComment: (commentId: string, userId: string) => Promise<void>;
    unlikeAComment: (commentId: string, userId: string) => Promise<void>;
}

const API_URL = "https://uniqnk.onrender.com/api/v1/comments";

const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  isLoading: false,
  error: null,

    replyToPost: async (postId, commentId) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${API_URL}/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId, commentId }),
        });
        if (!response.ok) throw new Error("Failed to reply to comment");
        const data = await response.json();
        set((state) => ({
          comments: [...state.comments, data],
          isLoading: false,
        }));
      } catch (error) {
        set({ error: `Failed to reply to comment: ${error}`, isLoading: false });
      }
    },

    // getCommentById: async (id) => {
    //   set({ isLoading: true });
    //   try {
    //     const res = await fetch(`${API_URL}/${id}`);
    //     if (!res.ok) {
    //       const text = await res.text();
    //       throw new Error(`Failed to fetch comment: ${res.status} ${text}`);
    //     }
    //     const payload = await res.json();
    //     console.log("commentId: ", id);
    //     console.log("Fetched comment by id from comment store:", payload);
    //     // Support APIs that return the comment directly or wrapped in { data: ... }
    //     const comment: Comment = (payload && (payload.data ?? payload)) as Comment;
    //     set((state) => ({ comments: [...state.comments, comment], isLoading: false }));
    //     return comment;
    //   } catch (error) {
    //     set({ error: `Failed to fetch comment: ${error}`, isLoading: false });
    //     return null;
    //   } finally {
    //     set({ isLoading: false });
    //   }
    // },

    getCommentById: async (id) => {
      set({ isLoading: true });
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch comment: ${res.status}`);
        const payload = await res.json();
        const comment: Comment = (payload.data ?? payload) as Comment;

        set((state) => {
          const existing = state.comments.find((c) => c._id === comment._id);
          return existing
            ? { isLoading: false } // no update
            : { comments: [...state.comments, comment], isLoading: false };
        });

        return comment;
      } catch (error) {
        set({ error: `Failed to fetch comment: ${error}`, isLoading: false });
        return null;
      }
    },

    likeAComment: async (commentId, userId) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${API_URL}/${commentId}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error("Failed to like comment");
        const data = await response.json();
        console.log("Like comment response data:", data);
        set((state) => ({
          comments: state.comments.map((c) =>
            c._id === commentId ? { ...c, likes: [...c.likes, userId] } : c
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({ error: `Failed to like comment: ${error}`, isLoading: false });
      }
    },

    unlikeAComment: async (commentId, userId) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${API_URL}/${commentId}/unlike`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        if (!response.ok) throw new Error("Failed to unlike comment");
        const data = await response.json();
        console.log("UnLike comment response data:", data);
        set((state) => ({
          comments: state.comments.map((c) =>
            c._id === commentId ? { ...c, likes: c.likes.filter((id) => id !== userId) } : c
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({ error: `Failed to unlike comment: ${error}`, isLoading: false });
      }
    },

}));

export default useCommentStore;
