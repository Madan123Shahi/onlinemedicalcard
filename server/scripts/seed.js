import mongoose from "mongoose";
import User from "../src/models/User.js";
import Service from "../src/models/Service.js";

const services = [
  {
    slug: "new-card-evaluation",
    title: "New Medical Card Evaluation",
    summary:
      "A video consultation with a licensed physician to assess eligibility and issue your card if approved.",
    details:
      "Bring a valid photo ID and any previous medical records. The doctor reviews your history, discusses your needs and tells you the outcome before the call ends.",
    priceInr: 1999,
    durationMin: 30,
  },
  {
    slug: "card-renewal",
    title: "Card Renewal",
    summary:
      "Quick renewal visit for returning patients whose card is expiring soon.",
    details:
      "A shorter follow-up consultation to confirm your condition and update your card validity.",
    priceInr: 1499,
    durationMin: 20,
  },
  {
    slug: "records-review",
    title: "Medical Records Review",
    summary:
      "Have a doctor go through your existing records before you book a full evaluation.",
    details:
      "Upload your documents and get written feedback on what is still needed.",
    priceInr: 799,
    durationMin: 15,
  },
];

await mongoose.connect(process.env.MONGODB_URI);

for (const s of services) {
  await Service.updateOne({ slug: s.slug }, { $set: s }, { upsert: true });
}
console.log(`Seeded ${services.length} services`);

const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (email && password) {
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: "Admin", email, password, role: "admin" });
    console.log(`Created admin user ${email}`);
  } else {
    console.log(`Admin ${email} already exists, left unchanged`);
  }
} else {
  console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set, skipping admin creation");
}

await mongoose.disconnect();
