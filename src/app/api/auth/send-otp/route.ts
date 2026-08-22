import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtp, saveOtp } from "@/lib/otp-store";
import { formatBangladeshPhone } from "@/lib/validation/auth";
import { findDevUser } from "@/lib/dev-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required for OTP verification." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing email in DB / DevStore
    try {
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            error: "Email Already Registered",
            message: "An account with this email address already exists. Please sign in instead.",
          },
          { status: 409 }
        );
      }
    } catch {
      const devUser = findDevUser(cleanEmail);
      if (devUser) {
        return NextResponse.json(
          {
            success: false,
            error: "Email Already Registered",
            message: "An account with this email address already exists. Please sign in instead.",
          },
          { status: 409 }
        );
      }
    }

    // Check existing phone if provided
    if (phone) {
      const formattedPhone = formatBangladeshPhone(phone);
      try {
        const existingPhone = await prisma.user.findUnique({
          where: { phone: formattedPhone },
        });
        if (existingPhone) {
          return NextResponse.json(
            {
              success: false,
              error: "Phone Already Registered",
              message: "An account with this mobile number already exists.",
            },
            { status: 409 }
          );
        }
      } catch {
        const devUser = findDevUser(formattedPhone);
        if (devUser) {
          return NextResponse.json(
            {
              success: false,
              error: "Phone Already Registered",
              message: "An account with this mobile number already exists.",
            },
            { status: 409 }
          );
        }
      }
    }

    // Generate and save 6-digit OTP
    const otpCode = generateOtp();
    saveOtp(cleanEmail, otpCode);

    console.log(`[EMAIL OTP DISPATCH] Verification OTP for ${cleanEmail}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification OTP has been sent to ${cleanEmail}`,
      email: cleanEmail,
      demoOtp: otpCode, // Provided for instant demo testing
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send OTP code." },
      { status: 500 }
    );
  }
}
