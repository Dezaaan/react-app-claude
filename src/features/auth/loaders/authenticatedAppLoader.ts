// features/auth/loaders/authenticatedAppLoader.ts

import { redirect } from "react-router-dom";
import { authApi } from "../api/authApi";
import { ROUTES } from "@/app/router/routes";

export const authenticatedAppLoader = async () => {
  const user = await authApi.getCurrentUser();

  if (!user) {
    throw redirect(ROUTES.LOGIN);
  }

  const permissions = await authApi.getPermissions();

  return {
    user,
    permissions,
  };
};
