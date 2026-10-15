import { Router } from "express";
import { z } from "zod";
import Appointment from "../models/Appointment.js";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import Service from "../models/Service.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/stats", async (_req, res) => {
  const [patients, appointments, pending, messages] = await Promise.all([
    User.countDocuments({ role: "patient" }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "pending" }),
    Contact.countDocuments({ resolved: false }),
  ]);
  res.json({ patients, appointments, pending, messages });
});

router.get("/appointments", async (_req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email phone")
    .populate("service", "title")
    .sort({ date: -1, timeSlot: -1 })
    .limit(200);
  res.json({ appointments });
});

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

router.patch("/appointments/:id", validate(statusSchema), async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  res.json({ appointment: appt });
});

router.get("/messages", async (_req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 }).limit(200);
  res.json({ messages });
});

router.patch("/messages/:id/resolve", async (req, res) => {
  const msg = await Contact.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json({ message: msg });
});

const serviceSchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(5).max(400),
  details: z.string().trim().max(3000).optional().default(""),
  priceInr: z.number().min(0),
  durationMin: z.number().int().min(5).max(120).optional().default(20),
});

router.post("/services", validate(serviceSchema), async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ service });
});

export default router;
