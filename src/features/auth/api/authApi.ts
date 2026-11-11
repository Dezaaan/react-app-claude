import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { httpClient } from "@/shared/api/httpClient";
import type {
  AuthUser,
  LoginCredentials,
  Permission,
} from "@/features/auth/types";

type RequestConfig = { signal?: AbortSignal };

export const authApi = {
  /** Returns null when nobody is logged in (the server answers 401). */
  getCurrentUser: async ({
    signal,
  }: RequestConfig = {}): Promise<AuthUser | null> => {
    try {
      return await httpClient.get<AuthUser>("/auth/me", { signal });
    } catch (error) {
      if (
        error instanceof AppError &&
        error.code === ERROR_CODES.UNAUTHORIZED
      ) {
        return null;
      }
      throw error;
    }
  },

  getPermissions: ({ signal }: RequestConfig = {}) =>
    httpClient.get<Permission[]>("/auth/permissions", { signal }),

  /** Starts a session; the backend is expected to set a session cookie. */
  login: (credentials: LoginCredentials, { signal }: RequestConfig = {}) =>
    httpClient.post<AuthUser>("/auth/login", credentials, { signal }),

  logout: ({ signal }: RequestConfig = {}) =>
    httpClient.post<void>("/auth/logout", undefined, { signal }),
};
