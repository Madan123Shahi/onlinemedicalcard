import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(100),
  phone: z.string().trim().max(20).optional(),
});

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

router.post("/register", validate(registerSchema), async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  // Role is never taken from the request body: public signups are always patients.
  const user = await User.create({ ...req.body, role: "patient" });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.matchPassword(req.body.password))) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
