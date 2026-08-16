"use client";

import { useState } from "react";
import { BusTrip } from "@/lib/data/buses";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Armchair,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  User,
  Ticket,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SeatSelectorModalProps {
  trip: BusTrip | null;
  open: boolean;
  onClose: () => void;
  dateStr?: string;
}

export function SeatSelectorModal({
  trip,
  open,
  onClose,
  dateStr = "Today",
}: SeatSelectorModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState<string>("");
  const [passengerPhone, setPassengerPhone] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  if (!trip) return null;

  const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const isSleeper = trip.seatLayout === "SLEEPER";

  const toggleSeat = (seatId: string) => {
    if (trip.bookedSeatNumbers.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 4) {
        alert("Maximum 4 seats allowed per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalFare = selectedSeats.length * trip.fareBDT;
  const currentBoarding = boardingPoint || trip.boardingPoints[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    if (!passengerPhone.trim()) {
      alert("Please enter your mobile number.");
      return;
    }

    const ref = `BD-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setSelectedSeats([]);
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleResetAndClose}>
      <DialogContent className="w-[calc(100vw-24px)] sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-white text-slate-900 border border-slate-200 p-0 shadow-2xl rounded-2xl z-50">
        {/* CLEAN WHITE HEADER */}
        <div className="bg-white text-slate-900 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                {trip.operatorName}
              </span>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-semibold">
                {trip.busTypeLabel}
              </Badge>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{trip.fromDistrictName}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span>{trip.toDistrictName}</span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-semibold block">Fare per seat</span>
            <span className="text-lg font-extrabold text-emerald-700">৳ {trip.fareBDT}</span>
          </div>
        </div>

        {isSuccess ? (
          /* SUCCESS BOOKING SCREEN */
          <div className="p-6 text-center space-y-4 bg-white">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <Sparkles className="h-3 w-3" /> Booking Confirmed
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Ticket Reference: {bookingRef}
              </h3>
            </div>

            <div className="max-w-sm mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">Route:</span>
                <strong className="text-slate-900">{trip.fromDistrictName} ➔ {trip.toDistrictName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">Seats:</span>
                <strong className="text-teal-700 font-bold">{selectedSeats.join(", ")}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">Mobile:</span>
                <strong className="text-slate-900">{passengerPhone}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-700 font-bold">Total Fare:</span>
                <strong className="text-emerald-700 text-sm font-extrabold">৳ {totalFare}</strong>
              </div>
            </div>

            <Button
              onClick={handleResetAndClose}
              className="gradient-teal text-white font-bold px-6 h-10 rounded-xl shadow-md cursor-pointer"
            >
              Close
            </Button>
          </div>
        ) : (
          /* MINIMALIST SEAT SELECTOR LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* LEFT: MINIMAL BUS SEAT MAP */}
            <div className="md:col-span-6 p-4 sm:p-5 bg-slate-50 border-r border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Armchair className="h-3.5 w-3.5 text-teal-600" /> Select Seat
                </span>
                <span className="font-semibold text-emerald-700">
                  {trip.availableSeats} available
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-around bg-white p-2 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded bg-white border border-slate-300"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded bg-teal-600 text-white flex items-center justify-center text-[8px] font-bold">✓</div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded bg-slate-200 border border-slate-300"></div>
                  <span>Booked</span>
                </div>
              </div>

              {/* Seats Interior Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 max-w-[240px] mx-auto shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] font-bold text-slate-500">
                  <span>Front</span>
                  <span>Driver</span>
                </div>

                <div className="space-y-2">
                  {rowLetters.map((row) => {
                    const seat1 = `${row}1`;
                    const seat2 = `${row}2`;
                    const seat3 = `${row}3`;
                    const seat4 = `${row}4`;

                    const isBooked1 = trip.bookedSeatNumbers.includes(seat1);
                    const isBooked2 = trip.bookedSeatNumbers.includes(seat2);
                    const isBooked3 = trip.bookedSeatNumbers.includes(seat3);
                    const isBooked4 = trip.bookedSeatNumbers.includes(seat4);

                    const isSel1 = selectedSeats.includes(seat1);
                    const isSel2 = selectedSeats.includes(seat2);
                    const isSel3 = selectedSeats.includes(seat3);
                    const isSel4 = selectedSeats.includes(seat4);

                    return (
                      <div key={row} className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBooked1}
                            onClick={() => toggleSeat(seat1)}
                            className={`h-8 w-8 rounded text-xs font-bold transition-all border ${
                              isBooked1
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                : isSel1
                                ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                                : "bg-white text-slate-800 border-slate-300 hover:border-teal-600 hover:bg-teal-50 cursor-pointer"
                            }`}
                          >
                            {seat1}
                          </button>
                          <button
                            type="button"
                            disabled={isBooked2}
                            onClick={() => toggleSeat(seat2)}
                            className={`h-8 w-8 rounded text-xs font-bold transition-all border ${
                              isBooked2
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                : isSel2
                                ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                                : "bg-white text-slate-800 border-slate-300 hover:border-teal-600 hover:bg-teal-50 cursor-pointer"
                            }`}
                          >
                            {seat2}
                          </button>
                        </div>

                        <div className="w-4 text-center text-[10px] text-slate-300">|</div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBooked3}
                            onClick={() => toggleSeat(seat3)}
                            className={`h-8 w-8 rounded text-xs font-bold transition-all border ${
                              isBooked3
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                : isSel3
                                ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                                : "bg-white text-slate-800 border-slate-300 hover:border-teal-600 hover:bg-teal-50 cursor-pointer"
                            }`}
                          >
                            {seat3}
                          </button>
                          {!isSleeper && (
                            <button
                              type="button"
                              disabled={isBooked4}
                              onClick={() => toggleSeat(seat4)}
                              className={`h-8 w-8 rounded text-xs font-bold transition-all border ${
                                isBooked4
                                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                  : isSel4
                                  ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                                  : "bg-white text-slate-800 border-slate-300 hover:border-teal-600 hover:bg-teal-50 cursor-pointer"
                              }`}
                            >
                              {seat4}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: MINIMAL CHECKOUT SUMMARY */}
            <div className="md:col-span-6 p-4 sm:p-5 bg-white space-y-4 flex flex-col justify-between">
              <form onSubmit={handleConfirmBooking} className="space-y-3">
                {/* Boarding Counter */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" /> Boarding Point
                  </Label>
                  <select
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600"
                  >
                    {trip.boardingPoints.map((pt, i) => (
                      <option key={i} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-800">Mobile Number (+880) *</Label>
                  <Input
                    type="tel"
                    placeholder="01712345678"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    required
                    className="h-10 text-xs bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl"
                  />
                </div>

                {/* Selection & Fare Box */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Seats ({selectedSeats.length}):</span>
                    <strong className="text-teal-700">
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Price:</span>
                    <strong className="text-emerald-700 text-base font-extrabold">৳ {totalFare}</strong>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={selectedSeats.length === 0}
                  className="w-full h-11 gradient-teal hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md cursor-pointer disabled:opacity-40"
                >
                  <Ticket className="h-4 w-4 mr-1" />
                  Confirm & Reserve Ticket
                </Button>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
