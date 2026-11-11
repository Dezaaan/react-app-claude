import type { ErrorCode } from "./errorCodes";

export type AppErrorOptions = ErrorOptions & {
  /** Extra data from the server, e.g. field-level validation errors. */
  details?: unknown;
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status?: number;
  public readonly userMessage?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode,
    status?: number,
    userMessage?: string,
    options?: AppErrorOptions,
  ) {
    super(message, options);

    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.userMessage = userMessage;
    this.details = options?.details;
  }
}
