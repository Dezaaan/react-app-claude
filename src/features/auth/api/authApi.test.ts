import { describe, expect, it } from "vitest";

import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { MOCK_PASSWORD, mockUser } from "@/mocks/data";
import { mockSession } from "@/mocks/session";
import { authApi } from "./authApi";

const codeOf = (promise: Promise<unknown>) =>
  promise.then(
    () => "resolved",
    (error: unknown) => (error instanceof AppError ? error.code : error),
  );

describe("authApi", () => {
  it("logs in and returns the user with an access token", async () => {
    mockSession.logOut();

    const response = await authApi.login({
      email: mockUser.email,
      password: MOCK_PASSWORD,
    });

    expect(response.user).toEqual(mockUser);
    expect(response.accessToken).toEqual(expect.any(String));
  });

  it("rejects a wrong password with 401 instead of refreshing", async () => {
    await expect(
      codeOf(authApi.login({ email: mockUser.email, password: "wrong" })),
    ).resolves.toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it("refreshes the session from the cookie", async () => {
    await expect(authApi.refresh()).resolves.toMatchObject({ user: mockUser });
  });

  it("answers 401 on refresh when logged out", async () => {
    mockSession.logOut();

    await expect(codeOf(authApi.refresh())).resolves.toBe(
      ERROR_CODES.UNAUTHORIZED,
    );
  });
});
