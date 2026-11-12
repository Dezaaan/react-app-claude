import { redirect, type ActionFunctionArgs } from "react-router-dom";

import { ROUTES } from "@/app/router/routes";
import { authApi } from "@/features/auth/api/authApi";
import { endSession } from "@/features/auth/session";

/**
 * POST /logout. An action (not a link) because logging out changes state,
 * and React Router re-runs loaders after an action.
 */
export const logoutAction = async ({ request }: ActionFunctionArgs) => {
  try {
    await authApi.logout({ signal: request.signal });
  } finally {
    // Forget the session and its access token even if the request failed,
    // so nothing keeps using them. The login page then needs no refresh.
    endSession();
  }

  return redirect(ROUTES.LOGIN);
};
