import { redirect, type ActionFunctionArgs } from "react-router-dom";

import { ROUTES } from "@/app/router/routes";
import { authApi } from "../api/authApi";
import { clearSession } from "../session";

/**
 * POST /logout. An action (not a link) because logging out changes state,
 * and React Router re-runs loaders after an action.
 */
export const logoutAction = async ({ request }: ActionFunctionArgs) => {
  try {
    await authApi.logout({ signal: request.signal });
  } finally {
    // Clear the cached session even if the request failed, so the next
    // navigation asks the server again instead of trusting stale data.
    clearSession();
  }

  return redirect(ROUTES.LOGIN);
};
