import { AppError } from "@/shared/errors/AppError";
import {
  DEFAULT_USER_MESSAGES,
  ERROR_CODES,
  errorCodeFromStatus,
} from "@/shared/errors/errorCodes";

/**
 * The single place where the app talks HTTP.
 *
 * Every failure leaves this module as an `AppError`, so the rest of the app
 * (loaders, RouteError, components) only ever deals with one error shape:
 *
 *   request never reached the server  -> NETWORK_ERROR
 *   server answered with 4xx / 5xx     -> code from the status (401, 403, ...)
 *   server answered 2xx with bad JSON  -> SERVER_ERROR
 *   request was aborted                -> rethrown untouched (not an error
 *                                         the user needs to see)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Serialized as JSON. */
  body?: unknown;
  /** Appended as a query string; null/undefined values are skipped. */
  query?: Record<string, QueryValue>;
  headers?: HeadersInit;
  /** Pass a loader's `request.signal` so navigating away cancels the call. */
  signal?: AbortSignal;
};

/** Error body shape we expect from the backend; every field is optional. */
type ErrorBody = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  // Resolve against the page origin so relative bases like "/api" work.
  const url = new URL(
    `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    window.location.origin,
  );

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
};

// A cancelled request rejects with the signal's `reason`, which isn't always
// an AbortError, so also check the signal itself.
/** Absolute URL for an API path; also used by the mock handlers. */
export const apiUrl = (path: string) => buildUrl(path).href;

const isAbort = (error: unknown, signal?: AbortSignal) =>
  signal?.aborted ||
  (error instanceof DOMException && error.name === "AbortError");

/** Reads a body as JSON when it says it's JSON, otherwise as text. */
const readBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  const isJson = response.headers
    .get("Content-Type")
    ?.includes("application/json");

  return isJson ? JSON.parse(text) : text;
};

const errorFromResponse = async (response: Response): Promise<AppError> => {
  const code = errorCodeFromStatus(response.status);

  let body: unknown;
  try {
    body = await readBody(response);
  } catch {
    body = undefined; // An unreadable error body shouldn't hide the status.
  }

  const errorBody: ErrorBody =
    typeof body === "object" && body !== null ? body : {};

  const serverMessage =
    typeof errorBody.message === "string"
      ? errorBody.message
      : typeof errorBody.error === "string"
        ? errorBody.error
        : typeof body === "string"
          ? body
          : undefined;

  // Validation messages are written for the user ("Title is required"), so
  // show them. Anything else may be internal detail; use our own wording.
  const userMessage =
    code === ERROR_CODES.VALIDATION_ERROR && serverMessage
      ? serverMessage
      : DEFAULT_USER_MESSAGES[code];

  return new AppError(
    serverMessage ??
      `${response.status} ${response.statusText || "Request failed"}`,
    code,
    response.status,
    userMessage,
    { details: errorBody.errors ?? body },
  );
};

export const request = async <T>(
  path: string,
  { method = "GET", body, query, headers, signal }: RequestOptions = {},
): Promise<T> => {
  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (isAbort(error, signal)) {
      throw error;
    }

    // fetch() only rejects when no response arrived at all.
    throw new AppError(
      `${method} ${url.pathname} failed: ${String(error)}`,
      ERROR_CODES.NETWORK_ERROR,
      undefined,
      DEFAULT_USER_MESSAGES.NETWORK_ERROR,
      { cause: error },
    );
  }

  if (!response.ok) {
    throw await errorFromResponse(response);
  }

  try {
    return (await readBody(response)) as T;
  } catch (error) {
    if (isAbort(error, signal)) {
      throw error;
    }

    throw new AppError(
      `${method} ${url.pathname} returned an unreadable body`,
      ERROR_CODES.SERVER_ERROR,
      response.status,
      DEFAULT_USER_MESSAGES.SERVER_ERROR,
      { cause: error },
    );
  }
};

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
