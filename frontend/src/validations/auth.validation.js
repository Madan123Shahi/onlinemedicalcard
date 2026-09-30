import { z } from "zod";

// ==========================================
// 📝 REGISTRATION VALIDATION SCHEMA
// ==========================================
export const registerSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase() // ⚡ FIXED: Changed from .lowercase() to .toLowerCase()
    .email("Please provide a valid email address structure")
    .max(255, "Email address is too long"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password cannot exceed 72 characters")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>_]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

// ==========================================
// 🔑 LOGIN VALIDATION SCHEMA
// ==========================================
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase() // ⚡ FIXED: Changed from .lowercase() to .toLowerCase()
    .email("Invalid email or password structure"),
  
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .max(72, "Password is too long"),
});
