// navigation/useNavigationItems.ts

import { routeConfig } from "@/app/router/route-config";
import type { RoutePlacement } from "@/app/router/types";

export const useNavigationItems = (placement: RoutePlacement) => {
  const mainRoute = routeConfig[0];

  return (
    mainRoute.children?.filter(
      (route) => route.meta.navigation?.placement === placement,
    ) ?? []
  );
};
