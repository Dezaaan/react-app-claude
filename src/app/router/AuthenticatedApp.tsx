import { useLoaderData, Outlet } from "react-router-dom";
import type { authenticatedAppLoader } from "@/app/router/loaders/authenticatedAppLoader";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

//TODO check folder structure and do we need authenticatedApp folder, footer and header separated
export const AuthenticatedApp = () => {
  const { user, permissions } = useLoaderData<typeof authenticatedAppLoader>();

  return (
    <AuthProvider user={user} permissions={permissions}>
      <Outlet />
    </AuthProvider>
  );
};
