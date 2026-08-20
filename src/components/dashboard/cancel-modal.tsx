"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  bookingCode: string;
  bookingId: string;
  totalAmount: number;
  onCancelled: () => void;
}

export function CancelModal({
  open,
  onClose,
  bookingCode,
  bookingId,
  totalAmount,
  onCancelled,
}: CancelModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ refundAmount: number; message: string } | null>(null);

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Failed to cancel booking.");
        setLoading(false);
        return;
      }

      setResult({
        refundAmount: data.booking?.refundAmount || 0,
        message: data.message || "Booking cancelled.",
      });
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleDone = () => {
    setResult(null);
    setReason("");
    onCancelled();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-slate-900 border border-slate-200 p-0 rounded-2xl shadow-2xl">
        {result ? (
          /* Success State */
          <div className="p-6 text-center space-y-4">
            <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Booking Cancelled</h3>
            <p className="text-sm text-slate-600">{result.message}</p>
            {result.refundAmount > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-sm font-bold text-emerald-700">
                  Refund: ৳ {result.refundAmount}
                </p>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  Will be credited within 3-5 business days
                </p>
              </div>
            )}
            <Button
              onClick={handleDone}
              className="gradient-teal text-white font-bold px-6 h-10 rounded-xl shadow-md cursor-pointer"
            >
              Done
            </Button>
          </div>
        ) : (
          /* Cancel Form */
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Cancel Booking</h3>
                <p className="text-xs text-slate-500 font-semibold">{bookingCode}</p>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
              <p className="font-bold text-slate-800">Cancellation & Refund Policy</p>
              <div className="grid grid-cols-2 gap-1 text-slate-600 font-medium">
                <span>&gt; 48 hours before</span><span className="text-emerald-700 font-bold">90% refund</span>
                <span>24–48 hours before</span><span className="text-amber-700 font-bold">70% refund</span>
                <span>6–24 hours before</span><span className="text-orange-600 font-bold">40% refund</span>
                <span>&lt; 6 hours before</span><span className="text-red-600 font-bold">No refund</span>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Reason for cancellation *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please tell us why you're cancelling..."
                className="w-full h-20 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium resize-none focus:border-teal-500 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 text-sm font-bold border-slate-300 text-slate-700 rounded-xl cursor-pointer"
              >
                Keep Booking
              </Button>
              <Button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 h-10 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Cancelling...</>
                ) : (
                  "Confirm Cancel"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
