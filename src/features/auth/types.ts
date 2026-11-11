import type { ReactNode } from "react";

export type Permission =
  "notes.view" | "notes.edit" | "users.view" | "users.edit";

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

/** A logged-in user together with what they're allowed to do. */
export type AuthState = {
  user: AuthUser;
  permissions: Permission[];
};

/**
 * What a route (or nav item) requires. Discriminated on `type` so more kinds
 * can be added later, e.g. `{ type: "role"; role: UserRole }`.
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
