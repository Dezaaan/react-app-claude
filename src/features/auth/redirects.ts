import { ROUTES } from "@/app/router/routes";

export const REDIRECT_PARAM = "redirectTo";

/** Login URL that brings the user back to `returnTo` afterwards. */
export const loginUrl = (returnTo?: string) => {
  if (!returnTo || returnTo === ROUTES.HOME) {
    return ROUTES.LOGIN;
  }
  const params = new URLSearchParams({ [REDIRECT_PARAM]: returnTo });
  return `${ROUTES.LOGIN}?${params}`;
};

/**
 * Only allow redirects to paths inside this app. Without this, a link like
 * /login?redirectTo=https://evil.example would send users to another site
 * right after they log in (an "open redirect").
 */
export const safeRedirect = (
  target: FormDataEntryValue | string | null | undefined,
  fallback: string = ROUTES.HOME,
) => {
  if (typeof target !== "string") {
    return fallback;
  }

  // Must be a single leading slash: "//evil.example" and "/\evil.example"
  // are treated by browsers as links to another host.
  if (
    !target.startsWith("/") ||
    target.startsWith("//") ||
    target.startsWith("/\\")
  ) {
    return fallback;
  }

  // Never bounce back to the login page itself.
  if (target === ROUTES.LOGIN || target.startsWith(`${ROUTES.LOGIN}?`)) {
    return fallback;
  }

  return target;
};
