import { Route, createRoutesFromElements } from "react-router-dom";

import MainLayout from "@/layouts";
import { AuthenticatedApp } from "@/app/router/AuthenticatedApp";
import { authenticatedAppLoader } from "@/app/router/loaders/authenticatedAppLoader";

import { AppErrorFallback } from "../errors/AppErrorFallback";
import { RouteError } from "../errors/RouteError";
import { isApplicationRoute, isStandaloneRoute } from "./types";
import { routeConfig } from "./route-config";
import { ROUTES } from "./routes";
import { withAccess } from "@/features/auth/routes/requireAccess";
import { logoutAction } from "@/features/auth/routes/logout";
import { PageLayout } from "@/layouts/PageLayout/PageLayout";

const applicationRoutes = (
  <Route
    element={<AuthenticatedApp />}
    errorElement={<RouteError />}
    hydrateFallbackElement={<>Loading application...</>}
    loader={authenticatedAppLoader}
  >
    <Route path="/" element={<MainLayout />}>
      <Route element={<PageLayout />}>
        {routeConfig
          .filter(isApplicationRoute)
          .map(({ path, Component, loader, meta }) => {
            return (
              <Route
                key={path}
                path={path}
                // Runs the access check first, so the page's data is only
                // fetched for users allowed to see it.
                loader={withAccess(meta.access, loader)}
                element={<Component />}
                errorElement={<RouteError />}
              />
            );
          })}
      </Route>
    </Route>
  </Route>
);

const standaloneRoutes = routeConfig
  .filter(isStandaloneRoute)
  .map(({ path, Component, loader, action }) => (
    <Route
      key={path}
      path={path}
      loader={loader}
      action={action}
      element={<Component />}
    />
  ));

// Kept separate from AppRouter so tests can mount the real route tree
// in a memory router.
export const appRoutes = createRoutesFromElements(
  <Route errorElement={<AppErrorFallback />}>
    {applicationRoutes}
    <Route path={ROUTES.LOGOUT} action={logoutAction} />
    {standaloneRoutes}
  </Route>,
);
