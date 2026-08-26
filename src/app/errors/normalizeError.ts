import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";

export const normalizeError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError) {
    return new AppError(
      error.message,
      ERROR_CODES.NETWORK_ERROR,
      undefined,
      "Unable to connect to the server.",
      {
        cause: error,
      },
    );
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ERROR_CODES.UNKNOWN_ERROR,
      undefined,
      "Something unexpected happened.",
      {
        cause: error,
      },
    );
  }

  return new AppError(
    "Unknown error",
    ERROR_CODES.UNKNOWN_ERROR,
    undefined,
    "Something unexpected happened.",
  );
};
