import { Suspense } from "react";

import { Routes, Route } from "react-router-dom";

import { routeConfig } from "./route-config";
import type { RouteConfig } from "./types";

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={<route.Component />}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{renderRoutes(routeConfig)}</Routes>
    </Suspense>
  );
};
