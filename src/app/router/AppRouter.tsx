import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import MainLayout from "@/layouts";
import { AuthenticatedApp } from "@/app/router/AuthenticatedApp";
import { authenticatedAppLoader } from "@/app/router/loaders/authenticatedAppLoader";

import { AppErrorFallback } from "../errors/AppErrorFallback";
import { RouteError } from "../errors/RouteError";
import { isApplicationRoute, isStandaloneRoute } from "./types";
import { routeConfig } from "./route-config";
import { PageLayout } from "@/layouts/PageLayout/PageLayout";

const applicationRoutes = (
  <Route
    element={<AuthenticatedApp />}
    errorElement={<RouteError />}
    hydrateFallbackElement={<>Loading application...</>} // TODO need application level error component
    loader={authenticatedAppLoader}
  >
    <Route path="/" element={<MainLayout />}>
      <Route element={<PageLayout />}>
        {routeConfig
          .filter(isApplicationRoute)
          .map(({ path, Component, loader }) => {
            return (
              <Route
                key={path}
                path={path}
                loader={loader}
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
  .map(({ path, Component }) => (
    <Route key={path} path={path} element={<Component />} />
  ));

const routes = createRoutesFromElements(
  <Route errorElement={<AppErrorFallback />}>
    {applicationRoutes}
    {standaloneRoutes}
  </Route>,
);

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
