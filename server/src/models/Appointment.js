import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    timeSlot: { type: String, required: true }, // HH:mm
    reason: { type: String, trim: true, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One booking per slot (cancelled bookings free the slot via partial index)
appointmentSchema.index(
  { date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);

export default mongoose.model("Appointment", appointmentSchema);
