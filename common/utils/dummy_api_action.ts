import { delay } from "./delay";
import { DummyAPI, dummyData, Shape, useAsyncDummyData } from "./dummy_data";
import { type createGenericAPIAction } from "./redux";

export const createDummyGenericAPIAction = <T extends DummyAPI>(api: T) => {
  const listAPI = [api] as [T];

  return [
    () => async () => {
      console.log("fetching.....");
      await delay(1000);
      console.log("done fetching.....");
      return dummyData(listAPI);
    },
    () => useAsyncDummyData(listAPI),
    () => async () => {},
    () => useAsyncDummyData(api) as unknown,
  ] as ReturnType<typeof createGenericAPIAction<Array<Shape<T>>, any[]>>;
};
