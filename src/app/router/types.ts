import type { ComponentType } from "react";

export interface RouteNavigation {
  visible: boolean;
  label: string;
  order?: number;
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
