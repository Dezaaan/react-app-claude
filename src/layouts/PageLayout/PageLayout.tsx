import { Outlet, useNavigation } from "react-router-dom";
import styles from "./PageLayout.module.scss";
import { cn } from "@/shared/utils/cn";

export const PageLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Keep the current page mounted while the next route's loader runs,
  // so its state (filters, scroll position) survives and the UI doesn't flash.
  return (
    <main className={styles.page} aria-busy={isLoading}>
      {isLoading && (
        <div
          className={styles.progress}
          role="progressbar"
          aria-label="Loading page"
        />
      )}

      <div className={cn(styles.container, isLoading && styles.loading)}>
        <Outlet />
      </div>
    </main>
  );
};
