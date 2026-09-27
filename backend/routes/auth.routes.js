import { Router } from "express";
import {
  login,
  register,
  logout,
  refreshAccessToken,
  getMe,
} from "../controllers/auth.controller.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh", refreshAccessToken);
router.get("/me", verifyJWT, getMe);

export default router;
