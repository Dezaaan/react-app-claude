import type { LoaderFunctionArgs } from "react-router-dom";

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
