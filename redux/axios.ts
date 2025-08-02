import { parse } from "cookie";
import { _timeAgo } from "../common/utils/format_date";

// Some Helper Types To Smoothen API Integration

import { IS_UI_DEMO_MODE } from "@/common/utils/ui_demo_mode";
import formURLEncode from "form-urlencoded";
import {
  APIOptions,
  AxiosResponse,
  CheckExact,
  FailureResponse,
  InferMethod,
  InferRequest,
  InferResponse,
  PathsWithoutPrefix,
  SuccessResponse,
  ValidPath,
} from "./axios-types";

const SKIPPED = { status: "skipped" as const };

function toFormData(e: any) {
  const m = new FormData();

  for (const i in e) {
    if (e[i] !== undefined && Object.prototype.hasOwnProperty.call(e, i)) {
      const arr = Array.isArray(e[i]) ? e[i] : [e[i]];
      for (const val of arr) {
        m.append(i, val);
      }
    }
  }
  return m;
}

class API {
  baseURL = process.env.EXPO_PUBLIC_API_URL;
  access_token: string | null = null;
  clearAccessToken() {
    this.access_token = null;
  }
  setAccessToken(token: string) {
    this.access_token = token;
  }
  cache = new Map();

  get<M extends PathsWithoutPrefix, T extends APIOptions>(
    url: ValidPath<M>,
    options?: T & CheckExact<T, APIOptions>
  ): Promise<AxiosResponse<InferResponse<M, "get">, T>>;
  get<Response extends object, T extends APIOptions>(
    url: ValidPath,
    options?: T & CheckExact<T, APIOptions>
  ): Promise<AxiosResponse<Response, T>>;

  get(url: ValidPath, opts?: APIOptions) {
    return this.request(url, {
      method: "GET",
      ...opts,
    });
  }
  post<M extends PathsWithoutPrefix>(
    url: ValidPath<M>,
    body: InferRequest<M, "post">,
    opts?: APIOptions
  ): Promise<AxiosResponse<InferResponse<M, "post">, APIOptions>>;
  post<Response extends object>(
    url: ValidPath,
    body: any,
    opts?: APIOptions
  ): Promise<FailureResponse | SuccessResponse<Response>>;
  post(url: ValidPath, body: any, opts: APIOptions = {}) {
    if (body && (body as any).body)
      console.warn("Possible error: Found 'body' key in 'body' argument wrong");
    return this.request(url, {
      body: body as any,
      method: "POST",
      ...opts,
    });
  }
  patch<M extends PathsWithoutPrefix>(
    url: ValidPath<M>,
    body: InferRequest<M, "patch">,
    opts?: APIOptions
  ): Promise<AxiosResponse<InferResponse<M, "patch">, APIOptions>>;
  patch<Response extends object>(
    url: ValidPath,
    body: any,
    opts?: APIOptions
  ): Promise<FailureResponse | SuccessResponse<Response>>;
  patch(url: ValidPath, body: any, opts: APIOptions = {}) {
    if (body && (body as any).body)
      console.warn("Possible error: Found 'body' key in 'body' argument wrong");
    return this.request(url, {
      body: body as any,
      method: "PATCH",
      ...opts,
    });
  }
  delete<M extends PathsWithoutPrefix, T extends APIOptions>(
    url: ValidPath<M>,
    options?: T & CheckExact<T, APIOptions>
  ): Promise<AxiosResponse<InferResponse<M, "delete">, T>>;
  delete<Response extends object, T extends APIOptions>(
    url: ValidPath,
    options?: T & CheckExact<T, APIOptions>
  ): Promise<AxiosResponse<Response, T>>;
  delete(url: ValidPath, opts: APIOptions = {}) {
    return this.request(url, {
      method: "DELETE",
      ...opts,
    });
  }

  request<M extends PathsWithoutPrefix, T extends APIOptions>(
    url: ValidPath<M>,
    options?: T & CheckExact<T, APIOptions>
  ): Promise<AxiosResponse<InferResponse<M, InferMethod<T>>, T>>;
  request<Response extends object, T extends APIOptions>(
    url: ValidPath,
    options?: T & CheckExact<T, APIOptions>
  ): Promise<AxiosResponse<Response, T>>;

