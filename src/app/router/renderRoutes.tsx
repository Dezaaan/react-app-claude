import { Route } from "react-router-dom";

import type { RouteConfig } from "./types";

export const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={<route.Component />}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};
