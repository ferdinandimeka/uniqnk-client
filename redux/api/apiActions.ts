"use client";
import { createGenericAPIAction } from "@/common/utils/redux";
import { ListResponse, ValidPath } from "@/redux/axios-types";
import { useMemo } from "react";
import { apiLoader } from "./apiSlice";

export const useAPI = <Response = any, Multiple extends boolean = true>(
  url: ValidPath,
  multiple: Multiple = true as Multiple,
  key = url
) => {
  const [refresh, use] = useMemo(
    () =>
      createGenericAPIAction<
        Multiple extends true ? ListResponse<Response> : Response,
        []
      >({
        actionCreator: apiLoader,
        key,
        ns: "api",
        url: url,
        multiple: false,
      }),
    [url, key]
  );
  const data = use();
  return {
    loading: !data,
    data,
    refresh,
  };
};
