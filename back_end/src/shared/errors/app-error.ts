export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, code = "APP_ERROR", details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFound(message = "Resource not found"): AppError {
  return new AppError(404, message, "NOT_FOUND");
}

export function unauthorized(message = "Unauthorized"): AppError {
  return new AppError(401, message, "UNAUTHORIZED");
}

export function forbidden(message = "Forbidden"): AppError {
  return new AppError(403, message, "FORBIDDEN");
}

export function badRequest(message = "Bad request", details?: unknown): AppError {
  return new AppError(400, message, "BAD_REQUEST", details);
}
