import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword } from "@/lib/auth/password";
import { loginSchema, formatBangladeshPhone } from "@/lib/validation/auth";

export async function POST(request: Request) {
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
    const cleanIdentifier = identifier.trim();

    // Format phone if input looks like a mobile number
    const isEmail = cleanIdentifier.includes("@");
    const formattedPhone = !isEmail ? formatBangladeshPhone(cleanIdentifier) : null;

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

    // 3. Compare password
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

    // 4. Return authenticated user payload
    return NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to sign in. Please try again.",
      },
      { status: 500 }
    );
  }
}
