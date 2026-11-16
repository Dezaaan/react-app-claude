import type {
  ConfigRoute,
  RouteAccess,
  RouteConfig,
  RouteMeta,
  RoutePlacement,
} from "@/app/router/types";

export type NavigationItem = {
  /** Full path, e.g. "/settings/profile" for a child route. */
  path: string;
  meta: RouteMeta;
};

/** `":id"` under `"/notes"` is `"/notes/:id"`; absolute paths stay as they are. */
const joinPath = (parent: string, path: string) =>
  path.startsWith("/") ? path : `${parent.replace(/\/$/, "")}/${path}`;

/**
 * The visible links for `placement`, from the whole route tree, sorted by
 * `order`. A route is left out when the user can't open it or a route
 * above it.
 */
export const navigationItems = (
  routes: RouteConfig[],
  placement: RoutePlacement,
  canAccess: (access?: RouteAccess) => boolean,
): NavigationItem[] => {
  const items: NavigationItem[] = [];

  const visit = (route: ConfigRoute, parentPath: string) => {
    if (!canAccess(route.meta.access)) {
      return;
    }

    const path = route.path ? joinPath(parentPath, route.path) : parentPath;
    const { navigation } = route.meta;

    if (navigation?.visible && navigation.placement === placement) {
      items.push({ path, meta: route.meta });
    }

    route.children?.forEach((child) => visit(child, path));
  };

  // Standalone routes (login, not found) are never in the navigation.
  routes
    .filter((route) => route.layout === "application")
    .forEach((route) => visit(route, "/"));

  return items.sort(
    (a, b) => (a.meta.navigation?.order ?? 0) - (b.meta.navigation?.order ?? 0),
  );
};
