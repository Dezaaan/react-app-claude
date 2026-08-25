import type { AuthProviderProps, Permission } from "../types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({
  user,
  permissions,
  children,
}: AuthProviderProps) => {
  const hasPermission = (permission: Permission) =>
    permissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
