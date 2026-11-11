import { useEffect, type KeyboardEvent, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusable = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));

/**
 * Keeps keyboard focus inside `ref` while it is mounted:
 * - on mount, focuses the first focusable element (or the container itself),
 * - on unmount, returns focus to whatever was focused before (usually the
 *   button that opened it).
 *
 * Tab wrapping is done by the returned `handleTab`, which the container
 * calls from its onKeyDown.
 */
export const useFocusTrap = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const container = ref.current;

    if (!container) {
      return;
    }

    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // Respect autoFocus on an element inside the container.
    if (!container.contains(document.activeElement)) {
      (getFocusable(container)[0] ?? container).focus();
    }

    return () => {
      // The opener may be gone, e.g. a virtualized row scrolled out of view.
      if (previous?.isConnected) {
        previous.focus();
      }
    };
  }, [ref]);

  const handleTab = (event: KeyboardEvent) => {
    const container = ref.current;

    if (event.key !== "Tab" || !container) {
      return;
    }

    const focusable = getFocusable(container);

    if (focusable.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === container)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return handleTab;
};
