// A single, predictable error shape for the whole API.
// Instead of throwing plain Error objects (which always default to 500),
// controllers throw `new ApiError(400, "Email already in use")` and the
// central error handler (middleware/errorHandler.js) turns it into JSON.
class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // e.g. field-level validation errors from Zod
    this.success = false;
    // Modern fix: Avoids 'instanceof' breaking unexpectedly
    // instanceof used in errorHandler.js file
    this.isApiError = true;
    // Captures the stack trace cleanly
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
