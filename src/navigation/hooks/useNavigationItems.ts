// navigation/useNavigationItems.ts

import { routeConfig } from "@/app/router/route-config";
import { isApplicationRoute, type RoutePlacement } from "@/app/router/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

/** Visible routes for `placement` that the current user may open, by order. */
export const useNavigationItems = (placement: RoutePlacement) => {
  const { canAccess } = useAuth();

  return routeConfig
    .filter(
      (route) =>
        route.meta.navigation?.visible &&
        route.meta.navigation.placement === placement &&
        (!isApplicationRoute(route) || canAccess(route.meta.access)),
    )
    .sort(
      (a, b) =>
        (a.meta.navigation?.order ?? 0) - (b.meta.navigation?.order ?? 0),
    );
};
