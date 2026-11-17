import { QueryClient } from "@tanstack/react-query";

import { AppError } from "@/shared/errors/AppError";

/** How long fetched data counts as fresh: no request while it is. */
export const STALE_TIME = 30_000;

/**
 * Retry once when the server couldn't be reached or failed (5xx), since
 * that may pass. Never retry a 4xx: asking again gets the same answer, and
 * a 429 (rate limit) would only get worse. The 401 refresh is handled in
 * httpClient, not here.
 */
export const shouldRetry = (failureCount: number, error: unknown) => {
  if (!(error instanceof AppError)) return false;

  const serverSide = error.status === undefined || error.status >= 500;
  return serverSide && failureCount < 1;
};

/**
 * The app's one cache for server data. A module (not created in a
 * component) so route loaders, which run outside React, use the same one.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      retry: shouldRetry,
    },
  },
});
