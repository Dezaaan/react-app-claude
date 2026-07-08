import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { routeConfig } from "./route-config";

export const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routeConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.Component />}
          />
        ))}
      </Routes>
    </Suspense>
  );
};
