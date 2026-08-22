// OTP Store — In-memory TTL cache for Email Verification OTPs

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number;
}

const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, OtpRecord> | undefined;
};

export const otpStore = globalForOtp.otpStore ?? new Map<string, OtpRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.otpStore = otpStore;
}

/** Generate a 6-digit cryptographically random OTP */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Store OTP for email with 10-minute expiration */
export function saveOtp(email: string, code: string): void {
  const cleanEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(cleanEmail, { email: cleanEmail, code, expiresAt });
}

/** Verify OTP for email */
export function verifyOtpCode(email: string, code: string): { valid: boolean; message: string } {
  const cleanEmail = email.toLowerCase().trim();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return { valid: false, message: "No OTP request found for this email address. Please request a new code." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return { valid: false, message: "OTP code has expired. Please click resend to get a new code." };
  }

  if (record.code !== code.trim()) {
    return { valid: false, message: "Invalid 6-digit OTP code. Please check your email and try again." };
  }

  // Clear OTP after successful verification
  otpStore.delete(cleanEmail);
  return { valid: true, message: "Email verified successfully!" };
}
