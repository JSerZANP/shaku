import { useMemo, useRef } from "react";

export default function useDebouncedCallback<T>(
  callback: (...args: T[]) => void,
  delay: number
) {
  const ref = useRef(0);

  const debouncedCallback = useMemo(() => {
    const run = (...args: T[]) => {
      window.clearTimeout(ref.current);
      ref.current = window.setTimeout(() => callback(...args), delay);
    };
    return run;
  }, [callback, delay]);

  return debouncedCallback;
}
