import { useLoaderData, Outlet } from "react-router-dom";
import type { authenticatedAppLoader } from "@/app/router/loaders/authenticatedAppLoader";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

/**
 * Route element for every page that needs a logged-in user. Its loader
 * (authenticatedAppLoader) restores the session or redirects to /login;
 * this shares the user and permissions with the pages below through
 * AuthProvider. It lives in app/router next to its loader because it is
 * route wiring, not a screen.
 */
export const AuthenticatedApp = () => {
  const { user, permissions } = useLoaderData<typeof authenticatedAppLoader>();

  return (
    <AuthProvider user={user} permissions={permissions}>
      <Outlet />
    </AuthProvider>
  );
};
