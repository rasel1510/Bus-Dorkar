"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Bus,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Operator {
  id: string;
  companyName: string;
  tradeLicenseNo: string;
  status: "PENDING" | "APPROVED" | "UNDER_REVIEW" | "SUSPENDED" | "REJECTED";
  rating: number;
  totalReviews: number;
  registeredBuses: number;
  totalTrips: number;
  ownerEmail: string;
  createdAt: string;
}

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/operators");
      const data = await res.json();
      if (data.success && data.operators) {
        setOperators(data.operators);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (operatorId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Operator status updated to ${status}`);
        setOperators((prev) =>
          prev.map((op) => (op.id === operatorId ? { ...op, status: status as any } : op))
        );
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const filteredOperators = operators.filter((op) => {
    const matchesFilter = filter === "ALL" || op.status === filter;
    const matchesSearch =
      op.companyName.toLowerCase().includes(search.toLowerCase()) ||
      op.tradeLicenseNo.toLowerCase().includes(search.toLowerCase()) ||
      op.ownerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-300 animate-pulse font-bold";
      case "UNDER_REVIEW":
        return "bg-blue-50 text-blue-800 border-blue-200 font-bold";
      case "SUSPENDED":
        return "bg-red-50 text-red-800 border-red-200 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-600" /> Bus Operator Verification Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Review company credentials, verify trade licenses, approve pending operators, and manage fleet limits.
          </p>
        </div>

        <Button
          onClick={fetchOperators}
          variant="outline"
          className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5 rounded-xl cursor-pointer shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-amber-600" /> Refresh Operators
        </Button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {message}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "PENDING", "APPROVED", "UNDER_REVIEW", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === st
                  ? "bg-amber-50 text-amber-900 border border-amber-300 font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {st === "ALL" ? "All Operators" : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company or trade license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-64 bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-3 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Operators Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs font-medium">
            Loading operator records...
          </div>
        ) : filteredOperators.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs font-medium">
            No operators match the criteria.
          </div>
        ) : (
          filteredOperators.map((op) => (
            <div
              key={op.id}
              className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-black text-amber-700 text-base shrink-0">
                    {op.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{op.companyName}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Trade License: <strong className="text-slate-800">{op.tradeLicenseNo}</strong></p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border ${getStatusBadge(op.status)}`}>
                  {op.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Registered Fleet</span>
                  <span className="text-xs font-bold text-teal-700">{op.registeredBuses} Buses</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Rating</span>
                  <span className="text-xs font-bold text-amber-700 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {op.rating} ({op.totalReviews.toLocaleString()})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Completed Trips</span>
                  <span className="text-xs font-bold text-purple-700">{op.totalTrips.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500 text-[11px] font-mono font-medium">Contact: {op.ownerEmail}</span>

                <div className="flex items-center gap-2">
                  {op.status !== "APPROVED" && (
                    <Button
                      onClick={() => updateStatus(op.id, "APPROVED")}
                      size="sm"
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Approve
                    </Button>
                  )}
                  {op.status !== "SUSPENDED" && (
                    <Button
                      onClick={() => updateStatus(op.id, "SUSPENDED")}
                      size="sm"
                      className="bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1 text-red-600" /> Suspend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
