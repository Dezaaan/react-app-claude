import type { LazyExoticComponent, ComponentType } from "react";

export interface RouteMeta {
  title: string;
  navigation: { visible: boolean };
}

export interface RouteConfig {
  path: string;
  Component: LazyExoticComponent<ComponentType>;
  meta: RouteMeta;
  children?: RouteConfig[];
}
