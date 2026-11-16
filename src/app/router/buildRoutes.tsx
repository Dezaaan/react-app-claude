import type { LoaderFunction, RouteObject } from "react-router-dom";

import { RouteError } from "@/app/errors/RouteError";
import { withAccess } from "@/features/auth/routes/requireAccess";
import type {
  ConfigRoute,
  PageModule,
  RouteAccess,
  RouteConfig,
} from "./types";

// Route `lazy` (unlike React.lazy) lets the router fetch the page's code
// while its loader runs, instead of only after the data has arrived.
const lazyPage = (page: () => Promise<PageModule>) => async () => ({
  Component: (await page()).default,
});

/**
 * Wraps `loader` in one access check per requirement, outermost first.
 *
 * React Router runs a parent's and its child's loaders in parallel, so a
 * child can't rely on its parent's check having passed: each route checks
 * everything above it too. The session is shared, so this costs nothing.
 */
const guardLoader = (
  access: RouteAccess[],
  loader: LoaderFunction | undefined,
): LoaderFunction | undefined =>
  access.length === 0
    ? // Still waits for the session, so API calls carry the token.
      withAccess(undefined, loader)
    : access.reduceRight<LoaderFunction | undefined>(
        (inner, requirement) => withAccess(requirement, inner),
        loader,
      );

type BuildOptions = {
  /** Check access and show errors inside the layout (application routes). */
  guarded: boolean;
  /** Requirements of the routes above. */
  inheritedAccess?: RouteAccess[];
};

const toRouteObject = (
  route: ConfigRoute,
  { guarded, inheritedAccess = [] }: BuildOptions,
): RouteObject => {
  const { page, loader, action, meta, children } = route;
  const access = meta.access
    ? [...inheritedAccess, meta.access]
    : inheritedAccess;

  const common = {
    // The loader of a guarded route also runs the access checks, so the
    // page's data is only fetched for users allowed to see it.
    loader: guarded ? guardLoader(access, loader) : loader,
    action,
    lazy: page && lazyPage(page),
    ...(guarded && { errorElement: <RouteError /> }),
  };

  if ("index" in route && route.index) {
    return { ...common, index: true };
  }

  return {
    ...common,
    path: route.path,
    children: children?.map((child) =>
      toRouteObject(child, { guarded, inheritedAccess: access }),
    ),
  };
};

/**
 * Turns config routes into React Router routes, children included.
 * `guarded` is for application routes: access checks and in-layout errors.
 */
export const buildRoutes = (
  routes: RouteConfig[],
  options: BuildOptions,
): RouteObject[] => routes.map((route) => toRouteObject(route, options));
