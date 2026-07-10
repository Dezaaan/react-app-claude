import { Suspense } from "react";

import { Routes } from "react-router-dom";

import { routeConfig } from "./route-config";
import { renderRoutes } from "./renderRoutes";

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>{renderRoutes(routeConfig)}</Routes>
    </Suspense>
  );
};
