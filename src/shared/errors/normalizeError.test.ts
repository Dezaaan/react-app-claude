import { describe, expect, it } from "vitest";

import { AppError } from "./AppError";
import { ERROR_CODES, errorCodeFromStatus } from "./errorCodes";
import { normalizeError } from "./normalizeError";

// Same shape React Router uses for responses thrown from loaders.
const routeErrorResponse = (status: number, statusText = "") => ({
  status,
  statusText,
  internal: false,
  data: null,
});

describe("normalizeError", () => {
  it("returns AppErrors unchanged", () => {
    const error = new AppError("boom", ERROR_CODES.FORBIDDEN, 403);

    expect(normalizeError(error)).toBe(error);
  });

  it.each([
    "Failed to fetch",
    "NetworkError when attempting to fetch resource.",
    "Load failed",
  ])("treats fetch TypeError %j as a network error", (message) => {
    const cause = new TypeError(message);
    const error = normalizeError(cause);

    expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
    expect(error.userMessage).toBe("Unable to connect to the server.");
    expect(error.cause).toBe(cause);
  });

  it("does not treat programming TypeErrors as network errors", () => {
    const error = normalizeError(
      new TypeError("Cannot read properties of undefined (reading 'id')"),
    );

    expect(error.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
  });

  it.each([
    [401, ERROR_CODES.UNAUTHORIZED],
    [403, ERROR_CODES.FORBIDDEN],
    [404, ERROR_CODES.NOT_FOUND],
    [500, ERROR_CODES.SERVER_ERROR],
  ])("maps a %i route error response to %s", (status, code) => {
    const error = normalizeError(routeErrorResponse(status, "Status text"));

    expect(error.code).toBe(code);
    expect(error.status).toBe(status);
    expect(error.message).toBe("Status text");
  });

  it("wraps other Errors as unknown errors", () => {
    const error = normalizeError(new Error("boom"));

    expect(error.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
    expect(error.message).toBe("boom");
    expect(error.userMessage).toBe("Something unexpected happened.");
  });

  it("handles non-Error values and keeps them as the cause", () => {
    const error = normalizeError("nope");

    expect(error.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
    expect(error.cause).toBe("nope");
  });
});

describe("errorCodeFromStatus", () => {
  it.each([
    [400, ERROR_CODES.VALIDATION_ERROR],
    [401, ERROR_CODES.UNAUTHORIZED],
    [403, ERROR_CODES.FORBIDDEN],
    [404, ERROR_CODES.NOT_FOUND],
    [422, ERROR_CODES.VALIDATION_ERROR],
    [418, ERROR_CODES.UNKNOWN_ERROR],
    [500, ERROR_CODES.SERVER_ERROR],
    [502, ERROR_CODES.NETWORK_ERROR],
    [503, ERROR_CODES.NETWORK_ERROR],
    [504, ERROR_CODES.NETWORK_ERROR],
  ])("maps %i to %s", (status, code) => {
    expect(errorCodeFromStatus(status)).toBe(code);
  });
});
