import { useRouteError } from "react-router-dom";

import { normalizeError } from "./normalizeError";
import { DEFAULT_USER_MESSAGES } from "./errorCodes";

export const RouteError = () => {
  const error = normalizeError(useRouteError());

  return (
    <div role="alert">
      <p>{error.userMessage ?? DEFAULT_USER_MESSAGES[error.code]}</p>
    </div>
  );
};
