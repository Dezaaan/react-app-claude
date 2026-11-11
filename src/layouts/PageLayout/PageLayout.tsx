import { useMemo, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";

import { PendingContext } from "@/shared/pending/pendingContext";
import { cn } from "@/shared/utils/cn";
import styles from "./PageLayout.module.scss";

export const PageLayout = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

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
  // Only navigation dims the page: work inside the page (like filtering)
  // must keep it usable, so the user can keep typing.
  return (
    <main className={styles.page} aria-busy={isNavigating}>
      {showProgress && (
        <div
          className={styles.progress}
          role="progressbar"
          aria-label={isNavigating ? "Loading page" : "Updating results"}
        />
      )}

      <div className={cn(styles.container, isNavigating && styles.loading)}>
        <PendingContext.Provider value={pending}>
          <Outlet />
        </PendingContext.Provider>
      </div>
    </main>
  );
};
