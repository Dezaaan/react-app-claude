import { describe, expect, it } from "vitest";

import { AppError } from "@/app/errors/AppError";
import { ERROR_CODES } from "@/app/errors/errorCodes";
import { mockUser } from "@/mocks/data";
import { scenarios } from "@/mocks/handlers";
import { server } from "@/mocks/server";
import { authApi } from "./authApi";

describe("authApi.getCurrentUser", () => {
  it("returns the logged-in user", async () => {
    await expect(authApi.getCurrentUser()).resolves.toEqual(mockUser);
  });

  it("returns null when the server answers 401", async () => {
    server.use(...scenarios["logged-out"]);

    await expect(authApi.getCurrentUser()).resolves.toBeNull();
  });

  it("rethrows other errors", async () => {
    server.use(...scenarios.offline);

    const error = await authApi.getCurrentUser().catch((error) => error);

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
  });
});
