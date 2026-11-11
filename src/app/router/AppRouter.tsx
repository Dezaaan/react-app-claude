import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { appRoutes } from "./appRoutes";

const router = createBrowserRouter(appRoutes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
