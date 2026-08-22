import { NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and 6-digit OTP are required." },
        { status: 400 }
      );
    }

    const verificationResult = verifyOtpCode(email, otp);

    if (!verificationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Verification Code",
          message: verificationResult.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! Complete registration.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP code." },
      { status: 500 }
    );
  }
}
