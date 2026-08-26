import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "@/layouts";
import { AuthenticatedApp } from "@/layouts/AuthenticatedApp";
import { authenticatedAppLoader } from "@/features/auth/loaders/authenticatedAppLoader";

import { routeConfig } from "./route-config";
import { isApplicationRoute, isStandaloneRoute } from "./types";

const applicationRoutes = (
  <Route element={<AuthenticatedApp />} loader={authenticatedAppLoader}>
    <Route path="/" element={<MainLayout />}>
      {routeConfig
        .filter(isApplicationRoute)
        .map(({ path, Component, loader }) => {
          return (
            <Route
              key={path}
              path={path}
              element={<Component />}
              loader={loader}
            />
          );
        })}
    </Route>
  </Route>
);

const standaloneRoutes = routeConfig
  .filter(isStandaloneRoute)
  .map(({ path, Component }) => (
    <Route key={path} path={path} element={<Component />} />
  ));

const routes = createRoutesFromElements(
  <>
    {applicationRoutes}
    {standaloneRoutes}
  </>,
);
const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