  async request(
    url: ValidPath,
    {
      method,
      body,
      authorize = true,
      ttl = -1,
      contentType = "application/x-www-form-urlencoded",
      autoRefreshToken = true,
      onCookies,
    }: APIOptions = {}
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const cacheKey = method + " " + _this.baseURL + url;
    if (ttl > -1) {
      const time = Date.now(); // Get now before waiting especially because for the special case of ttl=0
      let loopGuard = 0;
      while (_this._isRequestOngoing(cacheKey) && loopGuard < 30) {
        await _this.cache.get(cacheKey);
        loopGuard++;
      }
      if (loopGuard >= 30) {
        console.error("Detected cache deadlock!!! Clearing cache.");
        _this.cache.delete(cacheKey);
      }
      if (
        _this.cache.has(cacheKey) &&
        time - _this.cache.get(cacheKey) <= ttl
      ) {
        return SKIPPED;
      } else if (_this.cache.has(cacheKey)) {
        console.log(
          `Stale cache expired ${_timeAgo.format(
            _this.cache.get(cacheKey),
            "round"
          )}`
        );
      }
    }
    console.log(cacheKey, _this.access_token?.slice(0, 10), body);
    const headers: Record<string, string> = {};
    if (authorize && _this.access_token) {
      headers.Authorization = `Bearer ${_this.access_token}`;
    }
    if (contentType !== "multipart/formdata") {
      headers["Content-Type"] = contentType;
    }
    const rawBody = body
      ? contentType == "application/json"
        ? JSON.stringify(body)
        : contentType == "application/x-www-form-urlencoded"
        ? formURLEncode(body)
        : contentType == "multipart/formdata"
        ? toFormData(body)
        : null
      : undefined;
    const request = fetch(`${_this.baseURL}${url}`, {
      method,
      body: rawBody,
      headers,
      credentials: "omit",
    })
      .then(async (e) => {
        if (onCookies) {
          onCookies(parse(e.headers.get("Set-Cookie") ?? ""));
        }
        if (/json/.test(e.headers.get("Content-type") ?? "")) {
          const data = await e.json();

          return e.ok
            ? ({
                status: "success",
                data,
                message: data.message ?? data?.non_field_errors?.[0] ?? "",
              } as SuccessResponse)
            : ({
                status: "failure",
                error: data.message ?? data?.non_field_errors?.[0] ?? "",
                detail: data.error ?? data,
              } as FailureResponse);
        } else {
          let message = await e.text();
          if (message.length > 100) {
            if (/404/.test(message)) {
              message = "Route Not Found";
            } else {
              message = message.slice(0, 50) + "...";
            }
          }
          return e.ok
            ? ({
                status: "success",
                message: message,
              } as SuccessResponse)
            : ({
                status: "failure",
                error: message,
              } as FailureResponse);
        }
      })
      .then((e) => {
        if (e.status == "failure") {
          if (
            authorize &&
            e.error === "Invalid or expired token." &&
            autoRefreshToken
          ) {
            return Promise.resolve(
              _this.onAuthorized<any>(() => {
                if (!_this.access_token)
                  throw new Error("Tried to refresh without access token!!!");

                if (_this._isRequestOngoing(cacheKey))
                  _this.cache.delete(cacheKey);
                const a = _this.request(url, {
                  method,
                  body,
                  authorize,
                  ttl,
                  contentType,
                  autoRefreshToken: false,
                });
                return a;
              }, e)
            ).finally(() => {
              // Clean this up to prevent deadlocks
              if (_this._isRequestOngoing(cacheKey))
                _this.cache.delete(cacheKey);
            });
          }
          console.log({
            cacheKey,
            body: rawBody,
            headers,
          });
          if (_this._isRequestOngoing(cacheKey)) _this.cache.delete(cacheKey);
        } else {
          if (ttl > -1) _this.cache.set(cacheKey, Date.now());
        }
        console.log(`${cacheKey}:`, e);
        return e;
      })
      .catch((e) => {
        if (ttl > -1) _this.cache.delete(cacheKey);
        if (IS_UI_DEMO_MODE) {
          return {
            status: "success",
            message: "UI Demo Mode",
            data: {},
          } as SuccessResponse;
        }
        return {
          status: "failure",
          error: e.message,
        } as FailureResponse;
      });
    if (ttl > -1) _this.cache.set(cacheKey, request);
    return request;
  }
  onAuthorized<T>(
    request: () => Promise<T>,
    response: FailureResponse
  ): Promise<T | FailureResponse> {
    return Promise.resolve(response);
  }

  _isRequestOngoing(cacheKey: string) {
    return (
      this.cache.has(cacheKey) && typeof this.cache.get(cacheKey) !== "number"
    );
  }
  invalidate(url: ValidPath, method: APIOptions["method"] = "GET") {
    const cacheKey = method + " " + this.baseURL + url;
    if (this.cache.has(cacheKey)) this.cache.set(cacheKey, 0);
    for (const key of [...this.cache.keys()]) {
      if (key.startsWith(cacheKey + "?")) {
        this.cache.set(key, 0);
      }
    }
  }
}

const api = new API();

export default api;
