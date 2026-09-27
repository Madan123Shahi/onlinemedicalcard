import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.model.js"; // 💡 Fixed to match your actual filename convention

// Protects routes: reads the access token from the httpOnly cookie or Authorization header
export const verifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Not authenticated");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Access token expired or invalid");
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "User no longer exists");

  // Attach the active user record to the request lifecycle for downstream use
  req.user = user;
  next();
};

// Role-based guard, used like: router.get("/admin", verifyJWT, authorize("admin"), ...)
export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    // If verifyJWT hasn't run yet, or user doesn't have the explicit role permissions
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }
    next();
  };
