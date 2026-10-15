import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    details: { type: String, default: "" },
    priceInr: { type: Number, required: true, min: 0 },
    durationMin: { type: Number, default: 20 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
