import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "❌ Error: MONGO_URI is not defined in the environment variables.",
  );
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully.");
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Retry connection after 5 seconds instead of crashing
    setTimeout(connectDB, 5000);
  }
};

// Handle unexpected drops after initial connection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error(`⚠️ MongoDB driver error: ${err.message}`);
});

// Helper function for graceful shutdown
export const closeDB = async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
};
