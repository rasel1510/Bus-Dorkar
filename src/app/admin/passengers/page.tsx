"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Gift,
  KeyRound,
  History,
  PhoneCall,
  Ban,
  ShieldAlert,
  Ticket,
  Wallet,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PassengerRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  phoneVerified: boolean;
  status: "ACTIVE" | "UNVERIFIED" | "SUSPENDED";
  walletBalance: number;
  totalBookings: number;
  preferredRoute: string;
  createdAt: string;
}

export default function AdminPassengersPage() {
  const [passengers, setPassengers] = useState<PassengerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerRecord | null>(null);

  // Voucher modal state
  const [voucherModalPassenger, setVoucherModalPassenger] = useState<PassengerRecord | null>(null);
  const [voucherAmount, setVoucherAmount] = useState(200);

  useEffect(() => {
    fetchPassengers();
  }, [statusFilter]);

  const fetchPassengers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/passengers?status=${statusFilter}&query=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success && data.passengers) {
        setPassengers(data.passengers);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, passengerId: string, payload?: any) => {
    try {
      const res = await fetch("/api/admin/passengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, passengerId, ...payload }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(data.message);
        fetchPassengers();
        setTimeout(() => setNotice(""), 4000);
      }
    } catch {
      alert("Action failed to process");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPassengers();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-600" /> Passenger Management & Customer Support HQ
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor real passengers, override phone verifications, issue delay refund vouchers, and inspect travel history.
          </p>
        </div>

        <Button
          onClick={fetchPassengers}
          variant="outline"
          className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5 rounded-xl cursor-pointer shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-teal-600" /> Refresh Passengers
        </Button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {notice}
        </div>
      )}

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Registered</span>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">2,450,890</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +14.2% month-over-month
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Mobile OTP Verified</span>
          <p className="text-2xl font-black text-teal-700 font-mono tracking-tight mt-0.5">96.4%</p>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">Clean anti-spam roster</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Promo Wallet Issued</span>
          <p className="text-2xl font-black text-purple-700 font-mono tracking-tight mt-0.5">৳14,50,000</p>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Compensation & discounts</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Avg Travel Frequency</span>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">4.2 Trips/Mo</p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Inter-district commuters</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "ACTIVE", "UNVERIFIED", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-teal-50 text-teal-800 border border-teal-200 font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-3 rounded-xl focus:outline-none focus:border-teal-600 font-medium"
            />
          </div>
          <Button type="submit" variant="outline" className="h-9 px-3 bg-white border-slate-200 text-xs text-slate-700 font-semibold cursor-pointer">
            Filter
          </Button>
        </form>
      </div>

      {/* Passenger List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Passenger Name</th>
                <th className="px-5 py-3.5">Mobile & Email</th>
                <th className="px-5 py-3.5">Verification</th>
                <th className="px-5 py-3.5">Bookings & Wallet</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Industry Support Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-medium">
                    Loading passenger records...
                  </td>
                </tr>
              ) : passengers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-medium">
                    No passengers found matching filter.
                  </td>
                </tr>
              ) : (
                passengers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl gradient-teal text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono">
                      <p className="font-bold text-slate-900 text-xs">{p.phone}</p>
                      <p className="text-[11px] text-slate-500">{p.email || "No Email Registered"}</p>
                    </td>

                    <td className="px-5 py-4">
                      {p.phoneVerified ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> OTP Verified
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleAction("VERIFY_PHONE", p.id)}
                          size="sm"
                          className="bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 text-[10px] font-bold h-7 px-2 rounded-lg cursor-pointer"
                        >
                          <PhoneCall className="h-3 w-3 mr-1 text-amber-700" /> Verify Phone
                        </Button>
                      )}
                    </td>

                    <td className="px-5 py-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Ticket className="h-3.5 w-3.5 text-teal-600" />
                        <span className="font-bold text-slate-900">{p.totalBookings} Trips</span>
                      </div>
                      <div className="text-[11px] text-purple-700 font-bold mt-0.5 flex items-center gap-1">
                        <Wallet className="h-3 w-3" /> Wallet: ৳{p.walletBalance}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border font-bold ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : p.status === "SUSPENDED"
                            ? "bg-red-50 text-red-800 border-red-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Issue Voucher */}
                        <Button
                          onClick={() => setVoucherModalPassenger(p)}
                          size="sm"
                          className="bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 text-[11px] font-bold h-8 px-2.5 rounded-lg cursor-pointer shadow-xs"
                          title="Issue Refund / Compensation Credit"
                        >
                          <Gift className="h-3.5 w-3.5 mr-1 text-purple-600" /> Issue Voucher
                        </Button>

                        {/* Reset Password */}
                        <Button
                          onClick={() => handleAction("TRIGGER_PASSWORD_RESET", p.id)}
                          size="sm"
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-[11px] font-semibold h-8 px-2.5 rounded-lg cursor-pointer"
                          title="Send Password Reset SMS"
                        >
                          <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                        </Button>

                        {/* Travel History Drawer */}
                        <Button
                          onClick={() => setSelectedPassenger(p)}
                          size="sm"
                          variant="outline"
                          className="bg-white border-slate-200 text-teal-700 hover:bg-teal-50 text-[11px] font-semibold h-8 px-2.5 rounded-lg cursor-pointer"
                          title="View Travel History"
                        >
                          <History className="h-3.5 w-3.5 text-teal-600" />
                        </Button>

                        {/* Suspend / Unsuspend */}
                        {p.status === "ACTIVE" ? (
                          <Button
                            onClick={() => handleAction("TOGGLE_STATUS", p.id, { status: "SUSPENDED" })}
                            size="sm"
                            className="bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 text-[11px] font-bold h-8 px-2.5 rounded-lg cursor-pointer shadow-xs"
                            title="Block / Suspend Passenger"
                          >
                            <Ban className="h-3.5 w-3.5 text-red-600" /> Suspend
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleAction("TOGGLE_STATUS", p.id, { status: "ACTIVE" })}
                            size="sm"
                            className="bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold h-8 px-2.5 rounded-lg cursor-pointer shadow-xs"
                          >
                            Unsuspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Issue Modal */}
      {voucherModalPassenger && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Issue Wallet Compensation Voucher</h3>
                <p className="text-xs text-slate-500 font-medium">Passenger: {voucherModalPassenger.name} ({voucherModalPassenger.phone})</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Voucher Credit Amount (BDT ৳)</label>
              <Input
                type="number"
                value={voucherAmount}
                onChange={(e) => setVoucherAmount(Number(e.target.value))}
                className="h-11 bg-slate-50 border-slate-200 text-sm font-mono font-bold text-slate-900 rounded-xl"
              />
              <p className="text-[11px] text-slate-500">
                Grant credit for schedule delays, bus cancellation compensation, or loyalty promotions.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setVoucherModalPassenger(null)}
                className="h-10 text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleAction("ISSUE_VOUCHER", voucherModalPassenger.id, { voucherAmount });
                  setVoucherModalPassenger(null);
                }}
                className="h-10 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Confirm ৳{voucherAmount} Credit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Travel History Modal */}
      {selectedPassenger && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedPassenger.name}'s Travel Record</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedPassenger.phone} | {selectedPassenger.email || "No Email"}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedPassenger(null)} className="text-xs font-bold">
                Close
              </Button>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Frequent Route:</span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" /> {selectedPassenger.preferredRoute}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Completed Bookings:</span>
                <span className="font-bold text-slate-900">{selectedPassenger.totalBookings} Trips</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Wallet Balance:</span>
                <span className="font-bold text-purple-700">৳{selectedPassenger.walletBalance}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button onClick={() => setSelectedPassenger(null)} className="gradient-teal text-white text-xs font-bold h-9 px-4 rounded-xl cursor-pointer">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
