// navigation/useNavigationItems.ts

import { routeConfig } from "@/app/router/route-config";

export const useNavigationItems = () => {
  const mainRoute = routeConfig[0];

  return (
    mainRoute.children?.filter((route) => route.meta.navigation?.visible) ?? []
  );
};
