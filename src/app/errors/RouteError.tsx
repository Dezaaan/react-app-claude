import { useRevalidator, useRouteError } from "react-router-dom";

import { Button } from "@/shared/components/Button/Button";
import { DEFAULT_USER_MESSAGES, ERROR_CODES } from "@/shared/errors/errorCodes";
import { normalizeError } from "@/shared/errors/normalizeError";
import styles from "./RouteError.module.scss";

/** Errors that may go away by themselves, so trying again makes sense. */
const RETRYABLE = new Set<string>([
  ERROR_CODES.NETWORK_ERROR,
  ERROR_CODES.SERVER_ERROR,
  ERROR_CODES.TOO_MANY_REQUESTS,
  ERROR_CODES.UNKNOWN_ERROR,
]);

export const RouteError = () => {
  const error = normalizeError(useRouteError());
  const revalidator = useRevalidator();
  const isRetrying = revalidator.state === "loading";

  return (
    <div className={styles.error}>
      <p role="alert">
        {error.userMessage ?? DEFAULT_USER_MESSAGES[error.code]}
      </p>

      {RETRYABLE.has(error.code) && (
        // Runs the page's loaders again.
        <Button
          size="sm"
          onClick={() => revalidator.revalidate()}
          disabled={isRetrying}
          aria-busy={isRetrying}
        >
          {isRetrying ? "Trying again…" : "Try again"}
        </Button>
      )}
    </div>
  );
};
