import type { ReactNode } from "react";

export type Permission =
  "notes.view" | "notes.edit" | "users.view" | "users.edit";

/** The user as the backend returns it. */
export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
};

/** Login and refresh responses. The refresh token arrives as a cookie. */
export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  /** Seconds until `accessToken` expires. */
  accessTokenExpiresIn: number;
};

/** A logged-in user together with what they're allowed to do. */
export type AuthState = {
  user: AuthUser;
  permissions: Permission[];
};

/**
 * What a route (or nav item) requires. Discriminated on `type` so more kinds
 * can be added later, e.g. `{ type: "role"; role: "admin" }`.
 */
export type AccessRequirement = {
  type: "permission";
  permission: Permission;
};

export type AuthContextValue = AuthState & {
  hasPermission: (permission: Permission) => boolean;
  canAccess: (access?: AccessRequirement) => boolean;
};

export type AuthProviderProps = AuthState & {
  children: ReactNode;
};

export type LoginCredentials = {
  email: string;
  password: string;
};
