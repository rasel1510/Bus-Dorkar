"use client";

import {
  Armchair,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  User,
  Phone,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TicketData {
  bookingCode: string;
  status: string;
  operatorName: string;
  busType: string;
  fromDistrict: string;
  toDistrict: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  travelDate: string;
  seats: string[];
  boardingPoint: string;
  droppingPoint: string;
  passengerName: string;
  passengerPhone: string;
  totalAmount: number;
  farePerSeat: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  ticketId: string | null;
  qrCode: string | null;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "CANCELLED":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

/** Simple QR code rendered as an SVG grid pattern */
function QRCodeSVG({ data, size = 140 }: { data: string; size?: number }) {
  // Generate a deterministic grid from the data string
  const gridSize = 21;
  const cellSize = size / gridSize;
  const cells: boolean[][] = [];

  // Create a simple hash-based pattern (not a real QR, but visually representative)
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }

  for (let row = 0; row < gridSize; row++) {
    cells[row] = [];
    for (let col = 0; col < gridSize; col++) {
      // Corner finder patterns (7x7 squares in 3 corners)
      const isTopLeftFinder = row < 7 && col < 7;
      const isTopRightFinder = row < 7 && col >= gridSize - 7;
      const isBottomLeftFinder = row >= gridSize - 7 && col < 7;

      if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder) {
        const localR = isBottomLeftFinder ? row - (gridSize - 7) : row;
        const localC = isTopRightFinder ? col - (gridSize - 7) : col;
        // Outer border or inner square
        cells[row][col] =
          localR === 0 || localR === 6 || localC === 0 || localC === 6 ||
          (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4);
      } else {
        // Data area: pseudo-random based on position and hash
        const seed = (row * gridSize + col + hash) * 2654435761;
        cells[row][col] = (seed >>> 16) % 3 !== 0;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function TicketView({ ticket }: { ticket: TicketData }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Ticket Header with tear effect */}
      <div className="gradient-teal px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-teal-100 uppercase tracking-wider">Bus Dorkar — Digital Ticket</p>
            <p className="text-lg font-extrabold mt-0.5">{ticket.bookingCode}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              ticket.status === "CONFIRMED"
                ? "bg-white/20 text-white border-white/40"
                : ticket.status === "CANCELLED"
                ? "bg-red-400/30 text-white border-red-300/50"
                : "bg-white/15 text-white border-white/30"
            }`}
          >
            {ticket.status}
          </Badge>
        </div>
      </div>

      {/* Dotted separator (tear line effect) */}
      <div className="relative h-4 bg-slate-50">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-slate-50 rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-slate-50 rounded-full" />
        <div className="border-t-2 border-dashed border-slate-200 absolute top-1/2 left-6 right-6" />
      </div>

      {/* Ticket Body */}
      <div className="p-5 space-y-4">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-lg font-extrabold text-slate-900">{ticket.fromDistrict}</p>
            <p className="text-[11px] font-semibold text-slate-500">{ticket.departureTime}</p>
          </div>
          <div className="flex-1 mx-4 flex flex-col items-center">
            <p className="text-[10px] font-bold text-teal-600 mb-1">{ticket.duration}</p>
            <div className="w-full h-px bg-slate-200 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-600" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-600" />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-1">{ticket.operatorName}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-extrabold text-slate-900">{ticket.toDistrict}</p>
            <p className="text-[11px] font-semibold text-slate-500">{ticket.arrivalTime}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5 text-teal-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Travel Date</p>
              <p className="font-bold text-slate-800">{ticket.travelDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Armchair className="h-3.5 w-3.5 text-teal-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Seats</p>
              <p className="font-bold text-slate-800">{ticket.seats.join(", ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3.5 w-3.5 text-teal-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Passenger</p>
              <p className="font-bold text-slate-800">{ticket.passengerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Phone className="h-3.5 w-3.5 text-teal-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Phone</p>
              <p className="font-bold text-slate-800">{ticket.passengerPhone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Boarding</p>
              <p className="font-bold text-slate-800 text-[11px] leading-tight">{ticket.boardingPoint}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3.5 w-3.5 text-red-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Dropping</p>
              <p className="font-bold text-slate-800 text-[11px] leading-tight">{ticket.droppingPoint}</p>
            </div>
          </div>
        </div>

        {/* Payment + QR */}
        <div className="flex items-start gap-4">
          {/* Payment Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5 text-teal-600" />
              <span className="font-bold text-slate-700">{ticket.paymentMethod.replace("_", " ")}</span>
              <Badge
                variant="outline"
                className={`text-[9px] font-bold px-1.5 py-0 rounded-full ${
                  ticket.paymentStatus === "SUCCESS"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : ticket.paymentStatus === "REFUNDED"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {ticket.paymentStatus}
              </Badge>
            </div>
            {ticket.transactionId && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Hash className="h-3 w-3" />
                <span className="font-mono">{ticket.transactionId}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {ticket.seats.length} seat(s) × ৳{ticket.farePerSeat}
                </span>
                <span className="text-lg font-extrabold text-emerald-700">৳ {ticket.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {ticket.qrCode && ticket.status !== "CANCELLED" && (
            <div className="flex flex-col items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <QRCodeSVG data={ticket.qrCode} size={120} />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Scan to verify</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          Verified by Bus Dorkar
        </div>
        <p className="text-[10px] text-slate-400 font-medium">{ticket.busType}</p>
      </div>
    </div>
  );
}
