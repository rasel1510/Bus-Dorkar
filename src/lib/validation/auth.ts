import { z } from "zod";

// Bangladesh Phone Number Regex: matches +8801XXXXXXXXX or 01XXXXXXXXX
export const bangladeshPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

// Clean phone number to standard +8801XXXXXXXXX format
export function formatBangladeshPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("8801") && digits.length === 13) {
    return `+${digits}`;
  }
  if (digits.startsWith("01") && digits.length === 11) {
    return `+88${digits}`;
  }
  return phone;
}

// Sign Up Schema (Strictly sanitized with max-length DoS protection)
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
    email: z
      .string()
      .trim()
      .max(100, "Email address must not exceed 100 characters")
      .email("Please enter a valid email address")
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(20, "Phone number is too long")
      .refine(
        (val) => bangladeshPhoneRegex.test(val.replace(/\s+/g, "")),
        "Please enter a valid Bangladesh mobile number (e.g. 01712345678 or +8801712345678)"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must not exceed 72 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .max(72, "Confirm password must not exceed 72 characters"),
    role: z.enum(["PASSENGER", "BUS_OPERATOR", "COUNTER_STAFF", "DRIVER", "ADMIN"]).default("PASSENGER"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

// Login Schema (Strictly sanitized with max-length DoS protection)
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number or email address")
    .max(100, "Identifier must not exceed 100 characters"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .max(72, "Password must not exceed 72 characters"),
  role: z.enum(["PASSENGER", "BUS_OPERATOR", "COUNTER_STAFF", "DRIVER", "ADMIN"]).default("PASSENGER"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
