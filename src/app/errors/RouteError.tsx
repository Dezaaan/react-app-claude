import { useRouteError } from "react-router-dom";

import { normalizeError } from "@/shared/errors/normalizeError";
import { DEFAULT_USER_MESSAGES } from "@/shared/errors/errorCodes";

export const RouteError = () => {
  const error = normalizeError(useRouteError());

  return (
    <div role="alert">
      <p>{error.userMessage ?? DEFAULT_USER_MESSAGES[error.code]}</p>
    </div>
  );
};
