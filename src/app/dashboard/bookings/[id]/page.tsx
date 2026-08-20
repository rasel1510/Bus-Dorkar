"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TicketView } from "@/components/dashboard/ticket-view";
import { CancelModal } from "@/components/dashboard/cancel-modal";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  XCircle,
  Printer,
} from "lucide-react";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [resolvedParams.id]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${resolvedParams.id}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking(data.booking);
      } else {
        setError(data.error || "Booking not found");
      }
    } catch {
      setError("Failed to load booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelled = () => {
    fetchBooking();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
          <p className="text-sm text-slate-500 font-medium mt-2">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <XCircle className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">{error || "Booking not found"}</h3>
          <Link href="/dashboard/bookings">
            <Button variant="outline" className="text-xs font-bold cursor-pointer">
              Back to Bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          {booking.status === "CONFIRMED" && (
            <Button
              onClick={() => setShowCancelModal(true)}
              variant="outline"
              className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 cursor-pointer h-8 px-3"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Cancel
            </Button>
          )}
          <Button
            onClick={handlePrint}
            variant="outline"
            className="text-xs font-bold border-slate-200 cursor-pointer h-8 px-3"
          >
            <Printer className="h-3.5 w-3.5 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Ticket */}
      <TicketView ticket={booking} />

      {/* Cancellation Info (if cancelled) */}
      {booking.status === "CANCELLED" && booking.cancellationReason && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1.5">
          <h4 className="text-xs font-bold text-red-700">Cancellation Details</h4>
          <p className="text-xs text-red-600 font-medium">Reason: {booking.cancellationReason}</p>
          {booking.refundAmount !== null && booking.refundAmount > 0 && (
            <p className="text-xs text-emerald-700 font-bold">
              Refund Amount: ৳ {booking.refundAmount}
            </p>
          )}
          {booking.cancelledAt && (
            <p className="text-[11px] text-red-500">
              Cancelled on: {new Date(booking.cancelledAt).toLocaleString("en-BD")}
            </p>
          )}
        </div>
      )}

      {/* Cancel Modal */}
      <CancelModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        bookingCode={booking.bookingCode}
        bookingId={booking.id}
        totalAmount={booking.totalAmount}
        onCancelled={handleCancelled}
      />
    </div>
  );
}
