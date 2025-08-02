// import { apiReducer } from "@/redux/api/apiSlice";
// import authReducer from "@/redux/auth/authSlice";
// import { postsReducer } from "@/redux/posts/postsSlice";
// import uiReducer from "@/redux/ui/uiSlice";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // React Native specific
// import {
//   Action,
//   combineReducers,
//   configureStore,
//   ThunkAction,
//   ThunkDispatch
// } from "@reduxjs/toolkit";
// import { persistReducer, persistStore } from "redux-persist";

// // 1. Combine all reducers
// const allReducers = combineReducers({
//   auth: authReducer,
//   ui: uiReducer,
//   posts: postsReducer,
//   api: apiReducer,
// });

// // 2. Define RootState type
// export type RootState = ReturnType<typeof allReducers>;

// // 3. Thunk types
// export type FetchThunk<T = Promise<void>> = ThunkAction<
//   T,
//   RootState,
//   never,
//   Action
// >;
// export type AppDispatch = ThunkDispatch<RootState, never, Action>;

// // 4. Set up persistence
// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage: AsyncStorage,
//   whitelist: ["auth", "ui"], // optional: choose what slices to persist
// };

// const persistedReducer = persistReducer(persistConfig, allReducers);

// // 5. Create store
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           "persist/PERSIST",
//           "persist/REHYDRATE",
//           "persist/PAUSE",
//           "persist/FLUSH",
//           "persist/PURGE",
//           "persist/REGISTER",
//         ],
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export default store;

import { apiReducer } from "@/redux/api/apiSlice"; // This is your custom slice
import authReducer from "@/redux/auth/authSlice";
import { postsReducer } from "@/redux/posts/postsSlice";
import uiReducer from "@/redux/ui/uiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
  ThunkDispatch
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  posts: postsReducer,
  api: apiReducer, // ✅ not dynamic key, just a normal reducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type FetchThunk<T = Promise<void>> = ThunkAction<
  T,
  RootState,
  never,
  Action
>;
export type AppDispatch = ThunkDispatch<RootState, never, Action>;

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  whitelist: ["auth", "ui"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
