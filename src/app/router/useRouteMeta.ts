import { useMatches } from "react-router-dom";

import type { RouteMeta } from "./types";

/** What buildRoutes puts in each route's `handle`. */
export type RouteHandle = { meta: RouteMeta };

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === "object" && handle !== null && "meta" in handle;

/**
 * The config `meta` of the page being shown: the deepest matched route,
 * so `/notes/42` gets the details route's meta, not the list's.
 */
export const useRouteMeta = (): RouteMeta | undefined => {
  const handle = useMatches()
    .map((match) => match.handle)
    .findLast(isRouteHandle);

  return handle?.meta;
};
