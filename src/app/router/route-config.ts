// app/route-config.ts

import { lazy } from "react";

import MainLayout from "@/layouts/MainLayout";

import { ROUTES } from "./routes";
import type { RouteConfig } from "./types";

const HomePage = lazy(() => import("../../pages/Home"));
const NotesPage = lazy(() => import("../../pages/Notes"));
const SettingsPage = lazy(() => import("../../pages/Settings"));

const routes = [
  {
    path: ROUTES.HOME,
    Component: HomePage,
    meta: {
      title: "Home",
      navigation: {
        label: "Home",
        visible: true,
        order: 1,
      },
    },
  },
  {
    path: ROUTES.NOTES,
    Component: NotesPage,
    meta: {
      title: "Notes",
      navigation: {
        label: "Notes",
        visible: true,
        order: 2,
      },
    },
  },
  {
    path: ROUTES.SETTINGS,
    Component: SettingsPage,
    meta: {
      title: "Settings",
      navigation: {
        label: "Settings",
        visible: true,
        order: 3,
      },
    },
  },
];

export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    Component: MainLayout,
    meta: {
      title: "Main",
    },
    children: routes,
  },
];
