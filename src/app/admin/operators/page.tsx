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
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "PENDING":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse";
      case "UNDER_REVIEW":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "SUSPENDED":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-400" /> Bus Operator Verification Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Review company credentials, verify trade licenses, approve pending operators, and manage fleet limits.
          </p>
        </div>

        <Button
          onClick={fetchOperators}
          variant="outline"
          className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white text-xs font-semibold h-9 px-3 rounded-xl cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Refresh Operators
        </Button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "PENDING", "APPROVED", "UNDER_REVIEW", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === st
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              {st === "ALL" ? "All Operators" : st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by company or trade license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-64 bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 pl-9 pr-3 rounded-xl focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Operators Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs font-mono">
            Loading operator records...
          </div>
        ) : filteredOperators.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs font-mono">
            No operators match the criteria.
          </div>
        ) : (
          filteredOperators.map((op) => (
            <div
              key={op.id}
              className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-base shrink-0">
                    {op.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{op.companyName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Trade License: <strong className="text-slate-200">{op.tradeLicenseNo}</strong></p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border font-bold ${getStatusBadge(op.status)}`}>
                  {op.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Registered Fleet</span>
                  <span className="text-xs font-bold text-teal-400">{op.registeredBuses} Buses</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Rating</span>
                  <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {op.rating} ({op.totalReviews.toLocaleString()})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Completed Trips</span>
                  <span className="text-xs font-bold text-purple-400">{op.totalTrips.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400 text-[11px] font-mono">Contact: {op.ownerEmail}</span>

                <div className="flex items-center gap-2">
                  {op.status !== "APPROVED" && (
                    <Button
                      onClick={() => updateStatus(op.id, "APPROVED")}
                      size="sm"
                      className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold h-8 rounded-lg cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                  )}
                  {op.status !== "SUSPENDED" && (
                    <Button
                      onClick={() => updateStatus(op.id, "SUSPENDED")}
                      size="sm"
                      className="bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 text-xs font-bold h-8 rounded-lg cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Suspend
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
