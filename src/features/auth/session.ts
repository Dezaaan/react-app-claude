import { authApi } from "@/features/auth/api/authApi";
import type { AuthState } from "./types";

/**
 * The current session, fetched once and shared.
 *
 * Several loaders need it on the same navigation (the app layout, and any
 * route that checks permissions). React Router runs those loaders in
 * parallel, so without this they'd each call /auth/me and
 * /auth/permissions. Call `clearSession()` whenever the session changes
 * (login, logout).
 */
let sessionPromise: Promise<AuthState | null> | null = null;

const loadSession = async (): Promise<AuthState | null> => {
  const user = await authApi.getCurrentUser();

  if (!user) {
    return null;
  }

  const permissions = await authApi.getPermissions();

  return { user, permissions };
};

/**
 * Resolves to the session, or null when nobody is logged in.
 *
 * Deliberately takes no AbortSignal: the request is shared, so one loader
 * being cancelled must not cancel it for the others.
 */
export const getSession = (): Promise<AuthState | null> => {
  sessionPromise ??= loadSession().catch((error: unknown) => {
    // Don't cache failures; the next call should try again.
    sessionPromise = null;
    throw error;
  });

  return sessionPromise;
};

export const clearSession = () => {
  sessionPromise = null;
};
