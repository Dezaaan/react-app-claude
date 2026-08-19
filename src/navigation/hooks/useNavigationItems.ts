// navigation/useNavigationItems.ts

import { routeConfig } from "@/app/router/route-config";
import type { RoutePlacement } from "@/app/router/types";

export const useNavigationItems = (placement: RoutePlacement) => {
  return (
    routeConfig.filter(
      (route) =>
        route.meta.navigation?.visible &&
        route.meta.navigation?.placement === placement,
    ) ?? []
  );
};
