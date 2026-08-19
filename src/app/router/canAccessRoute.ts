import type { AuthUser, RouteAccess } from "./types";

export const canAccessRoute = (access: RouteAccess, user: AuthUser | null) => {
  console.log("access:", access, "user:", user);
  if (access === "public") {
    return true;
  }

  if (!user) {
    return false;
  }

  if (access === "authenticated") {
    return true;
  }

  if (access === "admin") {
    return user.role === "admin";
  }

  return false;
};
