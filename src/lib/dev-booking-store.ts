// In-Memory Booking Store — development fallback when PostgreSQL is not connected
// Mirrors the pattern used in dev-store.ts for user data

export interface DevBooking {
  id: string;
  bookingCode: string;
  userId: string;
  tripId: string;
  // Trip snapshot (denormalized for display without DB joins)
  operatorName: string;
  busType: string;
  fromDistrict: string;
  toDistrict: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  travelDate: string;
  // Booking details
  seats: string[];
  boardingPoint: string;
  droppingPoint: string;
  passengerName: string;
  passengerPhone: string;
  totalAmount: number;
  farePerSeat: number;
  status: "PENDING" | "PAYMENT_PENDING" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "EXPIRED";
  createdAt: string; // ISO string
  // Payment
  paymentMethod: "BKASH" | "NAGAD" | "SSLCOMMERZ" | "COUNTER_CASH" | "CARD";
  paymentStatus: "INITIATED" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
  transactionId: string | null;
  // Ticket
  ticketId: string | null;
  qrCode: string | null;
  ticketIssuedAt: string | null;
  // Cancellation
  cancelledAt: string | null;
  cancellationReason: string | null;
  refundAmount: number | null;
}

const globalForBookings = globalThis as unknown as {
  devBookingStore: Map<string, DevBooking> | undefined;
};

export const devBookingStore =
  globalForBookings.devBookingStore ?? new Map<string, DevBooking>();

if (process.env.NODE_ENV !== "production") {
  globalForBookings.devBookingStore = devBookingStore;
}

/** Generate a booking code like BD-20260820-A8K92D */
export function generateBookingCode(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BD-${dateStr}-${suffix}`;
}

/** Generate a transaction ID */
export function generateTransactionId(method: string): string {
  const prefix = method === "BKASH" ? "BK" : method === "NAGAD" ? "NG" : method === "CARD" ? "CD" : "TX";
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 10000)}`;
}

/** Save a booking to the in-memory store */
export function saveDevBooking(booking: DevBooking): void {
  devBookingStore.set(booking.id, booking);
  // Also index by bookingCode for quick lookup
  devBookingStore.set(booking.bookingCode, booking);
}

/** Find a booking by ID or bookingCode */
export function findDevBooking(idOrCode: string): DevBooking | undefined {
  return devBookingStore.get(idOrCode);
}

