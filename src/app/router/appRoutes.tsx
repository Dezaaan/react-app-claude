import { Route, createRoutesFromElements } from "react-router-dom";

import MainLayout from "@/layouts";
import { AuthenticatedApp } from "@/app/router/AuthenticatedApp";
import { authenticatedAppLoader } from "@/app/router/loaders/authenticatedAppLoader";

import { AppErrorFallback } from "@/app/errors/AppErrorFallback";
import { RouteError } from "@/app/errors/RouteError";
import {
  isApplicationRoute,
  isStandaloneRoute,
  type PageModule,
} from "./types";
import { routeConfig } from "./route-config";
import { ROUTES } from "./routes";
import { withAccess } from "@/features/auth/routes/requireAccess";
import { logoutAction } from "@/features/auth/routes/logout";
import { PageLayout } from "@/layouts/PageLayout/PageLayout";

// Route `lazy` (unlike React.lazy) lets the router fetch the page's code
// while its loader runs, instead of only after the data has arrived.
const lazyPage = (page: () => Promise<PageModule>) => async () => ({
  Component: (await page()).default,
});

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
          .map(({ path, page, loader, meta }) => {
            return (
              <Route
                key={path}
                path={path}
                // Runs the access check first, so the page's data is only
                // fetched for users allowed to see it.
                loader={withAccess(meta.access, loader)}
                lazy={lazyPage(page)}
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
  .map(({ path, page, loader, action }) => (
    <Route
      key={path}
      path={path}
      loader={loader}
      action={action}
      lazy={lazyPage(page)}
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
