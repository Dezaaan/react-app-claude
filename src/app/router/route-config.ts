import type { RouteConfig } from "./types";
import { ROUTES } from "./routes";
import { notesLoader } from "@/features/notes/loaders/notesLoader";
import { loginAction, loginLoader } from "@/features/auth/routes/login";

const applicationRoutes = [
  {
    path: ROUTES.HOME,
    page: () => import("@/pages/Home/HomePage"),
    loader: notesLoader,
    meta: {
      layout: "application",
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
    loader: notesLoader,
    meta: {
      access: { type: "permission", permission: "notes.view" },
      layout: "application",
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
    meta: {
      layout: "application",
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
    meta: {
      layout: "application",
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
    meta: {
      layout: "application",
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
    meta: {
      layout: "application",
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
    meta: {
      title: "Login",
      layout: "standalone",
      navigation: {
        label: "Login",
        order: 6,
        visible: false,
      },
    },
  },
  {
    path: ROUTES.FORBIDDEN,
    page: () => import("@/pages/Forbidden/ForbiddenPage"),
    meta: {
      title: "Forbidden",
      layout: "standalone",
      navigation: {
        label: "Forbidden",
        order: 6,
        visible: false,
      },
    },
  },
  {
    path: ROUTES.NOTFOUND,
    page: () => import("@/pages/NotFound/NotFoundPage"),
    meta: {
      title: "Not Found",
      layout: "standalone",
      navigation: {
        label: "Not Found",
        order: 7,
        visible: false,
      },
    },
  },
] satisfies RouteConfig[];

export const routeConfig: RouteConfig[] = [
  ...applicationRoutes,
  ...standaloneRoutes,
];
