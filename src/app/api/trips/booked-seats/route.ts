import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllDevBookedSeatsForTrip } from "@/lib/dev-booking-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!tripId) {
      return NextResponse.json({ success: false, error: "tripId is required" }, { status: 400 });
    }

    const bookedSet = new Set<string>();

    // 1. Fetch from Dev Store
    const devSeats = getAllDevBookedSeatsForTrip(tripId, date);
    devSeats.forEach((s) => bookedSet.add(s));

    // 2. Fetch from Prisma Database if active
    try {
      const dbBookings = await prisma.booking.findMany({
        where: {
          tripId,
          status: { notIn: ["CANCELLED", "EXPIRED"] },
        },
        include: {
          bookingSeats: {
            include: {
              tripSeat: {
                include: { seat: true },
              },
            },
          },
        },
      });

      for (const booking of dbBookings) {
        if (booking.bookingSeats && booking.bookingSeats.length > 0) {
          booking.bookingSeats.forEach((bs: any) => {
            if (bs.tripSeat?.seat?.seatNo) {
              bookedSet.add(bs.tripSeat.seat.seatNo);
            }
          });
        }
      }
    } catch {
      // DB check optional fallback
    }

    return NextResponse.json({
      success: true,
      tripId,
      date,
      bookedSeats: Array.from(bookedSet),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
