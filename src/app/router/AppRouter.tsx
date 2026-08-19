import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "@/layouts";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { routeConfig } from "./route-config";

const applicationRoutes = (
  <Route path="/" element={<MainLayout />}>
    {routeConfig
      .filter(({ meta }) => meta.layout === "main")
      .map(({ path, Component, meta }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute access={meta.access}>
              <Component />
            </ProtectedRoute>
          }
        />
      ))}
  </Route>
);

const standaloneRoutes = routeConfig
  .filter(({ meta }) => meta.layout === "standalone")
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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};
