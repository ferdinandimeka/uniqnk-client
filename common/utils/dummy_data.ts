 
import { faker } from "@faker-js/faker";
import { useMemo } from "react";
import { delay } from "./delay";
import sentenceCase from "./sentence_case";
import usePromise from "./usePromise";

export const pick =
  (...args) =>
  () =>
    faker.helpers.arrayElement(args);
const FirstName = () => faker.person.firstName();
const LastName = () => faker.person.lastName();
const pastDate = (days = 365) => faker.date.recent({ days });
const futureDate = (days = 365) => faker.date.soon({ days });
const date = (...args) =>
  faker.helpers.arrayElement([pastDate(...args), futureDate(...args)]);
const email = (firstName?: string, lastName?: string) =>
  faker.internet.email({ firstName, lastName });

const dbs = {};
const getDB = (name: string) => {
  if (dbs[name]) return dbs[name];
  else
    return (dbs[name] = {
      elements: [],
      counters: {},
    });
};

type FnTypeOptions =
  | "pastDate"
  | "futureDate"
  | "range"
  | "insert_id"
  | "ref"
  | "image"
  | "optional"
  | "text";

type RefTypeOptions = `ref(${string}${`,${string}` | ""})`;

type NumberTypeOptions =
  | "number"
  | `insert_id(${string})`
  | `range(${number},${number})`;
type DateTypeOptions =
  | "date"
  | "pastDate"
  | "futureDate"
  | `pastDate(${number | string})`
  | `futureDate(${number | string})`;
type StaticTypeOptions =
  | "name"
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "email"
  | "subject"
  | "class"
  | "text"
  | `text(${number | NumberTypeOptions}${
      | ""
      | `,${number | NumberTypeOptions}`})`
  | "image"
  | `image(${number | NumberTypeOptions}${
      | ""
      | `,${number | NumberTypeOptions}`})`
  | DateTypeOptions
  | NumberTypeOptions
  | RefTypeOptions;

type TypeOption =
  | StaticTypeOptions
  | `${FnTypeOptions}(`
  | `optional(${StaticTypeOptions})`;

type PropertyValue<T extends TypeOption> = T extends NumberTypeOptions
  ? number
  : T extends DateTypeOptions
  ? Date
  : T extends RefTypeOptions
  ? object
  : T extends `optional(${infer T extends TypeOption})`
  ? PropertyValue<T>
  : T extends `${FnTypeOptions}(`
  ? never
  : string;

function fillProperty<T extends TypeOption>(
  type: T,
  firstName?: string,
  lastName?: string,
  obj?: any
): PropertyValue<T>;

function fillProperty(
  type: TypeOption,
  firstName?: string,
  lastName?: string,
  obj?: any
) {
  switch (type as StaticTypeOptions) {
    case "name":
      return `${firstName} ${lastName}`;
    case "firstName":
      return firstName.split("-").map(sentenceCase).join("-");
    case "lastName":
      return lastName.split("-").map(sentenceCase).join("-");
    case "phoneNumber":
      return faker.phone.number({ style: "international" });
    case "email":
      return email(firstName, lastName).toLowerCase();
    case "date":
      return date();
    case "number":
      return faker.number.int({ min: 0, max: 100_000_000 });
    case "subject":
      return faker.helpers.arrayElement([
        "Mathematics",
        "Social Studies",
        "English",
        "Geography",
      ]);
    case "class":
      return faker.helpers.arrayElement(["JSS 1", "JSS 2", "SSS 1"]);
    case "pastDate":
      return pastDate();
    case "image":
      return faker.image.url({ width: 400, height: 400 });
    case "futureDate":
      return futureDate();
    case "text":
      return faker.lorem.lines();

    default:
      const p = /^(\w+)\((.*)\)$/.exec(type);
      if (!p) return type;
      const [, fn, rawArg] = p as unknown as [unknown, FnTypeOptions, string];
      const arg = fillProperty(
        rawArg as TypeOption,
        firstName,
        lastName,
        obj
      ) as string;
      switch (fn) {
        case "image":
          const [width, height = width] = arg.split(",").map(Number);
          return faker.image.url({ width, height });
        case "text":
          const [min2, max2 = min2] = arg.split(",").map(Number);
          return faker.lorem.sentences({ min: min2, max: max2 });
        case "pastDate":
          return pastDate(Number(arg));
        case "futureDate":
          return futureDate(Number(arg));
        case "range":
          const [min, max] = arg.split(",").map(Number);
          return faker.number.int({ min, max });
        case "insert_id":
          let db = getDB(arg);
          if (db.elements.includes(obj)) return db.elements.indexOf(obj);
          return db.elements.push(obj);
        case "optional":
          return pick(arg, null)();
        case "ref":
          const [db_name, ctr = "default"] = arg.split(",");
          db = getDB(db_name);
          if (db.counters[ctr] == undefined) {
            db.counters[ctr] = 0;
          }
          return db.elements[db.counters[ctr]++];

        default:
          return type;
      }
  }
}
export type DummyAPI = {
  [key: string]:
    | TypeOption
    | DummyAPI
    | readonly [DummyAPI, min?: number, max?: number]
    | (() => any);
};
type InferShape<T extends DummyAPI[string]> = T extends TypeOption
  ? PropertyValue<T>
  : T extends () => infer X
  ? X
  : T extends DummyAPI
  ? Shape<T>
  : T extends readonly [DummyAPI, min?: number, max?: number]
  ? Shape<T[0]>[]
  : T;

export type Shape<T extends DummyAPI> = {
  [key in keyof T]: InferShape<T[key]>;
};

let maxObjectCount = 100;
export const dummyData = <
  T extends DummyAPI | [DummyAPI, min?: number, max?: number]
>(
  API: T
): InferShape<T> => {
  const shouldReset = maxObjectCount === 100;
  try {
    if (shouldReset) --maxObjectCount;
    const firstName = FirstName();
    const lastName = LastName();
    if (Array.isArray(API)) {
      if (maxObjectCount < 0) return [] as InferShape<T>;
      const [
        type,
        minLength = Math.min(maxObjectCount, 10),
        maxLength = Math.min(maxObjectCount, 10),
      ] = API;
      const res_arr = [];
      const N = faker.number.int({ min: minLength, max: maxLength });
      console.log({ N, maxObjectCount });
      for (let j = 0; j < N; j++) {
        --maxObjectCount;
        res_arr.push(dummyData({ data: type }).data);
      }
      return res_arr.filter(Boolean) as any;
    } else {
      const res = {} as T extends DummyAPI ? Shape<T> : never;
      for (const property in API) {
        if (typeof API[property] == "function") res[property] = API[property]();
        else if (typeof API[property] == "string") {
          res[property] = fillProperty(
            API[property] as TypeOption,
            firstName,
            lastName,
            res
          ) as any;
        } else if (API[property] && typeof API[property] === "object") {
          --maxObjectCount;
          res[property] = dummyData(API[property] as DummyAPI) as any;
        }
      }
      return res as InferShape<T>;
    }
  } finally {
    if (shouldReset) maxObjectCount = 100;
  }
};

export default function useDummyData(api, seed = 100) {
  return useMemo(() => {
    //Tried everything to preserve this across rehydration to no avail so we'll just use a fixed value
    faker.seed(seed);
    return dummyData(api);
  }, [api, seed]);
}

//Every API either returns an object or undefined ie loading
export const useAsyncDummyData = (API) => {
  const seed = useMemo(() => Math.random() * 100, []);
  const data = useDummyData(API, seed);
  return usePromise(async () => {
    await delay(Math.random() * 2000);
    return data;
  }, [data]);
};
