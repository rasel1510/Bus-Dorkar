import bcrypt from "bcryptjs";
import crypto from "crypto";

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
 * Compares a plain text password against a stored bcrypt or SHA-256 hash.
 * Enforces a strict 72-character limit to prevent CPU Denial-of-Service (DoS) attacks.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (typeof password !== "string" || !password || !hash) {
    return false;
  }
  if (password.length > MAX_PASSWORD_BYTES) {
    return false;
  }

  // 1. Standard Bcrypt Hash comparison
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  // 2. Fallback check for SHA-256 seed hashes
  const sha256Hash = crypto.createHash("sha256").update(password).digest("hex");
  if (sha256Hash === hash || password === hash) {
    return true;
  }

  return false;
}
