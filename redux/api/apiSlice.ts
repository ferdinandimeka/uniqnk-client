import { genericLoader } from "@/common/utils/redux";
import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
  initialState: {} as any,
  name: "api",
  reducers: {
    apiLoader: genericLoader,
  },
});

export const apiReducer = apiSlice.reducer;
export const { apiLoader } = apiSlice.actions;
