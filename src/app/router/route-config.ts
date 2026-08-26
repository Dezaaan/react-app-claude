import { lazy } from "react";

import { ROUTES } from "./routes";
import type { RouteConfig } from "./types";
import { notesLoader } from "@/features/notes/loaders/notesLoader";

const AboutPage = lazy(() => import("../../pages/About/AboutPage"));
const ContactPage = lazy(() => import("../../pages/Contact/ContactPage"));
const HomePage = lazy(() => import("../../pages/Home/HomePage"));
const NotesPage = lazy(() => import("../../pages/Notes/NotesPage"));
const ProfilePage = lazy(() => import("../../pages/Profile/ProfilePage"));
const SettingsPage = lazy(() => import("../../pages/Settings/SettingsPage"));
const LoginPage = lazy(() => import("../../pages/Login/LoginPage"));
const ForbiddenPage = lazy(() => import("../../pages/Forbidden/ForbiddenPage"));
const NotFoundPage = lazy(() => import("../../pages/NotFound/NotFoundPage"));

const applicationRoutes = [
  {
    path: ROUTES.HOME,
    Component: HomePage,
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
    Component: NotesPage,
    loader: notesLoader,
    meta: {
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
    Component: AboutPage,
    loader: () => {},
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
    Component: ContactPage,
    loader: () => {},
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
    Component: ProfilePage,
    loader: () => {},
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
    Component: SettingsPage,
    loader: () => {},
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
    Component: LoginPage,
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
    Component: ForbiddenPage,
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
    Component: NotFoundPage,
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

export const routeConfig = [...applicationRoutes, ...standaloneRoutes];
