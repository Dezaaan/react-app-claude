import { lazy } from "react";

import { ROUTES } from "./routes";

import type { RouteConfig } from "./types";

const HomePage = lazy(() => import("../pages/Home/HomePage"));
const NotesPage = lazy(() => import("../pages/Notes/NotesPage"));
const SettingsPage = lazy(() => import("../pages/Settings/SettingsPage"));

export const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    Component: HomePage,
    meta: {
      title: "Home",
      navigation: { visible: true },
    },
  },
  {
    path: ROUTES.NOTES,
    Component: NotesPage,
    meta: {
      title: "Notes",
      navigation: { visible: true },
    },
  },
  {
    path: ROUTES.SETTINGS,
    Component: SettingsPage,
    meta: {
      title: "Settings",
      navigation: { visible: true },
    },
  },
];
