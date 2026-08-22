// Inter-District Bus Trips & Timetable Engine
// Inspired by Skyss & Norwegian transport platforms for Bangladesh
import { getAllDevBookedSeatsForTrip } from "@/lib/dev-booking-store";

export interface BusTrip {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorLogoBg: string;
  operatorRating: number;
  operatorReviews: string;
  isVerified: boolean;
  busType: "AC_SCANIA" | "AC_VOLVO" | "NON_AC_DELUXE" | "SLEEPER_LUXURY";
  busTypeLabel: string;
  seatLayout: "2+2" | "2+1" | "SLEEPER";
  fromDistrictId: string;
  fromDistrictName: string;
  toDistrictId: string;
  toDistrictName: string;
  departureTime: string; // e.g. "07:30 AM"
  arrivalTime: string;   // e.g. "03:30 PM"
  departure24h: number;  // for sorting e.g. 7.5
  duration: string;      // e.g. "8h 00m"
  boardingPoints: string[];
  droppingPoints: string[];
  fareBDT: number;
  availableSeats: number;
  totalSeats: number;
  bookedSeatNumbers: string[];
  amenities: string[];
}

export const OPERATOR_PROFILES = [
  {
    id: "green-line",
    name: "Green Line Paribahan",
    logoBg: "from-emerald-600 to-teal-700",
    rating: 4.9,
    reviews: "12.4k",
    types: ["AC_SCANIA", "SLEEPER_LUXURY"],
    baseFareMultiplier: 1.25,
  },
  {
    id: "shohagh",
    name: "Shohagh Paribahan",
    logoBg: "from-teal-600 to-cyan-700",
    rating: 4.8,
    reviews: "15.4k",
    types: ["AC_VOLVO", "AC_SCANIA"],
    baseFareMultiplier: 1.2,
  },
  {
    id: "hanif",
    name: "Hanif Enterprise",
    logoBg: "from-blue-600 to-indigo-700",
    rating: 4.7,
    reviews: "24.9k",
    types: ["NON_AC_DELUXE", "AC_VOLVO"],
    baseFareMultiplier: 1.0,
  },
  {
    id: "ena",
    name: "Ena Transport",
    logoBg: "from-emerald-700 to-green-800",
    rating: 4.6,
    reviews: "18.2k",
    types: ["AC_VOLVO", "NON_AC_DELUXE"],
    baseFareMultiplier: 1.05,
  },
  {
    id: "shyamoli-nr",
    name: "Shyamoli N.R Travels",
    logoBg: "from-purple-600 to-indigo-700",
    rating: 4.8,
    reviews: "9.8k",
    types: ["SLEEPER_LUXURY", "AC_SCANIA"],
    baseFareMultiplier: 1.3,
  },
  {
    id: "saintmartin",
    name: "Saintmartin Travels",
    logoBg: "from-cyan-600 to-teal-800",
    rating: 4.9,
    reviews: "6.2k",
    types: ["SLEEPER_LUXURY", "AC_VOLVO"],
    baseFareMultiplier: 1.35,
  },
  {
    id: "desh-travels",
    name: "Desh Travels Express",
    logoBg: "from-red-600 to-rose-700",
    rating: 4.8,
    reviews: "8.1k",
    types: ["AC_SCANIA", "NON_AC_DELUXE"],
    baseFareMultiplier: 1.15,
  },
  {
    id: "nabil",
    name: "Nabil Paribahan",
    logoBg: "from-indigo-600 to-blue-800",
    rating: 4.6,
    reviews: "7.4k",
    types: ["AC_VOLVO", "NON_AC_DELUXE"],
    baseFareMultiplier: 1.08,
  },
  {
    id: "saudia",
    name: "Saudia Developmental Transport",
    logoBg: "from-amber-600 to-yellow-700",
    rating: 4.5,
    reviews: "11.0k",
    types: ["AC_VOLVO", "NON_AC_DELUXE"],
    baseFareMultiplier: 1.02,
  },
  {
    id: "royal-express",
    name: "Royal Express",
    logoBg: "from-purple-700 to-pink-700",
    rating: 4.7,
    reviews: "5.9k",
    types: ["AC_SCANIA", "NON_AC_DELUXE"],
    baseFareMultiplier: 1.12,
  },
  {
    id: "silk-line",
    name: "Silk Line Paribahan",
    logoBg: "from-sky-600 to-blue-700",
    rating: 4.8,
    reviews: "4.3k",
    types: ["AC_SCANIA", "SLEEPER_LUXURY"],
    baseFareMultiplier: 1.28,
  },
  {
    id: "agami-desh",
    name: "Agami Desh Travels",
    logoBg: "from-teal-700 to-emerald-800",
    rating: 4.6,
    reviews: "3.7k",
    types: ["AC_VOLVO"],
    baseFareMultiplier: 1.1,
  },
  {
    id: "tr-travels",
    name: "TR Travels",
    logoBg: "from-slate-700 to-slate-900",
    rating: 4.7,
    reviews: "5.1k",
    types: ["SLEEPER_LUXURY", "AC_SCANIA"],
    baseFareMultiplier: 1.32,
  },
  {
    id: "eagle",
    name: "Eagle Paribahan",
    logoBg: "from-rose-600 to-red-800",
    rating: 4.4,
    reviews: "14.2k",
    types: ["NON_AC_DELUXE", "AC_VOLVO"],
    baseFareMultiplier: 0.98,
  },
  {
    id: "s-alam",
    name: "S.Alam Transport",
    logoBg: "from-emerald-800 to-teal-900",
    rating: 4.5,
    reviews: "16.8k",
    types: ["NON_AC_DELUXE", "AC_VOLVO"],
    baseFareMultiplier: 1.0,
  },
  {
    id: "brtc",
    name: "BRTC (Bangladesh Road Transport Corp)",
    logoBg: "from-red-700 to-green-700",
    rating: 4.3,
    reviews: "32.1k",
    types: ["NON_AC_DELUXE", "AC_VOLVO"],
    baseFareMultiplier: 0.85,
  },
  {
    id: "rozina",
    name: "Rozina Enterprise",
    logoBg: "from-orange-600 to-amber-700",
    rating: 4.4,
    reviews: "6.8k",
    types: ["NON_AC_DELUXE"],
    baseFareMultiplier: 0.95,
  },
  {
    id: "dipraj",
    name: "Dipraj Paribahan",
    logoBg: "from-blue-700 to-cyan-800",
    rating: 4.3,
    reviews: "4.2k",
    types: ["NON_AC_DELUXE"],
    baseFareMultiplier: 0.92,
  },
  {
    id: "sakura",
    name: "Sakura Paribahan",
    logoBg: "from-pink-600 to-rose-700",
    rating: 4.5,
    reviews: "9.1k",
    types: ["NON_AC_DELUXE", "AC_VOLVO"],
    baseFareMultiplier: 0.96,
  },
  {
    id: "manik-express",
    name: "Manik Express",
    logoBg: "from-violet-600 to-purple-800",
    rating: 4.4,
    reviews: "5.3k",
    types: ["NON_AC_DELUXE"],
    baseFareMultiplier: 0.93,
  },
];

