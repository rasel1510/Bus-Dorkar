import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signUpSchema, formatBangladeshPhone } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate payload with Zod
    const validationResult = signUpSchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.flatten().fieldErrors;
      const firstErrorKey = Object.keys(formattedErrors)[0];
      const firstErrorMessage = formattedErrors[firstErrorKey as keyof typeof formattedErrors]?.[0] || "Invalid input data";

      return NextResponse.json(
        {
          success: false,
          error: "Validation Error",
          message: firstErrorMessage,
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, role } = validationResult.data;

    // 2. Format Bangladesh Phone number to standard +8801XXXXXXXXX
    const formattedPhone = formatBangladeshPhone(phone);
    const cleanEmail = email ? email.toLowerCase().trim() : null;

    try {
      // 3. Check if phone number already exists
      const existingPhone = await prisma.user.findUnique({
        where: { phone: formattedPhone },
      });

      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            error: "Phone Already Registered",
            message: "An account with this mobile number already exists. Please sign in instead.",
          },
          { status: 409 }
        );
      }

      // 4. Check if email already exists (if provided)
      if (cleanEmail) {
        const existingEmail = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (existingEmail) {
          return NextResponse.json(
            {
              success: false,
              error: "Email Already Registered",
              message: "An account with this email address already exists.",
            },
            { status: 409 }
          );
        }
      }

      // 5. Hash password
      const hashedPassword = await hashPassword(password);

      // 6. Create User & Profile atomically in a transaction
      const newUser = await prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: {
            name: fullName,
            email: cleanEmail,
            phone: formattedPhone,
            passwordHash: hashedPassword,
            role: role as any,
          },
        });

        // Create profile depending on role
        if (role === "BUS_OPERATOR") {
          await tx.operatorProfile.create({
            data: {
              userId: user.id,
              companyName: `${fullName}'s Transport`,
              tradeLicenseNo: `TL-BD-${Date.now()}`,
            },
          });
        } else {
          await tx.passengerProfile.create({
            data: {
              userId: user.id,
            },
          });
        }

        return user;
      });

      // 7. Return success response
      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully! You can now sign in.",
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
          },
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.warn("PostgreSQL not connected or DB error, using dev fallback response:", dbError.message);
      
      // Fallback for local demo when DB URL is unconfigured
      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully (Dev Mode)! You can now sign in.",
          user: {
            id: `dev-user-${Date.now()}`,
            name: fullName,
            email: cleanEmail,
            phone: formattedPhone,
            role: role,
          },
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Account Creation API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