/** Get all bookings for a user, sorted by newest first */
export function getDevBookingsByUser(userId: string): DevBooking[] {
  const bookings: DevBooking[] = [];
  const seen = new Set<string>();
  for (const booking of devBookingStore.values()) {
    if (booking.userId === userId && !seen.has(booking.id)) {
      seen.add(booking.id);
      bookings.push(booking);
    }
  }
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Cancel a booking in the dev store */
export function cancelDevBooking(
  idOrCode: string,
  reason: string,
  refundAmount: number
): DevBooking | null {
  const booking = findDevBooking(idOrCode);
  if (!booking) return null;

  booking.status = "CANCELLED";
  booking.cancelledAt = new Date().toISOString();
  booking.cancellationReason = reason;
  booking.refundAmount = refundAmount;
  if (refundAmount > 0) {
    booking.paymentStatus = "REFUNDED";
  }

  // Update both entries (by ID and by code)
  devBookingStore.set(booking.id, booking);
  devBookingStore.set(booking.bookingCode, booking);

  return booking;
}

function normalizeDateStr(d?: string | null): string {
  if (!d) return "";
  const clean = d.trim().toLowerCase();
  if (clean === "today" || clean === "") {
    return new Date().toISOString().split("T")[0];
  }
  if (clean.includes("t")) {
    return clean.split("t")[0];
  }
  const match = clean.match(/\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  return clean;
}

/** Get all currently active booked seat numbers for a specific trip and travel date */
export function getAllDevBookedSeatsForTrip(tripId: string, travelDate?: string): string[] {
  const bookedSeats = new Set<string>();
  const seen = new Set<string>();

  const targetDate = normalizeDateStr(travelDate);
  const targetTripId = (tripId || "").trim().toLowerCase();

  for (const booking of devBookingStore.values()) {
    if (!booking || !booking.id) continue;
    if (seen.has(booking.id)) continue;
    seen.add(booking.id);

    // Skip cancelled or expired bookings
    if (booking.status === "CANCELLED" || booking.status === "EXPIRED") continue;

    const bookingTripId = (booking.tripId || "").trim().toLowerCase();

    if (bookingTripId === targetTripId || targetTripId.includes(bookingTripId) || bookingTripId.includes(targetTripId)) {
      // Normalize dates before checking match
      if (targetDate && booking.travelDate) {
        const bookingDate = normalizeDateStr(booking.travelDate);
        if (targetDate !== bookingDate && bookingDate !== "" && targetDate !== "") {
          continue;
        }
      }
      if (Array.isArray(booking.seats)) {
        booking.seats.forEach((seat) => bookedSeats.add(seat));
      }
    }
  }

  return Array.from(bookedSeats);
}

/** Check if any requested seats are already booked for a given trip and date */
export function checkDevSeatConflict(
  tripId: string,
  travelDate: string,
  requestedSeats: string[]
): string[] {
  const alreadyBooked = getAllDevBookedSeatsForTrip(tripId, travelDate);
  const conflicts = requestedSeats.filter((seat) => alreadyBooked.includes(seat));
  return conflicts;
}

/**
 * Calculate refund percentage based on time before departure.
 * Uses the default cancellation policy from the project spec.
 */
export function calculateRefundPercentage(departureTimeISO: string): number {
  const now = new Date();
  const departure = new Date(departureTimeISO);
  const hoursUntilDeparture = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilDeparture > 48) return 90;
  if (hoursUntilDeparture > 24) return 70;
  if (hoursUntilDeparture > 6) return 40;
  return 0; // No refund within 6 hours
}

// Pre-seed sample bookings for the Demo Passenger / Recruiter user
export function seedDemoBookings() {
  const demoUserId = "demo-passenger-admin";

  const demoBookings: DevBooking[] = [
    {
      id: "booking-demo-001",
      bookingCode: "BD-20260828-A7K92D",
      userId: demoUserId,
      tripId: "trip-greenline-01",
      operatorName: "Green Line Paribahan",
      busType: "Scania Multi-Axle Elite AC",
      fromDistrict: "Dhaka",
      toDistrict: "Cox's Bazar",
      departureTime: "10:30 PM",
      arrivalTime: "07:00 AM",
      duration: "8h 30m",
      travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      seats: ["D1", "D2"],
      boardingPoint: "Gabtoli Terminal, Counter 4",
      droppingPoint: "Kolatoli Beach Main Counter, Cox's Bazar",
      passengerName: "Demo Passenger",
      passengerPhone: "+880 1700-000000",
      totalAmount: 2600,
      farePerSeat: 1300,
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
      paymentMethod: "BKASH",
      paymentStatus: "SUCCESS",
      transactionId: "BK9928172635",
      ticketId: "TKT-829104",
      qrCode: JSON.stringify({
        code: "BD-20260828-A7K92D",
        passenger: "Demo Passenger",
        route: "Dhaka -> Cox's Bazar",
        seats: ["D1", "D2"],
      }),
      ticketIssuedAt: new Date().toISOString(),
      cancelledAt: null,
      cancellationReason: null,
      refundAmount: null,
    },
    {
      id: "booking-demo-002",
      bookingCode: "BD-20260810-F4M19X",
      userId: demoUserId,
      tripId: "trip-hanif-02",
      operatorName: "Hanif Enterprise",
      busType: "Hyundai Universe AC VIP",
      fromDistrict: "Dhaka",
      toDistrict: "Sylhet",
      departureTime: "08:30 AM",
      arrivalTime: "02:30 PM",
      duration: "6h 00m",
      travelDate: new Date(Date.now() - 86400000 * 15).toISOString().split("T")[0],
      seats: ["B2"],
      boardingPoint: "Sayedabad Counter, Dhaka",
      droppingPoint: "Kadamtali Bus Terminal, Sylhet",
      passengerName: "Demo Passenger",
      passengerPhone: "+880 1700-000000",
      totalAmount: 1100,
      farePerSeat: 1100,
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 86400000 * 16).toISOString(),
      paymentMethod: "NAGAD",
      paymentStatus: "SUCCESS",
      transactionId: "NG4819028471",
      ticketId: "TKT-419823",
      qrCode: JSON.stringify({
        code: "BD-20260810-F4M19X",
        passenger: "Demo Passenger",
        route: "Dhaka -> Sylhet",
        seats: ["B2"],
      }),
      ticketIssuedAt: new Date(Date.now() - 86400000 * 16).toISOString(),
      cancelledAt: null,
      cancellationReason: null,
      refundAmount: null,
    },
    {
      id: "booking-demo-003",
      bookingCode: "BD-20260725-P9Q83W",
      userId: demoUserId,
      tripId: "trip-shyamoli-03",
      operatorName: "Shyamoli NR Travels",
      busType: "Volvo B11R Sleeper AC",
      fromDistrict: "Dhaka",
      toDistrict: "Chittagong",
      departureTime: "11:00 PM",
      arrivalTime: "05:30 AM",
      duration: "6h 30m",
      travelDate: new Date(Date.now() - 86400000 * 30).toISOString().split("T")[0],
      seats: ["A3"],
      boardingPoint: "Arambagh Counter, Dhaka",
      droppingPoint: "Dampara Counter, Chittagong",
      passengerName: "Demo Passenger",
      passengerPhone: "+880 1700-000000",
      totalAmount: 1400,
      farePerSeat: 1400,
      status: "CANCELLED",
      createdAt: new Date(Date.now() - 86400000 * 32).toISOString(),
      paymentMethod: "CARD",
      paymentStatus: "REFUNDED",
      transactionId: "CD7719283401",
      ticketId: "TKT-102948",
      qrCode: null,
      ticketIssuedAt: new Date(Date.now() - 86400000 * 32).toISOString(),
      cancelledAt: new Date(Date.now() - 86400000 * 31).toISOString(),
      cancellationReason: "Schedule changed by passenger (Trip rescheduled)",
      refundAmount: 1260,
    },
  ];

  demoBookings.forEach((b) => saveDevBooking(b));
}

// Automatically seed on initial module load
seedDemoBookings();

