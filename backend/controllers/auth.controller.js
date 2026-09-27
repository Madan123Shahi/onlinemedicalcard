import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  generateAccessToken,
  generateRefreshToken,
  cookieOptions,
} from "../utils/generateTokens.js";
import { sendWelcomeEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";

// Deeply configure cookie paths for bulletproof removal on logout
const secureCookieOptions = {
  ...cookieOptions,
  path: "/",
};

// Small helper shared by register/login
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  // Bypasses validation hooks so you don't have to provide the plaintext password again
  await user.save({ validateBeforeSave: false });

  res
    .cookie("accessToken", accessToken, {
      ...secureCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      ...secureCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

  return accessToken;
};

// POST /api/auth/register
export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email is already registered");

  const user = await User.create({ fullName, email, password });
  await issueTokens(user, res);

  // Background task: errors are caught so registration never halts if SMTP logs an error
  sendWelcomeEmail(user.email, user.fullName).catch((err) =>
    console.error("Failed to send welcome email:", err.message),
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      "Account created successfully",
    ),
  );
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Explicitly pull password since schema sets select: false
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  // Utilizes your custom Argon2 verify method
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  await issueTokens(user, res);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      "Logged in successfully",
    ),
  );
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  // Safely strips the refresh token out of the database document
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  res
    .clearCookie("accessToken", secureCookieOptions)
    .clearCookie("refreshToken", secureCookieOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
};

// POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken)
    throw new ApiError(401, "Session expired, please log in again");

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Session expired, please log in again");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== incomingToken) {
    throw new ApiError(401, "Session expired, please log in again");
  }

  const accessToken = generateAccessToken(user._id);

  res.cookie("accessToken", accessToken, {
    ...secureCookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Access token refreshed"));
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    }),
  );
};
