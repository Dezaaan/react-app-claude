import { useMemo } from "react";

import { canAccess } from "../access";
import type { AuthContextValue, AuthProviderProps } from "../types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({
  user,
  permissions,
  children,
}: AuthProviderProps) => {
  // Stable value, so consumers only re-render when the session changes.
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      hasPermission: (permission) => permissions.includes(permission),
      canAccess: (access) => canAccess(permissions, access),
    }),
    [user, permissions],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
