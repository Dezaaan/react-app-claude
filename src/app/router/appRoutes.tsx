import type { RouteObject } from "react-router-dom";

import MainLayout from "@/layouts";
import { AuthenticatedApp } from "@/app/router/AuthenticatedApp";
import { authenticatedAppLoader } from "@/app/router/loaders/authenticatedAppLoader";
import { RootError } from "@/app/errors/RootError";
import { RouteError } from "@/app/errors/RouteError";
import { logoutAction } from "@/features/auth/routes/logout";
import { PageLayout } from "@/layouts/PageLayout/PageLayout";
import { buildRoutes } from "./buildRoutes";
import { routeConfig } from "./route-config";
import { ROUTES } from "./routes";
import { isApplicationRoute, isStandaloneRoute } from "./types";

// Kept separate from AppRouter so tests can mount the real route tree
// in a memory router.
export const appRoutes: RouteObject[] = [
  {
    errorElement: <RootError />,
    children: [
      {
        // Pages for logged-in users, inside the main layout.
        element: <AuthenticatedApp />,
        errorElement: <RouteError />,
        hydrateFallbackElement: <>Loading application...</>,
        loader: authenticatedAppLoader,
        children: [
          {
            path: "/",
            element: <MainLayout />,
            children: [
              {
                element: <PageLayout />,
                children: buildRoutes(routeConfig.filter(isApplicationRoute), {
                  guarded: true,
                }),
              },
            ],
          },
        ],
      },
      { path: ROUTES.LOGOUT, action: logoutAction },
      ...buildRoutes(routeConfig.filter(isStandaloneRoute), { guarded: false }),
    ],
  },
];
