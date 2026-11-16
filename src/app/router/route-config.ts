import type { RouteConfig } from "./types";
import { ROUTES } from "./routes";
import { notesLoader } from "@/features/notes/loaders/notesLoader";
import { notesPageLoader } from "@/features/notes/loaders/notesPageLoader";
import { loginAction, loginLoader } from "@/features/auth/routes/login";

const applicationRoutes = [
  {
    path: ROUTES.HOME,
    page: () => import("@/pages/Home/HomePage"),
    loader: notesLoader,
    layout: "application",
    meta: {
      title: "Home",
      navigation: {
        label: "Home",
        order: 1,
        placement: "nav",
        visible: true,
      },
    },
  },
  {
    path: ROUTES.NOTES,
    page: () => import("@/pages/Notes/NotesPage"),
    loader: notesPageLoader,
    layout: "application",
    meta: {
      access: { type: "permission", permission: "notes.view" },
      title: "Notes",
      navigation: {
        label: "Notes",
        order: 2,
        placement: "nav",
        visible: true,
      },
    },
  },
  {
    path: ROUTES.ABOUT,
    page: () => import("@/pages/About/AboutPage"),
    layout: "application",
    meta: {
      title: "About",
      navigation: {
        label: "About",
        order: 3,
        placement: "nav",
        visible: true,
      },
    },
  },
  {
    path: ROUTES.CONTACT,
    page: () => import("@/pages/Contact/ContactPage"),
    layout: "application",
    meta: {
      title: "Contact",
      navigation: {
        label: "Contact",
        order: 4,
        placement: "nav",
        visible: true,
      },
    },
  },
  {
    path: ROUTES.PROFILE,
    page: () => import("@/pages/Profile/ProfilePage"),
    layout: "application",
    meta: {
      title: "Profile",
      navigation: {
        label: "Profile",
        order: 5,
        placement: "menu",
        visible: true,
      },
    },
  },
  {
    path: ROUTES.SETTINGS,
    page: () => import("@/pages/Settings/SettingsPage"),
    layout: "application",
    meta: {
      title: "Settings",
      navigation: {
        label: "Settings",
        order: 6,
        placement: "menu",
        visible: true,
      },
    },
  },
] satisfies RouteConfig[];

const standaloneRoutes = [
  {
    path: ROUTES.LOGIN,
    page: () => import("@/pages/Login/LoginPage"),
    loader: loginLoader,
    action: loginAction,
    layout: "standalone",
    meta: {
      title: "Login",
    },
  },
  {
    path: ROUTES.NOTFOUND,
    page: () => import("@/pages/NotFound/NotFoundPage"),
    layout: "standalone",
    meta: {
      title: "Not Found",
    },
  },
] satisfies RouteConfig[];

export const routeConfig: RouteConfig[] = [
  ...applicationRoutes,
  ...standaloneRoutes,
];
