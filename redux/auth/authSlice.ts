import { Action } from "redux";

export const LOGGING_IN = "LOGGING_IN";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGGED_IN = "LOGGED_IN";
export const CLEAR_LOGIN_ERROR = "CLEAR_LOGIN_ERROR";
export const LOGGED_OUT = "LOGGED_OUT";
export const VERIFY_EMAIL = "VERIFY_EMAIL";
export const EMAIL_VERIFIED = "EMAIL_VERIFIED";

const initialState = {
  isAuthenticated: undefined as boolean | undefined,
  isLoggingIn: false,
  verifyEmailLastSent: null as number | null,
  needsStoreSetup: true,
  loginError: null as {
    error: string;
    detail: { [key: string]: string[] };
  } | null,
  user: null as {
    email: string;
    name: string;
    photo_url?: string;
    email_verified: boolean;
  } | null,
};
export type AuthState = typeof initialState;
export default function authReducer(
  state = initialState,
  action: Action & { payload: any }
): AuthState {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.payload,
        verifyEmailLastSent: Date.now(),
      };
    case LOGGING_IN:
      return { ...state, isLoggingIn: true, loginError: null };
    case LOGIN_FAILED:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,   // 🚨 make sure user is NOT logged in
        loginError: action.payload,
        user: null,               // clear any stale user
      };
    case CLEAR_LOGIN_ERROR:
      return {
        ...state,
        loginError: null,
      };
    case LOGGED_OUT:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        user: null,
      };
    case VERIFY_EMAIL:
      return {
        ...state,
        verifyEmailLastSent: action.payload ?? Date.now(),
      };
    case EMAIL_VERIFIED:
      return {
        ...state,
        user: state.user && {
          ...state.user,
          email_verified: action.payload ?? true,
        },
      };
  }
  return state;
}
