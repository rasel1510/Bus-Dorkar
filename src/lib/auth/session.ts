import { NextResponse } from "next/server";
import { UserSession } from "@/context/auth-context";

export const SESSION_COOKIE_NAME = "busdorkar_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Serializes user session into a lightweight base64/JSON token string.
 * Bandwidth Consumption: <300 bytes ($O(1)$ footprint)
 */
export function serializeSession(user: UserSession): string {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email || null,
    phone: user.phone,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/**
 * Deserializes and parses session token string.
 * Time Complexity: $O(1)$
 */
export function deserializeSession(token: string): UserSession | null {
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);
    if (!payload || !payload.id || !payload.phone) return null;
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Attaches a secure, HttpOnly, SameSite session cookie to a NextResponse.
 * Protects against XSS (HttpOnly) and CSRF (SameSite=Lax).
 */
export function attachSessionCookie(response: NextResponse, user: UserSession): NextResponse {
  const token = serializeSession(user);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

/**
 * Clears the session cookie from NextResponse on logout.
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
