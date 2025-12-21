import { create } from "zustand";

export interface Story {
    _id: string;
    userId: string;
    contentUrl: string;
    text: string;
    backgroundColor: string;
    createdAt: string; // ISO date string
    expiresAt: string; // ISO date string
}

interface StoryState {
    stories: Story[];
    isLoading: boolean;
    error: string | null;

    getAllStories: () => Promise<void>;
    createStory: (story: Partial<Story>) => Promise<Story | null>;
    deleteStory: (id: string) => Promise<void>;
    getStoryById: (id: string) => Promise<Story | null>;
    addViewToStory: (storyId: string, userId: string) => Promise<void>;
    markViewedStories: (storyId: string) => Promise<void>;
}


const API_URL = "https://uniqnk.onrender.com/api/v1/stories"; // adjust base URL

export const useStoryStore = create<StoryState>((set, get) => ({
    stories: [],
    isLoading: false,
    error: null,


    getAllStories: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            set({ stories: data.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: `${error}` });
        }
    },

    createStory: async (story) => {
        const { stories } = get();
        set({ isLoading: true, error: null });  
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(story),
            });
            const res = await response.json();
            console.log("story data: ", res);
            set({ stories: [res.data, ...stories], isLoading: false });
            return res;
        } catch (error) {
            set({ isLoading: false, error: `${error}` });
            return null;
        }
    },

    deleteStory: async (id) => {},
    getStoryById: async (id) => {},
    addViewToStory: async (storyId, userId) => {},
    markViewedStories: async (storyId) => {},
}));
