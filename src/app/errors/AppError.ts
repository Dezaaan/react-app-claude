import type { ErrorCode } from "./errorCodes";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status?: number;
  public readonly userMessage?: string;

  constructor(
    message: string,
    code: ErrorCode,
    status?: number,
    userMessage?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);

    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.userMessage = userMessage;
  }
}
