import { useEffect } from "react";

/** Stops the page behind an open modal from scrolling. */
export const useBodyScrollLock = () => {
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);
};
