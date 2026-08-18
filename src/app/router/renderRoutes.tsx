import { Route } from "react-router-dom";

import type { RouteConfig } from "./types";

export const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map(({ path, Component, children }) => (
    <Route key={path} path={path} element={<Component />}>
      {children && renderRoutes(children)}
    </Route>
  ));
};
