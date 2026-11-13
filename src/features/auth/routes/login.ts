import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";

import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { normalizeError } from "@/shared/errors/normalizeError";
import { authApi } from "@/features/auth/api/authApi";
import { REDIRECT_PARAM, safeRedirect } from "@/features/auth/redirects";
import { getSession, startSession } from "@/features/auth/session";

export type LoginActionData = { error: string };

/** Already logged in? Skip the form and go where the user was heading. */
export const loginLoader = async ({ request }: LoaderFunctionArgs) => {
  const redirectTo = new URL(request.url).searchParams.get(REDIRECT_PARAM);

  try {
    if (await getSession()) {
      return redirect(safeRedirect(redirectTo));
    }
  } catch {
    // Can't tell (e.g. offline). Show the form; submitting will say why.
  }

  return null;
};

export const loginAction = async ({
  request,
}: ActionFunctionArgs): Promise<LoginActionData | Response> => {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    startSession(
      await authApi.login({ email, password }, { signal: request.signal }),
    );
  } catch (error) {
    const appError = normalizeError(error);

    // On the login form a 401 means wrong credentials, not "please log in".
    if (appError.code === ERROR_CODES.UNAUTHORIZED) {
      return { error: "Invalid email or password." };
    }

    return {
      error: appError.userMessage ?? "Login failed. Please try again.",
    };
  }

  return redirect(safeRedirect(formData.get(REDIRECT_PARAM)));
};
