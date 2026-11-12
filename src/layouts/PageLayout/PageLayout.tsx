import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";

import { PendingContext } from "@/shared/pending/pendingContext";
import { cn } from "@/shared/utils/cn";
import styles from "./PageLayout.module.scss";

export const PageLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const isNavigating = navigation.state === "loading";
  // Going to another page, not just new results on this one (?page=2).
  const isLeavingPage =
    isNavigating && navigation.location?.pathname !== location.pathname;

  // How many components on the page are busy (e.g. a table filtering).
  const [pendingCount, setPendingCount] = useState(0);
  const pending = useMemo(
    () => ({
      start: () => setPendingCount((count) => count + 1),
      stop: () => setPendingCount((count) => count - 1),
    }),
    [],
  );

  const showProgress = isNavigating || pendingCount > 0;

  // Keep the current page mounted while the next route's loader runs,
  // so its state (filters, scroll position) survives and the UI doesn't flash.
  // Only leaving the page dims it: new results for the same page (another
  // page number, a filter) and work inside the page keep it usable, so the
  // user can keep typing.
  return (
    <main className={styles.page} aria-busy={isNavigating}>
      {showProgress && (
        <div
          className={styles.progress}
          role="progressbar"
          aria-label={isLeavingPage ? "Loading page" : "Updating results"}
        />
      )}

      <div className={cn(styles.container, isLeavingPage && styles.loading)}>
        <PendingContext.Provider value={pending}>
          <Outlet />
        </PendingContext.Provider>
      </div>
    </main>
  );
};
