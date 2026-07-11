import { type RefObject, useEffect } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  handler: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: PointerEvent) => {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler();
    };

    document.addEventListener("pointerdown", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [ref, handler, enabled]);
};
