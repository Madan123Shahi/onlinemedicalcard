import { Router } from "express";
import { z } from "zod";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Clinic hours: 10:00 - 17:30, every 30 minutes
export const SLOTS = Array.from({ length: 16 }, (_, i) => {
  const mins = 10 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

const bookSchema = z.object({
  serviceId: z.string().length(24),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().trim().max(1000).optional().default(""),
});

// Public: which slots are still free on a given day
router.get("/availability", async (req, res) => {
  const date = String(req.query.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "date must be YYYY-MM-DD" });
  }
  const taken = await Appointment.find({ date, status: { $ne: "cancelled" } }).distinct("timeSlot");
  res.json({ date, slots: SLOTS.filter((s) => !taken.includes(s)) });
});

router.use(requireAuth);

router.get("/mine", async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate("service", "title priceInr durationMin")
    .sort({ date: -1, timeSlot: -1 });
  res.json({ appointments });
});

router.post("/", validate(bookSchema), async (req, res) => {
  const { serviceId, date, timeSlot, reason } = req.body;

  if (!SLOTS.includes(timeSlot)) return res.status(400).json({ message: "Invalid time slot" });

  const slotStart = new Date(`${date}T${timeSlot}:00`);
  if (Number.isNaN(slotStart.getTime()) || slotStart < new Date()) {
    return res.status(400).json({ message: "Pick a date and time in the future" });
  }

  const service = await Service.findOne({ _id: serviceId, active: true });
  if (!service) return res.status(404).json({ message: "Service not found" });

  // The unique partial index is the real guard against double-booking;
  // a duplicate-key error is turned into a 409 by the error handler.
  const appointment = await Appointment.create({
    patient: req.user._id,
    service: service._id,
    date,
    timeSlot,
    reason,
  });
  res.status(201).json({ appointment });
});

router.patch("/:id/cancel", async (req, res) => {
  const appt = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  if (["completed", "cancelled"].includes(appt.status)) {
    return res.status(400).json({ message: `Appointment is already ${appt.status}` });
  }
  appt.status = "cancelled";
  await appt.save();
  res.json({ appointment: appt });
});

export default router;
