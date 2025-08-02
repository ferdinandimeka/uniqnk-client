import { RootState } from "@/redux/store";
import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Action } from "redux";

export function useDispatcher<T extends any[], V = any>(
  actionCreator: (...args: T) => Action | ThunkAction<V, RootState, T, Action>
) {
  const dispatch = useDispatch() as ThunkDispatch<RootState, T, Action>;
  return useCallback(
    (...args: T) => void dispatch(actionCreator(...args)),
    [actionCreator, dispatch]
  );
}
