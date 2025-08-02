"use client";
import axios from "@/redux/axios";
import { APIOptions, ValidPath } from "@/redux/axios-types";
import {
  type AppDispatch,
  type FetchThunk,
  type RootState,
} from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";

export function genericLoader<T>(
  state: T,
  {
    payload: action,
  }: { payload: { data: any; key: string; args?: string | number } }
) {
  return action.args
    ? {
        ...state,
        temp: {
          ...(state as any).temp,
          [action.key + "-" + action.args]: action.data,
        },
      }
    : {
        ...state,
        [action.key]: action.data,
      };
}

export function createGenericAPIAction<V, T extends (number | string)[] = []>({
  url,
  multiple,
  map,
  key,
  ns,
  actionCreator,
}: {
  url: string | ((...args: T) => string);
  ns: keyof RootState;
  key: string;
  actionCreator: (props: {
    data: V;
    key: string;
    args?: number | string;
  }) => Action;
  multiple?: boolean;
  map?: (e: any) => V;
}) {
  function fetchData(...args: T): FetchThunk<Promise<V>> {
    return async (dispatch, getState) => {
      const n = !url || typeof url === "string" ? url : url(...args);
      if (!n) return;
      const res = await axios.get<any, APIOptions>(n as ValidPath);
      const subkey = args.join(".");
      if (res.status === "success") {
        const data = map
          ? multiple
            ? res.data.results.map(map)
            : map(res.data)
          : multiple
          ? res.data.results
          : res.data;
        dispatch(actionCreator({ data, key, args: subkey }));
      }
      const e = getState();
      return subkey ? e[ns]["temp"]?.[key + "-" + subkey] : (e[ns][key] as V);
    };
  }

  function useData(...args: T) {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(
      function () {
        dispatch(fetchData(...args));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dispatch, url, ...args] // Place URL here is necesssary for creating this hook on the fly like useAPI does
    );
    const subkey = args.join(".");
    return useSelector((e: RootState) =>
      subkey ? e[ns]["temp"]?.[key + "-" + subkey] : (e[ns][key] as V)
    ) as V;
  }

  function updateSingle(
    new_state: V extends any[] ? V[number] | V : V,
    idKey = "id",
    ...args: T
  ): FetchThunk {
    return async (dispatch, getState) => {
      const e = getState();
      const subkey = args.join(".");
      const state: any[] | undefined = subkey
        ? e[ns]["temp"]?.[key + "-" + subkey]
        : e[ns][key];
      if (state) {
        const _new_state = multiple
          ? (state.map((e) =>
              e[idKey] === (new_state as any)[idKey] ? new_state : e
            ) as V)
          : (new_state as V);
        dispatch(actionCreator({ data: _new_state, key, args: subkey }));
      }
    };
  }
  function useSingle(
    id: string | number,
    idKey = "id",
    ...args: T
  ): V extends (infer W)[] ? W : unknown {
    const dispatch = useDispatch<AppDispatch>();
    const subkey = args.join(".");

    const allData = useSelector((e: RootState) =>
      subkey ? e[ns]["temp"]?.[key + "-" + subkey] : e[ns][key]
    );
    const [res, setRes] = useState(allData?.find((e) => e[idKey] === id));
    useEffect(
      () =>
        void (async function retry(timeout = 1000) {
          if (!id) return;
          const rawURL =
            !url || typeof url === "string" ? (url as string) : url(...args);
          if (!rawURL) return;
          const n = rawURL.replace(/\?.*$|$/, "/" + id + "/$&");
          const res = await axios.get<any, APIOptions>(n as ValidPath);
          if (res.status === "success") {
            dispatch(updateSingle(res.data, idKey, ...args));
            setRes(res.data);
          } else {
            if (res.error !== "Not Found" && timeout < 8000)
              setTimeout(retry, timeout, timeout * 2);
          }
        })(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...args, dispatch, id, idKey]
    );

    return res;
  }

  return [fetchData, useData, updateSingle, useSingle] as const;
}
