/**
 * Custom Application Error Class
 *
 * Benefits:
 * - Consistent error format across app
 * - Easy to catch and handle specific errors
 * - Includes HTTP status codes
 * - Stack traces for debugging
 *
 * Usage:
 *   throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Để phân biệt với system errors

    Error.captureStackTrace(this, this.constructor);
  }
}

// Convenience methods cho common errors
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}
