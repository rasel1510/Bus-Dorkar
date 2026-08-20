import { z } from "zod";

// Create Booking Schema
export const createBookingSchema = z.object({
  tripId: z
    .string()
    .min(1, "Trip ID is required"),
  seatIds: z
    .array(z.string().min(1))
    .min(1, "At least one seat must be selected")
    .max(4, "Maximum 4 seats per booking"),
  boardingPoint: z
    .string()
    .min(1, "Boarding point is required")
    .max(200, "Boarding point is too long"),
  droppingPoint: z
    .string()
    .min(1, "Dropping point is required")
    .max(200, "Dropping point is too long"),
  passengerName: z
    .string()
    .trim()
    .min(2, "Passenger name must be at least 2 characters")
    .max(100, "Passenger name is too long"),
  passengerPhone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20, "Phone number is too long"),
  paymentMethod: z
    .enum(["BKASH", "NAGAD", "SSLCOMMERZ", "COUNTER_CASH", "CARD"], {
      message: "Invalid payment method",
    }),
  // Trip snapshot fields for dev store (optional — populated from static data)
  operatorName: z.string().optional(),
  busType: z.string().optional(),
  fromDistrict: z.string().optional(),
  toDistrict: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  duration: z.string().optional(),
  travelDate: z.string().optional(),
  farePerSeat: z.number().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Cancel Booking Schema
export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Cancellation reason is required")
    .max(500, "Reason is too long"),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
