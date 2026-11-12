import {
  redirect,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "react-router-dom";

import { AppError } from "@/shared/errors/AppError";
import { DEFAULT_USER_MESSAGES, ERROR_CODES } from "@/shared/errors/errorCodes";
import { canAccess } from "@/features/auth/access";
import { loginUrl } from "@/features/auth/redirects";
import { clearSession, getSession } from "@/features/auth/session";
import type { AccessRequirement } from "@/features/auth/types";

/**
 * Runs a page loader; if the session ended meanwhile (an API request got
 * 401 even after refreshing the token), go to the login page and come back
 * here afterwards, instead of showing an error.
 */
const redirectWhenLoggedOut =
  (loader: LoaderFunction): LoaderFunction =>
  async (args) => {
    try {
      return await loader(args);
    } catch (error) {
      if (
        error instanceof AppError &&
        error.code === ERROR_CODES.UNAUTHORIZED
      ) {
        clearSession();
        const { pathname, search } = new URL(args.request.url);
        throw redirect(loginUrl(pathname + search));
      }
      throw error;
    }
  };

/**
 * Wraps a route's loader so it runs only once the session is ready (so API
 * calls carry the access token) and only when the user meets `access`.
 *
 * Checking in the loader (not in the component) means the page's data is
 * never requested for a user who can't see it. On failure it throws a
 * FORBIDDEN AppError, which the route's RouteError shows inside the layout.
 *
 * Not being logged in is handled by the app layout's loader, which redirects
 * to /login, so here a missing session simply means "don't load". A session
 * that ends while the page loads also redirects to /login.
 */
export const withAccess = (
  access: AccessRequirement | undefined,
  loader?: LoaderFunction,
): LoaderFunction | undefined => {
  if (!access && !loader) {
    return undefined;
  }

  const pageLoader = loader && redirectWhenLoggedOut(loader);

  return async (args: LoaderFunctionArgs) => {
    // Shared with the layout's loader: no extra request.
    const session = await getSession();

    if (!session) {
      return null;
    }

    if (access && !canAccess(session.permissions, access)) {
      throw new AppError(
        `Missing permission "${access.permission}" for ${new URL(args.request.url).pathname}`,
        ERROR_CODES.FORBIDDEN,
        403,
        DEFAULT_USER_MESSAGES.FORBIDDEN,
      );
    }

    return pageLoader ? pageLoader(args) : null;
  };
};
