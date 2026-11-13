import type { ReactNode } from "react";

/**
 * What a user may do. The backend decides them from the user's role and
 * checks them on every request; the frontend only shows or hides things.
 * `users.*` are reserved for later; the backend doesn't send them yet.
 */
export type Permission =
  "notes.view" | "notes.edit" | "users.view" | "users.edit";

/**
 * The backend's roles. Check permissions, not roles, so a new role needs no
 * frontend change.
 */
export type Role = "user" | "viewer";

/** The user as the backend returns it. */
export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
};

/** Login and refresh responses. The refresh token arrives as a cookie. */
export type AuthResponse = {
  user: AuthUser;
  permissions: Permission[];
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
 * of requirement can be added later. Require permissions, not roles.
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
