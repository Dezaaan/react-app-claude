import { describe, expect, it } from "vitest";

import { AppError } from "@/shared/errors/AppError";
import { ERROR_CODES } from "@/shared/errors/errorCodes";
import { shouldRetry } from "@/shared/query/queryClient";

const httpError = (status?: number) =>
  new AppError("failed", ERROR_CODES.NETWORK_ERROR, status);

describe("shouldRetry", () => {
  it("retries once when the server failed or couldn't be reached", () => {
    expect(shouldRetry(0, httpError(500))).toBe(true);
    expect(shouldRetry(0, httpError(503))).toBe(true);
    expect(shouldRetry(0, httpError(undefined))).toBe(true);

    expect(shouldRetry(1, httpError(500))).toBe(false);
  });

  it("doesn't retry a 4xx", () => {
    for (const status of [400, 401, 403, 404, 429]) {
      expect(shouldRetry(0, httpError(status))).toBe(false);
    }
  });

  it("doesn't retry errors that aren't from the API", () => {
    expect(shouldRetry(0, new TypeError("bug"))).toBe(false);
  });
});
