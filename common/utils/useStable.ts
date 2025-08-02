import { useRef } from "react";

export default function useStable<T extends (...args: unknown[]) => unknown>(
  func: T | null,
  wrapper: (e: T) => T = (e) => e
): T | null {
  const ref = useRef({
    cb: wrapper(((...args: Parameters<T>) =>
      (ref.current.handler as T)(...args)) as T),
    handler: null! as T | null,
  });
  ref.current.handler = func;
  return func && ref.current.cb;
}
