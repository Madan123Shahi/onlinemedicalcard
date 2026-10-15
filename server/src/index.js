import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.js";
import serviceRoutes from "./routes/services.js";
import appointmentRoutes from "./routes/appointments.js";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error(
    "JWT_SECRET must be set to a long random string (see .env.example)",
  );
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "50kb" }));

// Brute-force protection on login / register / contact
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);
app.use("/api/contact", authLimiter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI)
  .then(() =>
    app.listen(port, () =>
      console.log(`API listening on http://localhost:${port}`),
    ),
  )
  .catch((err) => {
    console.error("Failed to start:", err.message);
    process.exit(1);
  });
