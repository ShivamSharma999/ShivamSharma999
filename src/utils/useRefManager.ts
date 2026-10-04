import { useRef, useCallback } from "react";

/** Holds a ref to an element and lets callers queue work until it is mounted. */
export default function useRefManager<T extends HTMLElement>() {
  const el = useRef<T | null>(null);
  const queue = useRef<Array<(el: T) => void>>([]);

  const set = useCallback((node: T | null) => {
    el.current = node;
    if (node) {
      queue.current.forEach((fn) => fn(node));
      queue.current = [];
    }
  }, []);

  const afterAvail = useCallback((fn: (el: T) => void) => {
    if (el.current) fn(el.current);
    else queue.current.push(fn);
  }, []);

  return { set, afterAvail, get: () => el.current };
}
