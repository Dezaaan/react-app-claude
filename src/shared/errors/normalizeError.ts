import { isRouteErrorResponse } from "react-router-dom";

import { AppError } from "./AppError";
import {
  DEFAULT_USER_MESSAGES,
  ERROR_CODES,
  errorCodeFromStatus,
} from "./errorCodes";

// fetch() rejects with a TypeError whose message differs per browser:
// Chrome "Failed to fetch", Firefox "NetworkError when attempting to fetch
// resource.", Safari "Load failed". Other TypeErrors are ordinary bugs.
const NETWORK_ERROR_PATTERN =
  /failed to fetch|networkerror|load failed|network request failed/i;

const isNetworkError = (error: unknown): error is TypeError =>
  error instanceof TypeError && NETWORK_ERROR_PATTERN.test(error.message);

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Responses thrown from loaders/actions, and the router's own 404s.
  if (isRouteErrorResponse(error)) {
    const code = errorCodeFromStatus(error.status);

    return new AppError(
      error.statusText || `Request failed with status ${error.status}`,
      code,
      error.status,
      DEFAULT_USER_MESSAGES[code],
      { cause: error },
    );
  }

  if (isNetworkError(error)) {
    return new AppError(
      error.message,
      ERROR_CODES.NETWORK_ERROR,
      undefined,
      DEFAULT_USER_MESSAGES.NETWORK_ERROR,
      { cause: error },
    );
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ERROR_CODES.UNKNOWN_ERROR,
      undefined,
      DEFAULT_USER_MESSAGES.UNKNOWN_ERROR,
      { cause: error },
    );
  }

  return new AppError(
    "Unknown error",
    ERROR_CODES.UNKNOWN_ERROR,
    undefined,
    DEFAULT_USER_MESSAGES.UNKNOWN_ERROR,
    { cause: error },
  );
};
