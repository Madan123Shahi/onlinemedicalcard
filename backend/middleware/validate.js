import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // 💡 Zod v4 Fix: Access the active errors using result.error.issues
    // The fallback array `|| []` guarantees your app never throws an undefined crash.
    const errors = (result.error.issues || []).map((e) => ({
      // Handle instances where the field path might be blank or empty
      field: e.path.length > 0 ? e.path.join(".") : "request_body",
      message: e.message,
    }));

    return next(new ApiError(400, "Validation failed", errors));
  }

  // Zod v4 sanitizes the data: drops unauthorized field parameters snuck into req.body
  req.body = result.data;
  next();
};

export default validate;
