import type { AccessRequirement } from "@/features/auth/types";
import type { Text } from "@/shared/content/types";
import type { ComponentType } from "react";
import type { ActionFunction, LoaderFunction } from "react-router-dom";

export type RoutePlacement = "nav" | "menu";

/** Shows the route as a link in the header ("nav") or the user menu. */
export interface RouteNavigation {
  label: Text;
  order: number;
  placement: RoutePlacement;
  /** Set to false to hide the link without removing it. */
  visible: boolean;
}

/** What a user needs to open a route. See `canAccess`. */
export type RouteAccess = AccessRequirement;

export type RouteLayout = "application" | "standalone";

/** A page file: its default export is the page component. */
export type PageModule = { default: ComponentType };

export type RouteMeta = {
  /** The page heading (PageHeader) and the browser tab title. */
  title: Text;
  /** One sentence under the heading. Longer text belongs in the page. */
  description?: Text;
  /**
   * Also required by every route below this one: a child can add a
   * requirement, never remove one.
   */
  access?: RouteAccess;
  navigation?: RouteNavigation;
};

type RouteFields = {
  /**
   * Imports the page's code. The router starts it together with the
   * loader, so the code and the data download in parallel.
   *
   * A route with `children` and a page renders its child inside the page
   * (the page renders `<Outlet />`). Without a page, the child replaces it,
   * e.g. `/notes` (list) and `/notes/:id` (details) as separate screens.
   */
  page?: () => Promise<PageModule>;
  loader?: LoaderFunction;
  action?: ActionFunction;
  meta: RouteMeta;
  children?: ChildRoute[];
};

/**
 * A route inside another one. `path` is relative to the parent
 * (`":id"` under `/notes` is `/notes/:id`); `index: true` is the page at
 * the parent's own path. An index route can't have children (React Router
 * doesn't allow it), so put them on the parent instead.
 */
export type ChildRoute =
  | (RouteFields & { path: string; index?: never })
  | (Omit<RouteFields, "children"> & {
      index: true;
      path?: never;
      children?: never;
    });

type TopLevelRoute = RouteFields & { path: string };

export type ApplicationRoute = TopLevelRoute & {
  /** Inside the main layout, for logged-in users. */
  layout: "application";
};

export type StandaloneRoute = TopLevelRoute & {
  /** Its own full screen, e.g. login; `access` doesn't apply here. */
  layout: "standalone";
};

export type RouteConfig = ApplicationRoute | StandaloneRoute;

/** Any route in the config, top-level or nested. */
export type ConfigRoute = RouteConfig | ChildRoute;

export const isApplicationRoute = (
  route: RouteConfig,
): route is ApplicationRoute => route.layout === "application";

export const isStandaloneRoute = (
  route: RouteConfig,
): route is StandaloneRoute => route.layout === "standalone";
