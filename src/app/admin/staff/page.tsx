"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  ShieldCheck,
  Briefcase,
  Lock,
  Unlock,
  DollarSign,
  AlertTriangle,
  Award,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StaffRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: "COUNTER_STAFF" | "DRIVER";
  operatorName: string;
  terminal: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  dutyStatus: "ON_DUTY" | "SHIFT_ENDED" | "ACCESS_LOCKED" | "ACTIVE";
  dailyCashCollected: number;
  tripsHandled: number;
  createdAt: string;
}

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // Terminal assignment modal state
  const [terminalModalStaff, setTerminalModalStaff] = useState<StaffRecord | null>(null);
  const [newTerminal, setNewTerminal] = useState("");

  useEffect(() => {
    fetchStaff();
  }, [roleFilter]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/staff?role=${roleFilter}&query=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success && data.staff) {
        setStaffList(data.staff);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, staffId: string, payload?: any) => {
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, staffId, ...payload }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(data.message);
        fetchStaff();
        setTimeout(() => setNotice(""), 4000);
      }
    } catch {
      alert("Action failed");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStaff();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-teal-600" /> Counter Staff & Bus Driver Operations HQ
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage terminal counter staff, audit BRTA driver licenses, assign counters, and lock printing access.
          </p>
        </div>

        <Button
          onClick={fetchStaff}
          variant="outline"
          className="bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5 rounded-xl cursor-pointer shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-teal-600" /> Refresh Roster
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
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Active Counter Staff</span>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">3,840</p>
          <span className="text-[11px] text-teal-700 font-semibold mt-1 block">Across 120 Terminals</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Verified Drivers</span>
          <p className="text-2xl font-black text-purple-700 font-mono tracking-tight mt-0.5">5,120</p>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">100% BRTA License Verified</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Today's Counter Cash Sales</span>
          <p className="text-2xl font-black text-emerald-700 font-mono tracking-tight mt-0.5">৳4,48,700</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Reconciled shift cash</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Terminals Monitored</span>
          <p className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">Gabtoli & Sayedabad</p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Dhaka, CTG, Sylhet hubs</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "COUNTER_STAFF", "DRIVER"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === r
                  ? "bg-teal-50 text-teal-800 border border-teal-200 font-extrabold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {r === "ALL" ? "All Roster" : r === "COUNTER_STAFF" ? "Counter Staff" : "Bus Drivers"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, operator, or terminal..."
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

      {/* Staff Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs font-medium">
            Loading roster...
          </div>
        ) : staffList.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs font-medium">
            No personnel match the filter.
          </div>
        ) : (
          staffList.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-white text-base shrink-0 ${
                      s.role === "COUNTER_STAFF" ? "gradient-teal" : "bg-purple-700"
                    }`}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{s.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Operator: <strong className="text-slate-800">{s.operatorName}</strong>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border font-bold ${
                    s.role === "COUNTER_STAFF"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "bg-purple-50 text-purple-800 border-purple-200"
                  }`}
                >
                  {s.role}
                </span>
              </div>

              {/* Assignment Details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Assigned Hub/Route:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-teal-600" /> {s.terminal}
                  </span>
                </div>

                {s.role === "DRIVER" && (
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500 font-medium">BRTA Driver License:</span>
                    <span className="font-bold text-purple-800">{s.licenseNumber || "BRTA-DHK-99120"}</span>
                  </div>
                )}

                {s.role === "COUNTER_STAFF" && (
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500 font-medium">Today's Counter Cash Sales:</span>
                    <span className="font-bold text-emerald-700">৳{s.dailyCashCollected.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500 text-[11px] font-mono font-medium">{s.phone}</span>

                <div className="flex items-center gap-2">
                  {s.role === "COUNTER_STAFF" && (
                    <Button
                      onClick={() => {
                        setTerminalModalStaff(s);
                        setNewTerminal(s.terminal);
                      }}
                      size="sm"
                      className="bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                    >
                      <Briefcase className="h-3.5 w-3.5 mr-1 text-teal-600" /> Re-assign Terminal
                    </Button>
                  )}

                  {s.role === "DRIVER" && (
                    <Button
                      onClick={() => handleAction("VERIFY_LICENSE", s.id)}
                      size="sm"
                      className="bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 mr-1 text-purple-600" /> Verify License
                    </Button>
                  )}

                  {s.dutyStatus === "ACCESS_LOCKED" ? (
                    <Button
                      onClick={() => handleAction("TOGGLE_DUTY", s.id, { dutyStatus: "ON_DUTY" })}
                      size="sm"
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                    >
                      <Unlock className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Unlock Access
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleAction("TOGGLE_DUTY", s.id, { dutyStatus: "ACCESS_LOCKED" })}
                      size="sm"
                      className="bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 text-xs font-bold h-8 rounded-lg cursor-pointer shadow-xs"
                    >
                      <Lock className="h-3.5 w-3.5 mr-1 text-red-600" /> Lock Access
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Terminal Re-assign Modal */}
      {terminalModalStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Re-assign Counter Terminal</h3>
                <p className="text-xs text-slate-500 font-medium">Staff: {terminalModalStaff.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Terminal Location / Counter Number</label>
              <select
                value={newTerminal}
                onChange={(e) => setNewTerminal(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-3 focus:outline-none cursor-pointer"
              >
                <option value="Gabtoli Bus Terminal (Counter #04)">Gabtoli Bus Terminal (Counter #04)</option>
                <option value="Sayedabad Inter-District Terminal (Counter #12)">Sayedabad Inter-District Terminal (Counter #12)</option>
                <option value="Mohakhali Bus Terminal (Counter #08)">Mohakhali Bus Terminal (Counter #08)</option>
                <option value="Dampara Counter, Chittagong">Dampara Counter, Chittagong</option>
                <option value="Kalabagan Counter, Dhaka">Kalabagan Counter, Dhaka</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setTerminalModalStaff(null)}
                className="h-10 text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleAction("ASSIGN_TERMINAL", terminalModalStaff.id, { terminal: newTerminal });
                  setTerminalModalStaff(null);
                }}
                className="h-10 gradient-teal text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
