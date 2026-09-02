"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusTrip } from "@/lib/data/buses";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
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
  Ticket,
  ChevronRight,
  Sparkles,
  Loader2,
  CreditCard,
  AlertCircle,
} from "lucide-react";

interface SeatSelectorModalProps {
  trip: BusTrip | null;
  open: boolean;
  onClose: () => void;
  dateStr?: string;
}

const PAYMENT_METHODS = [
  { value: "BKASH", labelEn: "bKash", labelBn: "বিকাশ", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { value: "NAGAD", labelEn: "Nagad", labelBn: "নগদ", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { value: "CARD", labelEn: "Card", labelBn: "কার্ড", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { value: "COUNTER_CASH", labelEn: "Counter", labelBn: "কাউন্টার", color: "bg-slate-50 border-slate-200 text-slate-700" },
];

export function SeatSelectorModal({
  trip,
  open,
  onClose,
  dateStr = "Today",
}: SeatSelectorModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { language, t, tNum, tCurrency, tDistrict } = useLanguage();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState<string>("");
  const [droppingPoint, setDroppingPoint] = useState<string>("");
  const [passengerName, setPassengerName] = useState<string>("");
  const [passengerPhone, setPassengerPhone] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("BKASH");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [liveBookedSeats, setLiveBookedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !trip) return;

    const fetchLiveSeats = () => {
      fetch(`/api/trips/booked-seats?tripId=${trip.id}&date=${encodeURIComponent(dateStr)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.bookedSeats)) {
            setLiveBookedSeats(data.bookedSeats);
          }
        })
        .catch(() => {});
    };

    fetchLiveSeats();
    const intervalId = setInterval(fetchLiveSeats, 3000);
    return () => clearInterval(intervalId);
  }, [open, trip, dateStr]);

  if (!trip) return null;

  const allBookedSeats = Array.from(
    new Set([...(trip.bookedSeatNumbers || []), ...liveBookedSeats])
  );
  const availableSeatsCount = Math.max(0, trip.totalSeats - allBookedSeats.length);

  // Seat rows remain standard English alphanumeric A-I as specified
  const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const isSleeper = trip.seatLayout === "SLEEPER";

  const toggleSeat = (seatId: string) => {
    if (allBookedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 4) {
        setError(t("modal_max_seats_error"));
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
      setError("");
    }
  };

  const totalFare = selectedSeats.length * trip.fareBDT;

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      setError(language === "bn" ? "কমপক্ষে একটি সিট নির্বাচন করুন।" : "Please select at least 1 seat.");
      return;
    }
    if (!passengerName.trim() || !passengerPhone.trim()) {
      setError(t("modal_name_phone_required"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          operatorId: trip.operatorId,
          operatorName: trip.operatorName,
          fromDistrict: trip.fromDistrictName,
          toDistrict: trip.toDistrictName,
          seatIds: selectedSeats,
          passengerName: passengerName.trim(),
          passengerPhone: passengerPhone.trim(),
          paymentMethod,
          boardingPoint: boardingPoint || trip.boardingPoints[0],
          droppingPoint: droppingPoint || trip.droppingPoints[0],
          travelDate: dateStr,
          farePerSeat: trip.fareBDT,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || (language === "bn" ? "বুকিং সম্পন্ন হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।" : "Booking failed. Please try again."));
        setIsLoading(false);
        return;
      }

      setBookingRef(data.booking.bookingCode);
      setBookingId(data.booking.id);
      setIsSuccess(true);
    } catch {
      setError(language === "bn" ? "নেটওয়ার্ক সমস্যা। দয়া করে সংযোগ পরীক্ষা করুন।" : "Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSelectedSeats([]);
    setIsSuccess(false);
    setError("");
    setPassengerName("");
    setPassengerPhone("");
    setPaymentMethod("BKASH");
    setBoardingPoint("");
    setDroppingPoint("");
    onClose();
  };

  const handleViewTicket = () => {
    handleResetAndClose();
    router.push(`/dashboard/bookings/${bookingId}`);
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
              <span>{tDistrict(trip.fromDistrictName)}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span>{tDistrict(trip.toDistrictName)}</span>
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-semibold block">
              {t("fare_per_seat")}
            </span>
            <span className="text-lg font-extrabold text-emerald-700">
              {tCurrency(trip.fareBDT)}
            </span>
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
                <Sparkles className="h-3 w-3" /> {t("modal_booking_success")}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {t("modal_ticket_ref")}: {bookingRef}
              </h3>
            </div>

            <div className="max-w-sm mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">{language === "bn" ? "রুট:" : "Route:"}</span>
                <strong className="text-slate-900">{tDistrict(trip.fromDistrictName)} ➔ {tDistrict(trip.toDistrictName)}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">{language === "bn" ? "তারিখ:" : "Date:"}</span>
                <strong className="text-slate-900">{dateStr}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">{language === "bn" ? "সিট নম্বর:" : "Seats:"}</span>
                {/* Seat plan alphanumeric codes A1, A2 remain exempted as per requirement */}
                <strong className="text-teal-700 font-bold">{selectedSeats.join(", ")}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">{language === "bn" ? "যাত্রী:" : "Passenger:"}</span>
                <strong className="text-slate-900">{passengerName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600">{language === "bn" ? "পেমেন্ট:" : "Payment:"}</span>
                <strong className="text-slate-900">{paymentMethod.replace("_", " ")}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-700 font-bold">{t("modal_total_fare")}:</span>
                <strong className="text-emerald-700 text-sm font-extrabold">{tCurrency(totalFare)}</strong>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleViewTicket}
                className="gradient-teal text-white font-bold px-5 h-10 rounded-xl shadow-md cursor-pointer"
              >
                <Ticket className="h-4 w-4 mr-1.5" />
                {t("modal_view_ticket")}
              </Button>
              <Button
                onClick={handleResetAndClose}
                variant="outline"
                className="font-bold px-5 h-10 rounded-xl border-slate-300 cursor-pointer"
              >
                {t("modal_close")}
              </Button>
            </div>
          </div>
        ) : (
          /* SEAT SELECTOR LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* LEFT: BUS SEAT MAP */}
            <div className="md:col-span-5 p-4 sm:p-5 bg-slate-50 border-r border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Armchair className="h-3.5 w-3.5 text-teal-600" /> {t("modal_select_seats")}
                </span>
                <span className="font-semibold text-emerald-700">
                  {tNum(availableSeatsCount)} {t("modal_available")}
                </span>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-around bg-white p-2 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded bg-white border border-slate-300"></div>
                  <span>{t("modal_available")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded bg-teal-600 text-white flex items-center justify-center text-[8px] font-bold">✓</div>
                  <span>{t("modal_selected")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded bg-slate-200 border border-slate-300"></div>
                  <span>{t("modal_booked")}</span>
                </div>
              </div>

              {/* Seats Interior Grid - Standard English alphanumeric codes A1, A2 strictly preserved */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 max-w-[240px] mx-auto shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-[10px] font-bold text-slate-500">
                  <span>{t("modal_front")}</span>
                  <span>{t("modal_driver")}</span>
                </div>

                <div className="space-y-2">
                  {rowLetters.map((row) => {
                    const seat1 = `${row}1`;
                    const seat2 = `${row}2`;
                    const seat3 = `${row}3`;
                    const seat4 = `${row}4`;

                    const isBooked1 = allBookedSeats.includes(seat1);
                    const isBooked2 = allBookedSeats.includes(seat2);
                    const isBooked3 = allBookedSeats.includes(seat3);
                    const isBooked4 = allBookedSeats.includes(seat4);

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

            {/* RIGHT: CHECKOUT FORM */}
            <div className="md:col-span-7 p-4 sm:p-5 bg-white space-y-3 flex flex-col justify-between">
              <form onSubmit={handleConfirmBooking} className="space-y-3">
                {/* Passenger Name */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-800">
                    {t("modal_full_name")} *
                  </Label>
                  <Input
                    type="text"
                    placeholder={language === "bn" ? "যাত্রীর পূর্ণ নাম লিখুন" : "Enter full name"}
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    required
                    className="h-10 text-xs bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-800">
                    {t("modal_phone_number")} *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="01712345678"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    required
                    className="h-10 text-xs bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl"
                  />
                </div>

                {/* Boarding + Dropping Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-600" /> {t("modal_boarding_point")}
                    </Label>
                    <select
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 cursor-pointer"
                    >
                      {trip.boardingPoints.map((pt, i) => (
                        <option key={i} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-red-500" /> {t("modal_dropping_point")}
                    </Label>
                    <select
                      value={droppingPoint}
                      onChange={(e) => setDroppingPoint(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:border-teal-600 cursor-pointer"
                    >
                      {trip.droppingPoints.map((pt, i) => (
                        <option key={i} value={pt}>{pt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-teal-600" /> {t("modal_payment_method")}
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm.value}
                        type="button"
                        onClick={() => setPaymentMethod(pm.value)}
                        className={`px-2 py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          paymentMethod === pm.value
                            ? "bg-teal-50 border-teal-400 text-teal-700 shadow-sm"
                            : pm.color + " hover:border-teal-300"
                        }`}
                      >
                        {language === "bn" ? pm.labelBn : pm.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selection & Fare Box */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{t("modal_selected_seats_label")} ({tNum(selectedSeats.length)}):</span>
                    {/* Alphanumeric seat codes A1, A2 remain intact */}
                    <strong className="text-teal-700 font-bold">
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : (language === "bn" ? "কোনটি নয়" : "None")}
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>{t("modal_total_fare")}:</span>
                    <strong className="text-emerald-700 text-base font-extrabold">{tCurrency(totalFare)}</strong>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={selectedSeats.length === 0 || isLoading}
                  className="w-full h-11 gradient-teal hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-md cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> {t("modal_processing")}</>
                  ) : (
                    <><Ticket className="h-4 w-4 mr-1" /> {t("modal_confirm_booking")} ({tCurrency(totalFare)})</>
                  )}
                </Button>

                {!user && (
                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    {language === "bn"
                      ? "লগইন না থাকলেও ডেমো বুকিং তৈরি হবে।"
                      : "Not logged in? Your booking will still be created for demo purposes."}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
