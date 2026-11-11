import { redirect, type LoaderFunctionArgs } from "react-router-dom";

import { loginUrl } from "@/features/auth/redirects";
import { getSession } from "@/features/auth/session";

export const authenticatedAppLoader = async ({
  request,
}: LoaderFunctionArgs) => {
  const session = await getSession();

  if (!session) {
    const { pathname, search } = new URL(request.url);
    throw redirect(loginUrl(pathname + search));
  }

  return session;
};
