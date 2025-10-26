// web/src/app/lib/validation.ts
import { z } from "zod";

export const SignupSchema = z.object({
  studentId: z.string().regex(/^\d{9}$/, "Student ID must be 9 digits"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const LoginSchema = z.object({
  studentId: z.string().regex(/^\d{9}$/),
  password: z.string().min(1),
});