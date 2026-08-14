import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const MAX_PASSWORD_BYTES = 72;

/**
 * Hashes a plain text password securely using bcryptjs.
 * Enforces a strict 72-character limit to prevent CPU Denial-of-Service (DoS) attacks.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || !password) {
    throw new Error("Password string is required");
  }
  if (password.length > MAX_PASSWORD_BYTES) {
    throw new Error("Password exceeds maximum allowed length of 72 characters");
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password against a stored bcrypt hash.
 * Enforces a strict 72-character limit to prevent CPU Denial-of-Service (DoS) attacks.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (typeof password !== "string" || !password || !hash) {
    return false;
  }
  if (password.length > MAX_PASSWORD_BYTES) {
    return false;
  }
  return await bcrypt.compare(password, hash);
}
