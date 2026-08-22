import { prisma } from "@/lib/db";
import {
  saveDevBooking,
  findDevBooking,
  getDevBookingsByUser,
  cancelDevBooking,
  generateBookingCode,
  generateTransactionId,
  calculateRefundPercentage,
  checkDevSeatConflict,
  DevBooking,
} from "@/lib/dev-booking-store";
import { CreateBookingInput } from "@/lib/validation/booking";

export interface BookingResult {
  success: boolean;
  booking?: DevBooking | any;
  message?: string;
  error?: string;
}

export async function createBookingService(
  userId: string,
  input: CreateBookingInput
): Promise<BookingResult> {
  const travelDate = input.travelDate || new Date().toISOString().split("T")[0];

  // 🔴 STRICT DOUBLE BOOKING GUARD: Check if any requested seats are already booked
  const conflicts = checkDevSeatConflict(input.tripId, travelDate, input.seatIds);
  if (conflicts.length > 0) {
    return {
      success: false,
      error: `Seat(s) ${conflicts.join(", ")} are already booked by another passenger. Please select available seats.`,
    };
  }

  const farePerSeat = input.farePerSeat || 1200;
  const totalAmount = input.seatIds.length * farePerSeat;
  const bookingCode = generateBookingCode();
  const transactionId = generateTransactionId(input.paymentMethod);
  const now = new Date().toISOString();
  const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  const qrCodeData = JSON.stringify({
    code: bookingCode,
    ticketId,
    passenger: input.passengerName,
    phone: input.passengerPhone,
    seats: input.seatIds,
    route: `${input.fromDistrict || "Dhaka"} -> ${input.toDistrict || "Cox's Bazar"}`,
    date: travelDate,
  });

  try {
    // Attempt Prisma DB insert first if DB is active
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (userExists) {
      const created = await prisma.booking.create({
        data: {
          bookingCode,
          userId,
          tripId: input.tripId,
          totalAmount,
          status: "CONFIRMED",
          payment: {
            create: {
              method: input.paymentMethod,
              status: "SUCCESS",
              amount: totalAmount,
              transactionId,
            },
          },
          ticket: {
            create: {
              qrCode: qrCodeData,
            },
          },
        },
        include: {
          payment: true,
          ticket: true,
        },
      });

      const devRecord: DevBooking = {
        id: created.id,
        bookingCode: created.bookingCode,
        userId,
        tripId: input.tripId,
        operatorName: input.operatorName || "Green Line Paribahan",
        busType: input.busType || "Scania Multi-Axle AC",
        fromDistrict: input.fromDistrict || "Dhaka",
        toDistrict: input.toDistrict || "Cox's Bazar",
        departureTime: input.departureTime || "10:30 PM",
        arrivalTime: input.arrivalTime || "07:00 AM",
        duration: input.duration || "8h 30m",
        travelDate: input.travelDate || new Date().toISOString().split("T")[0],
        seats: input.seatIds,
        boardingPoint: input.boardingPoint,
        droppingPoint: input.droppingPoint,
        passengerName: input.passengerName,
        passengerPhone: input.passengerPhone,
        totalAmount,
        farePerSeat,
        status: "CONFIRMED",
        createdAt: now,
        paymentMethod: input.paymentMethod,
        paymentStatus: "SUCCESS",
        transactionId,
        ticketId,
        qrCode: qrCodeData,
        ticketIssuedAt: now,
        cancelledAt: null,
        cancellationReason: null,
        refundAmount: null,
      };
      saveDevBooking(devRecord);

      return { success: true, booking: devRecord };
    }
  } catch (err: any) {
    console.warn("DB not connected or query failed, falling back to DevBookingStore:", err.message);
  }

  // Fallback / Dev Store implementation
  const devBooking: DevBooking = {
    id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    bookingCode,
    userId,
    tripId: input.tripId,
    operatorName: input.operatorName || "Green Line Paribahan",
    busType: input.busType || "Scania Multi-Axle AC",
    fromDistrict: input.fromDistrict || "Dhaka",
    toDistrict: input.toDistrict || "Cox's Bazar",
    departureTime: input.departureTime || "10:30 PM",
    arrivalTime: input.arrivalTime || "07:00 AM",
    duration: input.duration || "8h 30m",
    travelDate: input.travelDate || new Date().toISOString().split("T")[0],
    seats: input.seatIds,
    boardingPoint: input.boardingPoint,
    droppingPoint: input.droppingPoint,
    passengerName: input.passengerName,
    passengerPhone: input.passengerPhone,
    totalAmount,
    farePerSeat,
    status: "CONFIRMED",
    createdAt: now,
    paymentMethod: input.paymentMethod,
    paymentStatus: "SUCCESS",
    transactionId,
    ticketId,
    qrCode: qrCodeData,
    ticketIssuedAt: now,
    cancelledAt: null,
    cancellationReason: null,
    refundAmount: null,
  };

  saveDevBooking(devBooking);
  return { success: true, booking: devBooking };
}

