import { useRouteError } from "react-router-dom";

import { normalizeError } from "../errors/normalizeError";
import { ERROR_CODES } from "../errors/errorCodes";

export const RouteError = () => {
  const routeError = useRouteError();
  const error = normalizeError(routeError);

  switch (error.code) {
    case ERROR_CODES.UNAUTHORIZED:
      return <p>You need to log in.</p>;

    case ERROR_CODES.FORBIDDEN:
      return <p>You don't have permission to access this page.</p>;

    case ERROR_CODES.NOT_FOUND:
      return <p>Page not found.</p>;

    case ERROR_CODES.VALIDATION_ERROR:
      return <p>{error.userMessage}</p>;

    case ERROR_CODES.NETWORK_ERROR:
      return <p>{error.userMessage}</p>;

    case ERROR_CODES.SERVER_ERROR:
      return <p>{error.userMessage}</p>;

    default:
      return <p>{error.userMessage}</p>;
  }
};
