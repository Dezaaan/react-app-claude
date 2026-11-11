import { createContext, useContext, useEffect } from "react";

type PendingContextValue = {
  start: () => void;
  stop: () => void;
};

/**
 * Lets any component inside a page turn on the page's loading indicator
 * (the bar at the top of PageLayout), not only route navigation.
 */
export const PendingContext = createContext<PendingContextValue | null>(null);

/**
 * Shows the page's loading indicator while `isPending` is true.
 * Several components can be pending at once; the indicator stays until
 * all of them are done. Does nothing outside a PageLayout.
 */
export const usePendingIndicator = (isPending: boolean) => {
  const context = useContext(PendingContext);

  useEffect(() => {
    if (!isPending || !context) {
      return;
    }

    context.start();
    return context.stop;
  }, [isPending, context]);
};