export async function getUserBookingsService(userId: string): Promise<DevBooking[]> {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (dbUser) {
      const dbBookings = await prisma.booking.findMany({
        where: { userId },
        include: { payment: true, ticket: true, trip: true },
        orderBy: { createdAt: "desc" },
      });
      if (dbBookings.length > 0) {
        return dbBookings.map((b: any) => ({
          id: b.id,
          bookingCode: b.bookingCode,
          userId: b.userId,
          tripId: b.tripId,
          operatorName: "Green Line Paribahan",
          busType: "AC Executive",
          fromDistrict: "Dhaka",
          toDistrict: "Cox's Bazar",
          departureTime: "10:30 PM",
          arrivalTime: "07:00 AM",
          duration: "8h 30m",
          travelDate: b.createdAt.toISOString().split("T")[0],
          seats: ["A1", "A2"],
          boardingPoint: "Gabtoli Counter",
          droppingPoint: "Cox's Bazar Main Counter",
          passengerName: b.user?.name || "Passenger",
          passengerPhone: b.user?.phone || "+8801700000000",
          totalAmount: b.totalAmount,
          farePerSeat: b.totalAmount / 2,
          status: b.status,
          createdAt: b.createdAt.toISOString(),
          paymentMethod: b.payment?.method || "BKASH",
          paymentStatus: b.payment?.status || "SUCCESS",
          transactionId: b.payment?.transactionId || null,
          ticketId: b.ticket?.id || null,
          qrCode: b.ticket?.qrCode || null,
          ticketIssuedAt: b.ticket?.issuedAt?.toISOString() || null,
          cancelledAt: null,
          cancellationReason: null,
          refundAmount: null,
        }));
      }
    }
  } catch (err: any) {
    // Fallthrough to dev store
  }

  return getDevBookingsByUser(userId);
}

export async function getBookingByIdService(
  idOrCode: string,
  userId?: string
): Promise<DevBooking | null> {
  const booking = findDevBooking(idOrCode);
  if (booking) {
    if (userId && booking.userId !== userId) return null;
    return booking;
  }
  return null;
}

export async function cancelBookingService(
  idOrCode: string,
  userId: string,
  reason: string
): Promise<BookingResult> {
  const booking = findDevBooking(idOrCode);
  if (!booking) {
    return { success: false, error: "Booking not found" };
  }

  if (booking.userId !== userId) {
    return { success: false, error: "Unauthorized to cancel this booking" };
  }

  if (booking.status === "CANCELLED") {
    return { success: false, error: "Booking is already cancelled" };
  }

  const travelDateTime = `${booking.travelDate} ${booking.departureTime}`;
  const refundPct = calculateRefundPercentage(travelDateTime);
  const refundAmount = Math.round((booking.totalAmount * refundPct) / 100);

  const updated = cancelDevBooking(idOrCode, reason, refundAmount);
  return {
    success: true,
    booking: updated,
    message: `Booking cancelled successfully. Refund of ৳${refundAmount} (${refundPct}%) will be processed.`,
  };
}
