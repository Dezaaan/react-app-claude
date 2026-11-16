import { describe, expect, it } from "vitest";

import type { RouteConfig } from "@/app/router/types";
import type { Permission } from "@/features/auth/types";
import { canAccess } from "@/features/auth/access";
import { navigationItems } from "@/navigation/hooks/navigationItems";

const nav = (
  label: string,
  order: number,
  placement: "nav" | "menu" = "nav",
) => ({
  label,
  order,
  placement,
  visible: true,
});

const routes: RouteConfig[] = [
  {
    path: "/",
    layout: "application",
    meta: { title: "Home", navigation: nav("Home", 1) },
  },
  {
    path: "/settings",
    layout: "application",
    meta: { title: "Settings", navigation: nav("Settings", 3, "menu") },
    children: [
      {
        path: "profile",
        meta: { title: "Profile", navigation: nav("Profile", 2, "menu") },
      },
      {
        path: "users",
        meta: {
          title: "Users",
          access: { type: "permission", permission: "users.view" },
          navigation: nav("Users", 4, "menu"),
        },
      },
    ],
  },
  {
    path: "/admin",
    layout: "application",
    meta: {
      title: "Admin",
      access: { type: "permission", permission: "users.edit" },
    },
    children: [
      { path: "logs", meta: { title: "Logs", navigation: nav("Logs", 5) } },
    ],
  },
  { path: "/login", layout: "standalone", meta: { title: "Login" } },
];

const items = (placement: "nav" | "menu", permissions: Permission[] = []) =>
  navigationItems(routes, placement, (access) =>
    canAccess(permissions, access),
  ).map(({ path, meta }) => `${meta.navigation?.label} ${path}`);

describe("navigationItems", () => {
  it("includes child routes with their full path, sorted by order", () => {
    expect(items("menu", ["users.view"])).toEqual([
      "Profile /settings/profile",
      "Settings /settings",
      "Users /settings/users",
    ]);
  });

  it("leaves out routes the user can't open", () => {
    expect(items("menu")).toEqual([
      "Profile /settings/profile",
      "Settings /settings",
    ]);
  });

  it("leaves out children of a route the user can't open", () => {
    // "Logs" has no requirement of its own, but /admin needs users.edit.
    expect(items("nav")).toEqual(["Home /"]);
    expect(items("nav", ["users.edit"])).toEqual([
      "Home /",
      "Logs /admin/logs",
    ]);
  });
});
