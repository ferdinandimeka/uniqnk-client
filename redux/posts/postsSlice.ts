import { genericLoader } from "@/common/utils/redux";
import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  initialState: {} as any,
  name: "posts",
  reducers: {
    postsLoader: genericLoader,
  },
});

export const postsReducer = postsSlice.reducer;
export const { postsLoader } = postsSlice.actions;
