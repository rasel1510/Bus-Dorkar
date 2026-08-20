import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, deserializeSession } from "@/lib/auth/session";
import { createBookingSchema } from "@/lib/validation/booking";
import { createBookingService, getUserBookingsService } from "@/lib/services/booking";

/** POST — Create a new booking */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const session = deserializeSession(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation Error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await createBookingService(session.id, validation.data);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Booking confirmed!", booking: result.booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking creation error:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** GET — List current user's bookings */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const session = deserializeSession(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const bookings = await getUserBookingsService(session.id);
    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch bookings error:", error.message);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
