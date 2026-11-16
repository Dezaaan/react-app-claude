import { routeConfig } from "@/app/router/route-config";
import type { RoutePlacement } from "@/app/router/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { navigationItems } from "./navigationItems";

/** Visible routes for `placement` that the current user may open, by order. */
export const useNavigationItems = (placement: RoutePlacement) => {
  const { canAccess } = useAuth();

  return navigationItems(routeConfig, placement, canAccess);
};
