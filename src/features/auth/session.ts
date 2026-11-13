import { accessToken } from "@/shared/api/accessToken";
import { setUnauthorizedHandler } from "@/shared/api/httpClient";
import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { authApi } from "@/features/auth/api/authApi";
import type { AuthResponse, AuthState } from "./types";

/**
 * The current session, loaded once and shared.
 *
 * The access token lives in memory, so after a page load the session is
 * restored with the refresh-token cookie (POST /auth/refresh). Several
 * loaders ask for the session on the same navigation and React Router runs
 * them in parallel, so they share one promise.
 */
let sessionPromise: Promise<AuthState | null> | null = null;

/** The refresh request in flight, if any. */
let refreshPromise: Promise<AuthState | null> | null = null;

/**
 * Login and refresh both return the user's permissions, so a role change
 * shows up at the next refresh (the access token lives 15 minutes).
 */
const toSession = ({
  user,
  permissions,
  accessToken: token,
}: AuthResponse): AuthState => {
  accessToken.set(token);
  return { user, permissions };
};

const isUnauthorized = (error: unknown) =>
  error instanceof AppError && error.code === ERROR_CODES.UNAUTHORIZED;

/**
 * Refreshes the session; null when there is none (401).
 *
 * Only one refresh runs at a time: each one replaces the refresh cookie,
 * and the backend ends the whole session if an old cookie is used again,
 * which two parallel refreshes would do.
 */
const refreshSession = (): Promise<AuthState | null> => {
  refreshPromise ??= authApi
    .refresh()
    .then(toSession)
    .catch((error: unknown) => {
      if (isUnauthorized(error)) {
        accessToken.clear();
        return null;
      }
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/**
 * Resolves to the session, or null when nobody is logged in.
 *
 * Deliberately takes no AbortSignal: the request is shared, so one loader
 * being cancelled must not cancel it for the others.
 */
export const getSession = (): Promise<AuthState | null> => {
  sessionPromise ??= refreshSession().catch((error: unknown) => {
    // Don't cache failures; the next call should try again.
    sessionPromise = null;
    throw error;
  });

  return sessionPromise;
};

/** After logging in: use the response instead of asking the server again. */
export const startSession = (response: AuthResponse) => {
  const session = toSession(response);
  sessionPromise = Promise.resolve(session);
  return session;
};

/** Forgets the session and its token; the next getSession() asks again. */
export const clearSession = () => {
  sessionPromise = null;
  accessToken.clear();
};

/** After logging out: we know there's no session, no need to ask. */
export const endSession = () => {
  sessionPromise = Promise.resolve(null);
  accessToken.clear();
};

// An API request got 401: the access token expired (it lives 15 minutes).
// Refresh once and let httpClient retry; if that fails too, the session is
// over and the next navigation goes to the login page.
setUnauthorizedHandler(async () => {
  try {
    const session = await refreshSession();

    if (session) {
      sessionPromise = Promise.resolve(session);
      return true;
    }
  } catch {
    // Treat a failed refresh (e.g. offline) like an ended session below.
  }

  clearSession();
  return false;
});
