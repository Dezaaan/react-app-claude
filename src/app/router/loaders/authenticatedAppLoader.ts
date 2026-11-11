import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { ROUTES } from "@/app/router/routes";

export const authenticatedAppLoader = async ({
  request,
}: LoaderFunctionArgs) => {
  const { signal } = request;
  const user = await authApi.getCurrentUser({ signal });

  if (!user) {
    throw redirect(ROUTES.LOGIN);
  }

  const permissions = await authApi.getPermissions({ signal });

  return {
    user,
    permissions,
  };
};
