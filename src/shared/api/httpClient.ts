import { accessToken } from "@/shared/api/accessToken";
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
 *
 * Requests carry the access token as `Authorization: Bearer ...`. When one
 * comes back 401 (the token expired), the client asks the registered
 * unauthorized handler to renew the session and repeats the request once.
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
  /**
   * Don't renew the session and retry on 401. For the auth endpoints
   * themselves, where 401 means "wrong password" or "not logged in".
   */
  skipAuthRefresh?: boolean;
};

/**
 * Renews the session after a 401. Resolves true when there is a new access
 * token to retry with, false when the user is logged out. Rejects when the
 * renewal itself failed (offline, rate limited): the request then fails
 * with that error.
 */
type UnauthorizedHandler = () => Promise<boolean>;

let onUnauthorized: UnauthorizedHandler | null = null;

/** Set by the auth feature; shared code can't depend on it directly. */
export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  onUnauthorized = handler;
};

/**
 * The backend's error body:
 *   { "error": { "code": "NOT_FOUND", "message": "Note not found" } }
 * Validation errors (400) add Zod's flattened errors as `details`:
 *   { formErrors: string[], fieldErrors: { email?: string[], ... } }
 */
type ApiErrorBody = {
  error?: {
    code?: unknown;
    message?: unknown;
    details?: unknown;
  };
};

type FlattenedErrors = {
  formErrors?: unknown;
  fieldErrors?: Record<string, unknown>;
};

/** First readable validation message, e.g. "Invalid email address". */
const firstValidationMessage = (details: unknown): string | undefined => {
  if (typeof details !== "object" || details === null) {
    return undefined;
  }

  const { formErrors, fieldErrors } = details as FlattenedErrors;
  const messages = [
    ...(Array.isArray(formErrors) ? formErrors : []),
    ...Object.values(fieldErrors ?? {}).flatMap((value) =>
      Array.isArray(value) ? value : [],
    ),
  ];

  return messages.find((message) => typeof message === "string");
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

  const apiError =
    typeof body === "object" && body !== null
      ? (body as ApiErrorBody).error
      : undefined;

  const serverMessage =
    typeof apiError?.message === "string"
      ? apiError.message
      : typeof body === "string" // e.g. the rate limiter, or a proxy page
        ? body
        : undefined;

  // Validation messages are written for the user ("Invalid email address"),
  // so show them. Anything else may be internal detail; use our own wording.
  const userMessage =
    (code === ERROR_CODES.VALIDATION_ERROR &&
      (firstValidationMessage(apiError?.details) ?? serverMessage)) ||
    DEFAULT_USER_MESSAGES[code];

  return new AppError(
    serverMessage ??
      `${response.status} ${response.statusText || "Request failed"}`,
    code,
    response.status,
    userMessage,
    // The backend's own code (e.g. "NOT_FOUND") and validation details.
    { details: apiError ?? body },
  );
};

const send = async (
  url: URL,
  { method = "GET", body, headers, signal }: RequestOptions,
  token: string | null,
): Promise<Response> => {
  try {
    return await fetch(url, {
      method,
      signal,
      // Send the refresh-token cookie, also to an API on another origin.
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
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
};

/** A new token is available when one appeared after `tokenUsed` was sent. */
const renewToken = async (tokenUsed: string | null) => {
  const current = accessToken.get();

  // Another request already renewed it while this one was in flight.
  if (current && current !== tokenUsed) {
    return true;
  }

  return onUnauthorized ? onUnauthorized() : false;
};

export const request = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", query, signal, skipAuthRefresh } = options;
  const url = buildUrl(path, query);

  let token = accessToken.get();
  let response = await send(url, options, token);

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    (await renewToken(token))
  ) {
    token = accessToken.get();
    response = await send(url, options, token);
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
