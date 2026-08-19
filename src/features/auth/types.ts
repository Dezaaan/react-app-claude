// features/auth/types.ts

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};
