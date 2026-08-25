import type { Permission } from "@/features/auth/types";
import type { ComponentType } from "react";

export type RoutePlacement = "nav" | "menu";

export interface RouteNavigation {
  label: string;
  order: number;
  placement?: RoutePlacement;
  visible: boolean;
}

// export type RouteAccess = "public" | "authenticated" | "admin";

export type RouteAccess =
  | {
      type: "permission";
    }
  | {
      type: "permission";
      permission: Permission;
    };

export type RouteLayout = "main" | "standalone";

export type MainRouteMeta = {
  layout: "main";
  title: string;
  access?: RouteAccess;
  navigation?: RouteNavigation;
};

export type StandaloneRouteMeta = {
  layout: "standalone";
  title: string;
  navigation?: RouteNavigation;
};

export type RouteMeta = MainRouteMeta | StandaloneRouteMeta;

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
