import type { ComponentType } from "react";

export type RoutePlacement = "nav" | "menu";

export interface RouteNavigation {
  placement: RoutePlacement;
  label: string;
  order: number;
}

export interface RouteMeta {
  title: string;
  navigation?: RouteNavigation;
}

// app/types.ts

export interface RouteConfig {
  path: string;
  Component: ComponentType;
  meta: RouteMeta;
  children?: RouteConfig[];
}
