import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email is too long")
    .optional()
    .or(z.literal("")),
  emergencyContact: z
    .string()
    .trim()
    .max(20, "Emergency contact is too long")
    .optional()
    .or(z.literal("")),
  gender: z
    .enum(["male", "female", "other", ""])
    .optional(),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(300, "Address is too long")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
