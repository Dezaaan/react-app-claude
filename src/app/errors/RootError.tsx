import { Button } from "@/shared/components/Button/Button";
import styles from "./RootError.module.scss";

/**
 * Last-resort error screen, for errors no route handled (e.g. a bug while
 * rendering). It replaces the whole app, layout included, so the only way
 * out is reloading. Errors from a page's data show inside the layout
 * instead (see RouteError).
 */
export const RootError = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card} role="alert">
        <h1>Something went wrong</h1>
        <p>
          An unexpected error occurred. Please reload the page and try again.
        </p>

        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    </main>
  );
};
