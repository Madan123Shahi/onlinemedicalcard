import express from "express";
// // 1. Natively load env variables BEFORE importing local modules that rely on them
// try {
//   process.loadEnvFile();
// } catch (error) {
//   console.warn(
//     "⚠️ Warning: .env file not found. Falling back to system environment variables.",
//   );
// }

// 2. Import the database functions after environment variables are ready
import { connectDB, closeDB } from "./config/db.js";

import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Simple Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    dbStatus:
      mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
  });
});

// Start Server and Connect DB
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await connectDB();
});

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log("Stopping server gracefully...");
  server.close(async () => {
    console.log("HTTP server closed.");
    await closeDB();
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
