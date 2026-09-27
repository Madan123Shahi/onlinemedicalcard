import jwt from "jsonwebtoken";

// Access token: short-lived, sent on every request, kept in memory/cookie.
export const generateAccessToken = (userId) => {
  // 💡 Modern fix: Cast userId to string to ensure jsonwebtoken handles the payload perfectly
  return jwt.sign({ id: userId.toString() }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m", // Fallback to 15 minutes if env is blank
  });
};

// Refresh token: long-lived, used only to mint a new access token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId.toString() }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d", // Fallback to 7 days if env is blank
  });
};

// Shared cookie options for both tokens.
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
