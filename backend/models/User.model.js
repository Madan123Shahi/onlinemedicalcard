import mongoose from "mongoose";
import argon2 from "argon2"; // 👈 Updated to use argon2

// Phase 1 keeps the user model focused on auth + role.
// Later phases (patient profile, doctor profile, medical card) will
// extend this with more fields or reference it from separate collections.
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid email address structure!`,
      },
      index: true, // 👈 Speeds up read operations for login significantly
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // never returned by default in queries
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

// Hash the password only when it's new or changed — re-hashing on
// save (e.g. when a user just updates their name) would break the hash.

// ✅ CORRECT: Express 5 + Mongoose 9 syntax. No next argument, no next() calls!
userSchema.pre("save", async function () {
  // 1. If the password hasn't been modified, exit early by simply returning
  if (!this.isModified("password")) return;
  try {
    // 2. Hash your password securely using your Argon2 settings
    this.password = await argon2.hash(this.password, {
      memoryCost: 16384, // 16 MB RAM
      timeCost: 2, // 2 iterations
      parallelism: 1, // 1 thread
    });
  } catch (error) {
    // 3. In Mongoose 9, throwing an error automatically rejects the promise hook chain,
    // halting the operation and passing the error up to your controller.
    throw new Error(`Password encryption failed: ${error.message}`);
  }
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     // 💡 Argon2 optimization: Configured to use 16MB of RAM to prevent server
//     // crashes on constrained environments while remaining highly secure.
//     this.password = await argon2.hash(this.password, {
//       memoryCost: 16384, // 16 MB RAM (safe for 512MB-1GB hobby tiers)
//       timeCost: 2, // 2 iterations
//       parallelism: 1, // 1 thread
//     });
//     next();
//   } catch (error) {
//     next(error); // Passes hashing failures down to Express 5 error handler
//   }
// });

// Instance method: compares a plaintext password against the stored hash.
userSchema.methods.comparePassword = async function (candidatePassword) {
  // ⚠️ CRITICAL CHANGE FOR ARGON2:
  // Syntax is argon2.verify(storedHash, plainTextPassword)
  // This is the opposite order of bcrypt!
  return await argon2.verify(this.password, candidatePassword);
};

const User = mongoose.model("User", userSchema);
export default User;
