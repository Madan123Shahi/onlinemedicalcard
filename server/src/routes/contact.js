import { Router } from "express";
import { z } from "zod";
import Contact from "../models/Contact.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  message: z.string().trim().min(10).max(2000),
});

router.post("/", validate(schema), async (req, res) => {
  await Contact.create(req.body);
  res.status(201).json({ message: "Thanks, we'll get back to you soon." });
});

export default router;
