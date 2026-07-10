import type { NavigationMenuItemConfig } from "./types";

export const menuItems: NavigationMenuItemConfig[] = [
  {
    id: "profile",
    label: "Profile",
    type: "link",
    to: "/profile",
  },
  {
    id: "settings",
    label: "Settings",
    type: "link",
    to: "/settings",
  },
  {
    id: "logout",
    label: "Logout",
    type: "action",
    onClick: () => {},
  },
];
