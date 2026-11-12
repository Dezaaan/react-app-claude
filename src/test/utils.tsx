import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  RouterProvider,
  createMemoryRouter,
  type LoaderFunctionArgs,
} from "react-router-dom";

import { appRoutes } from "@/app/router/appRoutes";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import type { AuthState, Permission } from "@/features/auth/types";
import { mockUser, ROLE_PERMISSIONS } from "@/mocks/data";

/** What the default mock user (role "user") may do. */
export const testPermissions: Permission[] = ROLE_PERMISSIONS.user;

/** Pages are imported (route `lazy`) on first visit, which can take a moment. */
export const LOAD_TIMEOUT = { timeout: 5000 };

/** Loader arguments as React Router would pass them for `path`. */
export const loaderArgs = (
  path = "/",
  init?: RequestInit,
): LoaderFunctionArgs => {
  const url = new URL(path, window.location.origin);

  return {
    request: new Request(url, init),
    url,
    pattern: url.pathname,
    params: {},
    context: undefined,
  };
};

/** Mounts the real app at `path`. Only the network is mocked (MSW). */
export const renderApp = (path: string) => {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
};

/**
 * Renders `ui` inside an AuthProvider and a data router, for components
 * that use useAuth() or router hooks like useSubmit().
 */
export const renderWithAuth = (
  ui: ReactNode,
  session: Partial<AuthState> = {},
) => {
  const { user = mockUser, permissions = testPermissions } = session;

  const router = createMemoryRouter([
    {
      path: "*",
      element: (
        <AuthProvider user={user} permissions={permissions}>
          {ui}
        </AuthProvider>
      ),
    },
  ]);

  render(<RouterProvider router={router} />);
  return router;
};
