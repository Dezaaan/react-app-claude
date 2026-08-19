import type { ComponentType, ReactNode } from "react";

export type RoutePlacement = "nav" | "menu";

export interface RouteNavigation {
  label: string;
  order: number;
  placement?: RoutePlacement;
  visible: boolean;
}

export type RouteAccess = "public" | "authenticated" | "admin";
export type RouteLayout = "main" | "standalone";

export interface RouteMeta {
  access: RouteAccess;
  layout: RouteLayout;
  navigation?: RouteNavigation;
  title: string;
}

export interface RouteConfig {
  path: string;
  Component: ComponentType;
  meta: RouteMeta;
  children?: RouteConfig[];
}

export type AuthUser = {
  id: string;
  role: "user" | "admin";
};

export type ProtectedRouteProps = {
  access: RouteAccess;
  children: ReactNode;
};
