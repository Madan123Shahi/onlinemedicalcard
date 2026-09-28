import ApiError from "../utils/ApiError.js";

// Central place where every thrown/forwarded error becomes a JSON response.
const errorHandler = (err, req, res, next) => {
  let error = err;

  // console.error("🔍 ERROR DETAILS:", error); //
  // 1. Convert standard errors to our clean ApiError shape
  if (!error.isApiError) {
    // Handle Mongoose Duplicate Key Error (e.g., unique: true on email)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "Field";
      error = new ApiError(409, `${field} is already registered`);
    }

    // Handle Mongoose Validation Failures
    else if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((el) => el.message);
      error = new ApiError(400, "Validation Error", messages);
    }
    // Generic fallback for unhandled native system errors
    else {
      const statusCode = error.statusCode || 500;
      error = new ApiError(
        statusCode,
        error.message || "Internal server error",
      );
    }
  }

  // 2. Send the consistent response format back to the client
  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    // Only leak stack traces when actively debugging locally
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

export default errorHandler;
