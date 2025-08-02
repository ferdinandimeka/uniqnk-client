import type { components, paths } from "./swagger";
export type Responses = components["schemas"];
export type ListResponse<T> = {
  previous: any;
  count: number;
  next: any;
  results: T[];
};
type PathsWithoutPrefix = keyof paths & string;

type Extract<P extends string> = P extends `${infer K}/{${infer L}}${infer M}`
  ? L extends "id" | "stationId"
    ? `${Extract<K>}/${number}${Extract<M>}` | P
    : `${Extract<K>}/${string}${Extract<M>}`
  : P;
type ParameterExtraction<T extends string> = {
  [P in T]: Extract<P>;
}[T];

export type ValidPath<T extends PathsWithoutPrefix = PathsWithoutPrefix> =
  `${ParameterExtraction<T>}${`?${string}` | ""}`;
// Too Slow - The Typescript Compiler just bails out
// export type MatchRoot<V extends ValidPath, BasePath extends PathsWithoutPrefix> =  V extends ValidPath<BasePath> ? BasePath : never
// type ReverseLookup<T extends ValidPath> = {
//   [x in PathsWithoutPrefix]: T extends ValidPath<x> ? x : never;
// }[PathsWithoutPrefix];

export interface APIOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: object;
  authorize?: boolean;
  onCookies?: (e: Record<string, string>) => void;
  contentType?:
    | "application/json"
    | "multipart/formdata"
    | "application/x-www-form-urlencoded";
  autoRefreshToken?: boolean;
  ttl?: number;
}

interface SkippableRequestAPIOptions extends APIOptions {
  ttl: number;
}

type CheckExact<Type extends Options, Options> = Type extends {
  [key in keyof Type]: key extends keyof Options ? Options[key] : never;
}
  ? Type
  : `${{
      [key in keyof Type]: key extends keyof Options ? never : key;
    }[keyof Type & string]} is not a valid option.`;
interface ErrorDetailObject
  extends Record<string, string[] | ErrorDetailObject | string> {}
type ErrorDetail = string | ErrorDetailObject;
type FailureResponse = {
  status: "failure";
  data?: never;
  message?: never;
  error: string;
  detail?: ErrorDetail;
};

type SuccessResponse<T = any> = {
  status: "success";
  data: T;
  message: string;
  error?: never;
  detail?: never;
};
type GetOrPass<T extends object, key extends string | number> = Exclude<
  key extends keyof T ? T[key] : any,
  undefined
>;

export type InferResponse<
  M extends PathsWithoutPrefix,
  O extends "get" | "post" | "patch" | "delete" | "put"
> = GetOrPass<
  GetOrPass<
    GetOrPass<GetOrPass<GetOrPass<paths[M], O>, "responses">, 200>,
    "content"
  >,
  "application/json"
>;

type InferRequest<
  M extends PathsWithoutPrefix,
  O extends "post" | "patch" | "put"
> = GetOrPass<
  GetOrPass<GetOrPass<GetOrPass<paths[M], O>, "requestBody">, "content">,
  "application/json"
>;

type InferMethod<T extends APIOptions> = T["method"] extends undefined
  ? "get"
  : {
      [key in Exclude<APIOptions["method"], undefined>]: T["method"] extends key
        ? Lowercase<key>
        : never;
    }[Exclude<APIOptions["method"], undefined>];

export type AxiosResponse<
  Response,
  OptionsType extends APIOptions = APIOptions
> =
  | FailureResponse
  | SuccessResponse<Response>
  | (OptionsType extends SkippableRequestAPIOptions
      ? { status: "skipped" }
      : never);
