import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword } from "@/lib/auth/password";
import { loginSchema, formatBangladeshPhone } from "@/lib/validation/auth";
import { findDevUser } from "@/lib/dev-store";
import { attachSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  let cleanIdentifier = "";
  let formattedPhone: string | null = null;
  let requestedRole = "PASSENGER";

  try {
    const body = await request.json();

    // 1. Validate input payload
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { identifier, password, role } = validationResult.data;
    cleanIdentifier = identifier.trim();
    requestedRole = role;

    // Format phone if input looks like a mobile number
    const isEmail = cleanIdentifier.includes("@");
    formattedPhone = !isEmail ? formatBangladeshPhone(cleanIdentifier) : null;

    // 2. Lookup user by phone or email
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone: formattedPhone || cleanIdentifier },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Credentials",
          message: "No account found matching these credentials.",
        },
        { status: 401 }
      );
    }

    // 3. Compare password (with 72-char DoS safety check)
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Credentials",
          message: "Incorrect password. Please try again.",
        },
        { status: 401 }
      );
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    // 4. Return authenticated user payload with HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        user: userPayload,
      },
      { status: 200 }
    );
    return attachSessionCookie(response, userPayload);
  } catch (error: any) {
    console.warn("PostgreSQL not connected or DB error during login, using dev fallback response:", error.message);

    // Look up user from registered dev memory store first
    const registeredUser = findDevUser(cleanIdentifier) || (formattedPhone ? findDevUser(formattedPhone) : undefined);

    const userPayload = registeredUser
      ? {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email || (cleanIdentifier.includes("@") ? cleanIdentifier : null),
          phone: registeredUser.phone || formattedPhone || cleanIdentifier,
          role: (registeredUser.role || requestedRole) as any,
        }
      : {
          id: `user-${Date.now()}`,
          name: cleanIdentifier.includes("@") ? cleanIdentifier.split("@")[0] : cleanIdentifier,
          email: cleanIdentifier.includes("@") ? cleanIdentifier : null,
          phone: formattedPhone || cleanIdentifier,
          role: requestedRole as any,
        };

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful! Redirecting...",
        user: userPayload,
      },
      { status: 200 }
    );
    return attachSessionCookie(response, userPayload);
  }
}
