import type { AccessRequirement } from "@/features/auth/types";
import type { ComponentType } from "react";
import type { ActionFunction, LoaderFunction } from "react-router-dom";

export type RoutePlacement = "nav" | "menu";

export interface RouteNavigation {
  label: string;
  order: number;
  placement?: RoutePlacement;
  visible: boolean;
}

/** What a user needs to open a route. See `canAccess`. */
export type RouteAccess = AccessRequirement;

export type RouteLayout = "application" | "standalone";

export type ApplicationRouteMeta = {
  access?: RouteAccess;
  layout: "application";
  navigation?: RouteNavigation;
  title: string;
};

export type StandaloneRouteMeta = {
  layout: "standalone";
  navigation?: RouteNavigation;
  title: string;
};

/** A page file: its default export is the page component. */
export type PageModule = { default: ComponentType };

type ConfigRouteObject = {
  path: string;
  /**
   * Imports the page's code. The router starts it together with the
   * loader, so the code and the data download in parallel.
   */
  page: () => Promise<PageModule>;
  loader?: LoaderFunction;
  action?: ActionFunction;
};

export type ApplicationRoute = ConfigRouteObject & {
  meta: ApplicationRouteMeta;
};

export type StandaloneRoute = ConfigRouteObject & {
  meta: StandaloneRouteMeta;
};

export type RouteConfig = ApplicationRoute | StandaloneRoute;

export const isApplicationRoute = (
  route: RouteConfig,
): route is ApplicationRoute => route.meta.layout === "application";

export const isStandaloneRoute = (
  route: RouteConfig,
): route is StandaloneRoute => route.meta.layout === "standalone";
