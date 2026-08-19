import { Navigate } from "react-router-dom";
import { canAccessRoute } from "./canAccessRoute";
import { ROUTES } from "./routes";
import type { ProtectedRouteProps } from "./types";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const ProtectedRoute = ({ access, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!canAccessRoute(access, user)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
};
