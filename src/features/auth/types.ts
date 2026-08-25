// features/auth/types.ts

import type { ReactNode } from "react";

export type AuthContextValue = {
  user: AuthUser | null;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
};

export type AuthProviderProps = {
  user: AuthUser | null;
  permissions: Permission[];
  children: ReactNode;
};

export type AuthState = {
  user: AuthUser;
  permissions: Permission[];
};

export type Permission =
  | "notes.view"
  | "notes.edit"
  | "users.view"
  | "users.edit";

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
