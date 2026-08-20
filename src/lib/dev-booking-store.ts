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
