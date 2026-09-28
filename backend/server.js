import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"; // 👈 Added for secure cookie parsing
import helmet from "helmet"; // 👈 Highly recommended to secure your HTTP headers
import cors from "cors"; // 👈 Added for cross-origin requests (frontend-backend communication)
// 1. Core Database & Error Handler Imports
import { connectDB, closeDB } from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

// 2. Authentication Router Import
import authRouter from "./routes/auth.routes.js"; // 👈 Added to connect your auth gates

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Core Global Middlewares
app.use(helmet()); // Basic security headers protection
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allows your React Vite dev server to connect
    credentials: true, // 🔒 CRITICAL: Allows Axios to pass httpOnly cookies back and forth
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json()); // Parses incoming JSON payloads
app.use(cookieParser(process.env.COOKIE_SECRET)); // 👈 Parses incoming signed httpOnly cookies

// 4. Simple Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    dbStatus:
      mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
  });
});

// 5. Mount API Routes
app.use("/api/auth", authRouter); // 🚀 Mounts endpoints to http://localhost:5000/api/auth/...

// 6. CRITICAL: Centralized Error Handler (Must be registered LAST!)
app.use(errorHandler);

// Start Server and Connect DB
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await connectDB();
});

// Graceful Shutdown (Prevents open hanging streams on server reboots)
const gracefulShutdown = () => {
  console.log("\nStopping server gracefully...");
  server.close(async () => {
    console.log("HTTP server closed.");
    await closeDB();
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
