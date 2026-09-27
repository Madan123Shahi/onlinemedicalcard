import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "❌ Error: MONGO_URI is not defined in the environment variables.",
  );
  process.exit(1);
}

// 1. Register global stream listeners ONCE at the file level
mongoose.connection.on("disconnected", () => {
  console.warn(
    "⚠️ MongoDB disconnected. Mongoose will try auto-reconnecting...",
  );
});

mongoose.connection.on("error", (err) => {
  console.error(`⚠️ MongoDB driver error: ${err.message}`);
});

export const connectDB = async () => {
  try {
    // Prevent creating duplicate connection attempts if server hot-reloads
    if (
      mongoose.connection.readyState === 1 ||
      mongoose.connection.readyState === 2
    ) {
      return;
    }

    // 2. Pass standard modern options for resilient connections
    await mongoose.connect(MONGO_URI, {
      autoIndex: true, // Assures unique schemas (like unique email fields) build indexes
      maxPoolSize: 10, // Maintains up to 10 parallel sockets open for performance
      serverSelectionTimeoutMS: 5000, // Time out after 5 seconds instead of hanging forever
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log("✅ Connected to MongoDB successfully.");
  } catch (error) {
    console.error(`❌ MongoDB initial connection error: ${error.message}`);
    // Fallback: Safe retry loop that checks connection state before stacking listeners
    setTimeout(() => {
      console.log("🔄 Retrying database connection...");
      connectDB();
    }, 5000);
  }
};

// Helper function for graceful shutdown
export const closeDB = async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
};