// Helper to generate dynamic, realistic bus schedules for any requested origin & destination
export function getBusTripsForRoute(
  fromId: string,
  toId: string,
  fromName: string,
  toName: string,
  dateStr?: string
): BusTrip[] {
  const isCoxs = toId === "coxs-bazar" || fromId === "coxs-bazar";
  const isSylhet = toId === "sylhet" || fromId === "sylhet";
  const isChattogram = toId === "chattogram" || fromId === "chattogram";
  const isRajshahi = toId === "rajshahi" || fromId === "rajshahi";

  // Base pricing based on distance tier
  let baseFare = 800;
  let estimatedDurationHours = 6;

  if (isCoxs) {
    baseFare = 1200;
    estimatedDurationHours = 9;
  } else if (isChattogram) {
    baseFare = 900;
    estimatedDurationHours = 5.5;
  } else if (isSylhet) {
    baseFare = 850;
    estimatedDurationHours = 6;
  } else if (isRajshahi) {
    baseFare = 950;
    estimatedDurationHours = 7;
  }

  const departureSchedules = [
    { time: "06:30 AM", h24: 6.5, period: "morning" },
    { time: "08:00 AM", h24: 8.0, period: "morning" },
    { time: "10:15 AM", h24: 10.25, period: "morning" },
    { time: "01:30 PM", h24: 13.5, period: "afternoon" },
    { time: "04:00 PM", h24: 16.0, period: "afternoon" },
    { time: "08:30 PM", h24: 20.5, period: "night" },
    { time: "10:00 PM", h24: 22.0, period: "night" },
    { time: "11:30 PM", h24: 23.5, period: "night" },
  ];

  const boardings = [
    `${fromName} Central Bus Terminal (Gabtoli)`,
    `${fromName} Sayedabad Counter Hub`,
    `${fromName} Kalabagan Counter`,
    `${fromName} Arambagh Bus Stop`,
  ];

  const droppings = [
    `${toName} Central Terminal Counter`,
    `${toName} Main Road Counter`,
    `${toName} Hotel Zone Counter`,
  ];

  return departureSchedules.map((sched, index) => {
    const op = OPERATOR_PROFILES[index % OPERATOR_PROFILES.length];
    const bType = op.types[index % op.types.length];

    let bLabel = "Scania Multi-Axle AC";
    let layout: "2+2" | "2+1" | "SLEEPER" = "2+2";
    let totalS = 36;
    let fareMult = 1.0;

    if (bType === "AC_SCANIA") {
      bLabel = "Scania Multi-Axle AC (2+2)";
      layout = "2+2";
      totalS = 36;
      fareMult = 1.15;
    } else if (bType === "AC_VOLVO") {
      bLabel = "Volvo B11R Executive AC (2+2)";
      layout = "2+2";
      totalS = 36;
      fareMult = 1.2;
    } else if (bType === "SLEEPER_LUXURY") {
      bLabel = "Double Decker Sleeper Coach (2+1)";
      layout = "SLEEPER";
      totalS = 28;
      fareMult = 1.5;
    } else {
      bLabel = "Non-AC Hino Deluxe (2+2)";
      layout = "2+2";
      totalS = 40;
      fareMult = 0.85;
    }

    const tripId = `trip-${fromId}-${toId}-${index + 1}`;
    const calculatedFare = Math.round(baseFare * op.baseFareMultiplier * fareMult);
    const arrH24 = (sched.h24 + estimatedDurationHours) % 24;
    const arrHourInt = Math.floor(arrH24);
    const arrMin = Math.round((arrH24 - arrHourInt) * 60);
    const arrPeriodStr = arrHourInt >= 12 ? "PM" : "AM";
    const arrDisplayHour = arrHourInt % 12 === 0 ? 12 : arrHourInt % 12;
    const arrivalTimeStr = `${String(arrDisplayHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")} ${arrPeriodStr}`;

    const durHours = Math.floor(estimatedDurationHours);
    const durMins = Math.round((estimatedDurationHours - durHours) * 60);
    const durationStr = `${durHours}h ${durMins > 0 ? `${durMins}m` : "00m"}`;

    // Base pre-booked demo seats
    const bookedCount = 10 + ((index * 7) % 18);
    const bookedSeatsSet = new Set<string>();
    const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let added = 0;
    for (const row of seatRows) {
      for (let col = 1; col <= 4; col++) {
        if (added < bookedCount && (added + index) % 2 === 0) {
          bookedSeatsSet.add(`${row}${col}`);
        }
        added++;
      }
    }

    // 🔴 FETCH & MERGE REAL PASSENGER BOOKINGS dynamically for this trip & travel date
    const realBookedSeats = getAllDevBookedSeatsForTrip(tripId, dateStr);
    realBookedSeats.forEach((seat) => bookedSeatsSet.add(seat));

    const finalBookedSeatsList = Array.from(bookedSeatsSet);
    const availableS = Math.max(0, totalS - finalBookedSeatsList.length);

    return {
      id: tripId,
      operatorId: op.id,
      operatorName: op.name,
      operatorLogoBg: op.logoBg,
      operatorRating: op.rating,
      operatorReviews: op.reviews,
      isVerified: true,
      busType: bType as any,
      busTypeLabel: bLabel,
      seatLayout: layout,
      fromDistrictId: fromId,
      fromDistrictName: fromName,
      toDistrictId: toId,
      toDistrictName: toName,
      departureTime: sched.time,
      arrivalTime: arrivalTimeStr,
      departure24h: sched.h24,
      duration: durationStr,
      boardingPoints: boardings,
      droppingPoints: droppings,
      fareBDT: calculatedFare,
      availableSeats: availableS,
      totalSeats: totalS,
      bookedSeatNumbers: finalBookedSeatsList,
      amenities: [
        "Air Conditioning",
        "Reclining Seats",
        "Charging Port",
        "Water Bottle",
        "GPS Tracking",
        "Reading Light",
      ],
    };
  });
}
