import { httpClient } from "@/shared/api/httpClient";
import type {
  AuthResponse,
  LoginCredentials,
  Permission,
} from "@/features/auth/types";

type RequestConfig = { signal?: AbortSignal };

/**
 * What every logged-in user may do, until the backend sends permissions.
 * Change `getPermissions` to call the backend when it does.
 */
const LOGGED_IN_PERMISSIONS: Permission[] = ["notes.view", "notes.edit"];

// The auth endpoints answer 401 for "wrong password" or "not logged in";
// renewing the session and retrying would make no sense there.
const auth = { skipAuthRefresh: true };

export const authApi = {
  /**
   * Starts a session. The backend sets the refresh-token cookie and returns
   * the user with an access token.
   */
  login: (credentials: LoginCredentials, { signal }: RequestConfig = {}) =>
    httpClient.post<AuthResponse>("/auth/login", credentials, {
      ...auth,
      signal,
    }),

  /**
   * Uses the refresh-token cookie to get a new access token. Answers 401
   * when there is no valid session. Each call replaces the cookie, and
   * reusing an old one ends the session, so never run two at once (see
   * `session.ts`).
   */
  refresh: () =>
    httpClient.post<AuthResponse>("/auth/refresh", undefined, auth),

  /** Ends the current session and clears the cookie. */
  logout: ({ signal }: RequestConfig = {}) =>
    httpClient.post<void>("/auth/logout", undefined, { ...auth, signal }),

  getPermissions: async (): Promise<Permission[]> => LOGGED_IN_PERMISSIONS,
};
