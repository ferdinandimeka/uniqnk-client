import { useDispatcher } from "@/common/utils/use_dispatcher";
import { FetchThunk, RootState } from "@/redux/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthState,
  LOGGED_IN, LOGGED_OUT, LOGGING_IN,
  LOGIN_FAILED,
  VERIFY_EMAIL
} from "./authSlice";

import { dummyData } from "@/common/utils/dummy_data";
import { IS_UI_DEMO_MODE } from "@/common/utils/ui_demo_mode";
import axios from "@/redux/axios";
import { APIOptions, AxiosResponse } from "@/redux/axios-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () =>
  useSelector<any, Omit<AuthState, "user">>((e) => e.auth);

export function useInitAuth() {
  const dispatch = useDispatch() as ThunkDispatch<any, any, any>;
  useEffect(() => {
    const x = axios.onAuthorized;
    axios.onAuthorized = async (resend, response) => {
      let accessInfo: AccessInfo = JSON.parse(
        (await AsyncStorage.getItem("user")) ?? "{}"
      );

      // axios.access_token ?? accessInfo.access_token;
      console.log("Refreshing token " + new Date().toLocaleString());
      const {
        data: updatedToken,
        status,
        error,
      } = await axios.post(
        "/auth/token/refresh/",
        {
          refresh: accessInfo.refresh_token,
        },
        { authorize: false }
      );
      console.log({ updatedToken });
      if (!IS_UI_DEMO_MODE && status === "success") {
        accessInfo = {
          access_token: updatedToken.access,
          refresh_token: updatedToken.refresh || accessInfo.refresh_token,
        };
        await AsyncStorage.setItem("user", JSON.stringify(accessInfo));
      } else if (IS_UI_DEMO_MODE || /unauthori/i.test(error)) {
        dispatch(doLogOutAction());
        return response;
      }
      axios.access_token = accessInfo.access_token;
      return resend();
    };

    dispatch(async () => {
      try {
        const { data } = await axios.onAuthorized(
          () => axios.get("/auth/user/"),
          null
        );

        dispatch({
          type: LOGGED_IN,
          payload: {
            email: data.email,
            name: `${data.full_name}`,
            email_verified: true,
            user_type: data.user_type ?? "client",
          },
        });
      } catch (e) {
        dispatch({ type: LOGGED_OUT });
      }
    });
    return () => {
      axios.onAuthorized = x;
    };
  }, [dispatch]);
}
type AccessInfo = {
  access_token: string;
  refresh_token: string;
};
let emailVerified;
if (IS_UI_DEMO_MODE) emailVerified = false;
function doLoginAction(email: string, password: string): FetchThunk {
  return async (dispatch) => {
    dispatch({
      type: LOGGING_IN,
    });
    try {
      // Login Mutation
      let refreshToken: string;
      const { data, status, ...error }: AxiosResponse<any> =
        await axios.request<any, APIOptions>("/auth/login/", {
          method: "POST",
          body: {
            email: email,
            password: password,
          },
          onCookies(e) {
            refreshToken = e["refresh-token"];
          },
          authorize: false,
        });
      if (status == "success") {
        const accessInfo: AccessInfo = {
          access_token: data.access,
          refresh_token: refreshToken,
        };
        axios.access_token = accessInfo.access_token;
        await AsyncStorage.setItem("user", JSON.stringify(accessInfo));
        if (IS_UI_DEMO_MODE) {
          data.user = dummyData({
            email: "email",
            full_name: "name",
            photo_url: "image",
            email_verified: () => emailVerified,
          });
        }
        console.log(data.user);
        dispatch({
          type: LOGGED_IN,
          payload: {
            email: data.user.email,
            name: data.user.full_name,
            email_verified: data.user.email_verified != false,
            user_type: data.user.user_type,
            photo_url: data.user.photo_url,
          },
        });
      } else if (status === "failure") {
        dispatch({
          type: LOGIN_FAILED,
          payload: error,
        });
      }
    } catch (e) {
      console.error(e);
      dispatch({
        type: LOGIN_FAILED,
        payload: e,
      });
    }
  };
}
function doSignUpAction(
  email: string,
  password: string,
  fullName: string,
  businessName: string
): FetchThunk {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGGING_IN,
      });

      // Login Mutation
      const p = await axios.request("/auth/registration/", {
        body: {
          email: email,
          password1: password,
          password2: password,
          business_name: businessName,
          full_name: fullName,
        },
        authorize: false,
        method: "POST",
      });
      if (p.status === "success") {
        dispatch({
          type: LOGGED_IN,
          payload: {
            email,
            name: fullName,
            email_verified: false,
          },
        });
      } else {
        dispatch({
          type: LOGIN_FAILED,
          payload: p,
        });
      }
    } catch (e) {
      console.error(e);
      dispatch({
        type: LOGIN_FAILED,
        payload: e.message,
      });
    }
  };
}

function doLogOutAction(): FetchThunk {
  return async (dispatch) => {
    dispatch({
      type: LOGGING_IN,
    });
    // Login Mutation
    await AsyncStorage.removeItem("user");
    axios.access_token = null;

    dispatch({
      type: LOGGED_OUT,
    });
  };
}

function doResendEmailVerificationCodeAction(): FetchThunk {
  return async (dispatch, getState) => {
    const { status } = await axios.post("/auth/registration/resend-email/", {
      email: getState().auth.user.email,
    });
    if (status === "success") {
      dispatch({
        type: VERIFY_EMAIL,
      });
    }
  };
}

export function doCheckEmailVerifiedAction(): FetchThunk {
  return async (dispatch) => {
    // We do not actually check if the email is verified
    // TODO: parse axios responses to figure out if email is magically not verified
    // dispatch({
    //   type: EMAIL_VERIFIED,
    // });
    if (IS_UI_DEMO_MODE) emailVerified = true;
    dispatch(doLogOutAction());
  };
}

export const useLogin = () => useDispatcher(doLoginAction);
export const useLogout = () => useDispatcher(doLogOutAction);
export const useSignUp = () => useDispatcher(doSignUpAction);
export const useCheckEmailVerified = () =>
  useDispatcher(doCheckEmailVerifiedAction);
export const useResendEmailVerificationCode = () =>
  useDispatcher(doResendEmailVerificationCodeAction);

export const useUserProfile = () => useSelector((e: RootState) => e.auth.user);
