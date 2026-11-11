import type { AccessRequirement } from "@/features/auth/types";
import type { ComponentType } from "react";
import type { LoaderFunction, RouteObject } from "react-router-dom";

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

// Every config route must define a path and a component (RouteObject makes
// both optional). `loader` is narrowed to a function: RouteObject also allows
// `true`, which is for server rendering and not used here.
type ConfigRouteObject = RouteObject & {
  path: string;
  Component: ComponentType;
  loader?: LoaderFunction;
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
