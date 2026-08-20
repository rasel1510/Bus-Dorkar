"use client";

import { useState, useEffect } from "react";
import { CreditCard, Hash, Calendar, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentItem {
  id: string;
  bookingCode: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success && data.bookings) {
        const list: PaymentItem[] = data.bookings.map((b: any) => ({
          id: b.id,
          bookingCode: b.bookingCode,
          amount: b.totalAmount,
          paymentMethod: b.paymentMethod,
          paymentStatus: b.paymentStatus,
          transactionId: b.transactionId,
          createdAt: b.createdAt,
        }));
        setPayments(list);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Payment History</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          View all transactions made on Bus Dorkar
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
          <CreditCard className="h-8 w-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No transactions found</h3>
          <p className="text-xs text-slate-500">Your payment receipts will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.bookingCode}</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          p.paymentStatus === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.paymentStatus === "REFUNDED"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {p.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                      <span>{p.paymentMethod.replace("_", " ")}</span>
                      {p.transactionId && (
                        <span className="font-mono text-slate-400">TrxID: {p.transactionId}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-emerald-700">৳ {p.amount}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
