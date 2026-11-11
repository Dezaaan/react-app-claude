import { AppError } from "@/app/errors/AppError";
import { ERROR_CODES } from "@/app/errors/errorCodes";
import { httpClient } from "@/shared/api/httpClient";
import type { AuthUser, Permission } from "../types";

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
};
