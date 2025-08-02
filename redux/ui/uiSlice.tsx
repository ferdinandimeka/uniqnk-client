import { BG, ON_BG, PRIMARY } from "@/common/theming/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, Theme } from "@react-navigation/native";
import { PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

const initialState = {
  welcome_shown: false,
  transient: {
    app_padding: 16,
    theme: {
      dark: false,
      colors: {
        ...DefaultTheme.colors,
        primary: PRIMARY,
        background: BG,
        text: ON_BG,
        card: BG,
      },
    } as Theme,
  },
};

export const DONE_WELCOME = "DONE_WELCOME";

export type UIState = typeof initialState;

const uiReducer = persistReducer(
  {
    blacklist: ["transient"],
    key: "application.ui",
    storage: AsyncStorage,
    timeout: 2000,
  },
  function uiReducer(
    state: UIState = initialState,
    action: PayloadAction<any>
  ): UIState {
    console.log(action);
    switch (action.type) {
      case DONE_WELCOME:
        return {
          ...state,
          welcome_shown: true,
        };
      default:
        return state;
    }
  }
);
export default uiReducer;
