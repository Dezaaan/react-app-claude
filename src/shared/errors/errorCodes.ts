export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Shown when an error doesn't carry its own `userMessage`. */
export const DEFAULT_USER_MESSAGES: Record<ErrorCode, string> = {
  UNAUTHORIZED: "You need to log in.",
  FORBIDDEN: "You don't have permission to access this page.",
  NOT_FOUND: "Page not found.",
  VALIDATION_ERROR: "Some of the submitted data is invalid.",
  TOO_MANY_REQUESTS: "Too many attempts. Please wait a minute and try again.",
  NETWORK_ERROR: "Unable to connect to the server.",
  SERVER_ERROR: "The server ran into a problem. Please try again later.",
  UNKNOWN_ERROR: "Something unexpected happened.",
};

/** Maps an HTTP status to the app's error code. */
export const errorCodeFromStatus = (status: number): ErrorCode => {
  if (status === 401) return ERROR_CODES.UNAUTHORIZED;
  if (status === 403) return ERROR_CODES.FORBIDDEN;
  if (status === 404) return ERROR_CODES.NOT_FOUND;
  if (status === 400 || status === 422) return ERROR_CODES.VALIDATION_ERROR;
  if (status === 429) return ERROR_CODES.TOO_MANY_REQUESTS;
  // Bad gateway, unavailable, gateway timeout: a proxy in front of the API
  // (or the dev server) couldn't reach it. For the user that's the same as
  // no connection.
  if (status === 502 || status === 503 || status === 504) {
    return ERROR_CODES.NETWORK_ERROR;
  }
  if (status >= 500) return ERROR_CODES.SERVER_ERROR;
  return ERROR_CODES.UNKNOWN_ERROR;
};
