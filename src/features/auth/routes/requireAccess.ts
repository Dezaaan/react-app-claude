import type { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";

import { AppError } from "@/app/errors/AppError";
import { DEFAULT_USER_MESSAGES, ERROR_CODES } from "@/app/errors/errorCodes";
import { canAccess } from "../access";
import { getSession } from "../session";
import type { AccessRequirement } from "../types";

/**
 * Wraps a route's loader so it only runs when the user meets `access`.
 *
 * Checking in the loader (not in the component) means the page's data is
 * never requested for a user who can't see it. On failure it throws a
 * FORBIDDEN AppError, which the route's RouteError shows inside the layout.
 *
 * Not being logged in is handled by the app layout's loader, which redirects
 * to /login, so here a missing session simply means "don't load".
 */
export const withAccess = (
  access: AccessRequirement | undefined,
  loader?: LoaderFunction,
): LoaderFunction | undefined => {
  if (!access) {
    return loader;
  }

  return async (args: LoaderFunctionArgs) => {
    const session = await getSession();

    if (!session) {
      return null;
    }

    if (!canAccess(session.permissions, access)) {
      throw new AppError(
        `Missing permission "${access.permission}" for ${new URL(args.request.url).pathname}`,
        ERROR_CODES.FORBIDDEN,
        403,
        DEFAULT_USER_MESSAGES.FORBIDDEN,
      );
    }

    return loader ? loader(args) : null;
  };
};
