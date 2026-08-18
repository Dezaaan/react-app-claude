import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { routeConfig } from "./route-config";
import MainLayout from "@/layouts";

const routes = createRoutesFromElements(
  <Route path="/" element={<MainLayout />}>
    {routeConfig.map(({ path, Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ))}
  </Route>,
);

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

// export const AppRouter = () => {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Routes>{renderRoutes(routeConfig)}</Routes>
//     </Suspense>
//   );
// };
