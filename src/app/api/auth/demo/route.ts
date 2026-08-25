import { NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth/session";
import { saveDevUser } from "@/lib/dev-store";
import { seedDemoBookings } from "@/lib/dev-booking-store";
import { UserSession } from "@/context/auth-context";

export async function POST() {
  const demoPayload: UserSession = {
    id: "demo-passenger-admin",
    name: "Demo Passenger (Admin)",
    email: "demo@busdorkar.com",
    phone: "+880 1700-000000",
    role: "ADMIN",
  };

  // Ensure user is in memory store and demo bookings are loaded
  saveDevUser(demoPayload);
  seedDemoBookings();

  const response = NextResponse.json(
    {
      success: true,
      message: "Signed in as Demo Passenger (Admin Enabled)",
      user: demoPayload,
    },
    { status: 200 }
  );

  return attachSessionCookie(response, demoPayload);
}

export async function GET() {
  return POST();
}
