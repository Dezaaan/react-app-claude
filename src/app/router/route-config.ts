import { lazy } from "react";

import { ROUTES } from "./routes";
import type { RouteConfig } from "./types";

const AboutPage = lazy(() => import("../../pages/About/AboutPage"));
const ContactPage = lazy(() => import("../../pages/Contact/ContactPage"));
const HomePage = lazy(() => import("../../pages/Home/HomePage"));
const NotesPage = lazy(() => import("../../pages/Notes/NotesPage"));
const ProfilePage = lazy(() => import("../../pages/Profile/ProfilePage"));
const SettingsPage = lazy(() => import("../../pages/Settings/SettingsPage"));

export const routeConfig: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    Component: HomePage,
    meta: {
      title: "Home",
      navigation: {
        label: "Home",
        placement: "nav",
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
        placement: "nav",
        order: 2,
      },
    },
  },
  {
    path: ROUTES.ABOUT,
    Component: AboutPage,
    meta: {
      title: "About",
      navigation: {
        label: "About",
        placement: "nav",
        order: 3,
      },
    },
  },
  {
    path: ROUTES.CONTACT,
    Component: ContactPage,
    meta: {
      title: "Contact",
      navigation: {
        label: "Contact",
        placement: "nav",
        order: 4,
      },
    },
  },
  {
    path: ROUTES.PROFILE,
    Component: ProfilePage,
    meta: {
      title: "Profile",
      navigation: {
        label: "Profile",
        placement: "menu",
        order: 5,
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
        placement: "menu",
        order: 6,
      },
    },
  },
];
