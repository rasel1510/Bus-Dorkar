"use client";

import { useState } from "react";
import {
  Bus,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  XCircle,
  Sparkles,
  SlidersHorizontal,
  Wifi,
  Zap,
  RotateCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BusItem {
  id: string;
  registration: string;
  manufacturer: string;
  model: string;
  year: number;
  type: "AC_EXECUTIVE" | "AC_BUSINESS" | "NON_AC_DELUXE" | "SLEEPER_COACH" | "DOUBLE_DECKER";
  totalSeats: number;
  hasAC: boolean;
  hasWiFi: boolean;
  hasCharging: boolean;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE" | "RETIRED";
  lastMaintenanceDate: string;
}

const INITIAL_BUSES: BusItem[] = [
  {
    id: "BUS-01",
    registration: "Dhaka Metro-B 14-8891",
    manufacturer: "Scania",
    model: "Touring K410IB Multi-Axle",
    year: 2024,
    type: "AC_EXECUTIVE",
    totalSeats: 36,
    hasAC: true,
    hasWiFi: true,
    hasCharging: true,
    status: "ACTIVE",
    lastMaintenanceDate: "2026-07-28",
  },
  {
    id: "BUS-02",
    registration: "Dhaka Metro-B 15-2234",
    manufacturer: "Volvo",
    model: "B11R 9600 Multi-Axle",
    year: 2024,
    type: "AC_BUSINESS",
    totalSeats: 36,
    hasAC: true,
    hasWiFi: true,
    hasCharging: true,
    status: "ACTIVE",
    lastMaintenanceDate: "2026-08-01",
  },
  {
    id: "BUS-03",
    registration: "Dhaka Metro-B 18-3321",
    manufacturer: "Scania",
    model: "Double Decker Luxury Sleeper",
    year: 2025,
    type: "SLEEPER_COACH",
    totalSeats: 28,
    hasAC: true,
    hasWiFi: true,
    hasCharging: true,
    status: "ACTIVE",
    lastMaintenanceDate: "2026-08-10",
  },
  {
    id: "BUS-04",
    registration: "Dhaka Metro-B 12-9901",
    manufacturer: "Scania",
    model: "Touring K360IB VIP",
    year: 2023,
    type: "AC_EXECUTIVE",
    totalSeats: 36,
    hasAC: true,
    hasWiFi: true,
    hasCharging: true,
    status: "ACTIVE",
    lastMaintenanceDate: "2026-07-15",
  },
  {
    id: "BUS-05",
    registration: "Dhaka Metro-B 16-7782",
    manufacturer: "Hino",
    model: "1J Plus Deluxe Coach",
    year: 2023,
    type: "NON_AC_DELUXE",
    totalSeats: 40,
    hasAC: false,
    hasWiFi: false,
    hasCharging: true,
    status: "MAINTENANCE",
    lastMaintenanceDate: "2026-08-12",
  },
  {
    id: "BUS-06",
    registration: "Dhaka Metro-B 14-5510",
    manufacturer: "Volvo",
    model: "B9R Executive Coach",
    year: 2022,
    type: "AC_BUSINESS",
    totalSeats: 36,
    hasAC: true,
    hasWiFi: false,
    hasCharging: true,
    status: "ACTIVE",
    lastMaintenanceDate: "2026-06-30",
  },
  {
    id: "BUS-07",
    registration: "Dhaka Metro-B 11-4402",
    manufacturer: "Hino",
    model: "AK1J High-Deck",
    year: 2021,
    type: "NON_AC_DELUXE",
    totalSeats: 40,
    hasAC: false,
    hasWiFi: false,
    hasCharging: false,
    status: "INACTIVE",
    lastMaintenanceDate: "2026-05-18",
  },
];

export default function OperatorBusesPage() {
  const [buses, setBuses] = useState<BusItem[]>(INITIAL_BUSES);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Add Bus Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    registration: "",
    manufacturer: "Scania",
    model: "",
    year: 2025,
    type: "AC_EXECUTIVE" as BusItem["type"],
    totalSeats: 36,
    hasAC: true,
    hasWiFi: true,
    hasCharging: true,
  });

  const toggleStatus = (id: string) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const next =
          b.status === "ACTIVE"
            ? "MAINTENANCE"
            : b.status === "MAINTENANCE"
            ? "INACTIVE"
            : "ACTIVE";
        return { ...b, status: next };
      })
    );
  };

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBus.registration || !newBus.model) return;

    const created: BusItem = {
      id: `BUS-${String(buses.length + 1).padStart(2, "0")}`,
      registration: newBus.registration,
      manufacturer: newBus.manufacturer,
      model: newBus.model,
      year: Number(newBus.year),
      type: newBus.type,
      totalSeats: Number(newBus.totalSeats),
      hasAC: newBus.hasAC,
      hasWiFi: newBus.hasWiFi,
      hasCharging: newBus.hasCharging,
      status: "ACTIVE",
      lastMaintenanceDate: new Date().toISOString().split("T")[0],
    };

    setBuses([created, ...buses]);
    setAddModalOpen(false);
    setNewBus({
      registration: "",
      manufacturer: "Scania",
      model: "",
      year: 2025,
      type: "AC_EXECUTIVE",
      totalSeats: 36,
      hasAC: true,
      hasWiFi: true,
      hasCharging: true,
    });
  };

  const filtered = buses.filter((b) => {
    const matchSearch =
      b.registration.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase()) ||
      b.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || b.type === filterType;
    const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bus Fleet Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            BRTA vehicle registrations, maintenance scheduling, and seating capacity control.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="gradient-teal text-white font-semibold text-xs h-9 rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Bus to Fleet
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search registration, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Coach Types</option>
            <option value="AC_EXECUTIVE">AC Executive</option>
            <option value="AC_BUSINESS">AC Business</option>
            <option value="SLEEPER_COACH">Sleeper Coach</option>
            <option value="NON_AC_DELUXE">Non-AC Deluxe</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Registration</th>
                <th className="p-3.5">Chassis & Model</th>
                <th className="p-3.5">Class / Category</th>
                <th className="p-3.5">Seats</th>
                <th className="p-3.5">Facilities</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    <div>{bus.registration}</div>
                    <div className="text-[10px] text-slate-400 font-normal">ID: {bus.id}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900">{bus.model}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {bus.manufacturer} • Mfd. {bus.year}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-[10px] font-mono border-slate-300">
                      {bus.type}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {bus.totalSeats} Seats
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      {bus.hasAC && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                          AC
                        </span>
                      )}
                      {bus.hasWiFi && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Wi-Fi
                        </span>
                      )}
                      {bus.hasCharging && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                          USB
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <Badge
                      className={`text-[10px] font-semibold ${
                        bus.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : bus.status === "MAINTENANCE"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {bus.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => toggleStatus(bus.id)}
                      className="h-7 text-[11px] font-semibold text-teal-700 hover:text-teal-900 px-2.5"
                    >
                      Cycle Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bus className="w-5 h-5 text-teal-600" />
              Register New Coach to Fleet
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Aligned with Section 18: Enter official BRTA registration details and seating layout.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBus} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                BRTA Registration Plate Number *
              </label>
              <Input
                required
                placeholder="e.g. Dhaka Metro-B 19-4412"
                value={newBus.registration}
                onChange={(e) => setNewBus({ ...newBus, registration: e.target.value })}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Manufacturer</label>
                <select
                  value={newBus.manufacturer}
                  onChange={(e) => setNewBus({ ...newBus, manufacturer: e.target.value })}
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-xs font-medium text-slate-800"
                >
                  <option value="Scania">Scania</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Hino">Hino</option>
                  <option value="Ashok Leyland">Ashok Leyland</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Model Name *</label>
                <Input
                  required
                  placeholder="e.g. Touring K410IB"
                  value={newBus.model}
                  onChange={(e) => setNewBus({ ...newBus, model: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={newBus.type}
                  onChange={(e) => setNewBus({ ...newBus, type: e.target.value as any })}
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-xs font-medium text-slate-800"
                >
                  <option value="AC_EXECUTIVE">AC Executive</option>
                  <option value="AC_BUSINESS">AC Business</option>
                  <option value="SLEEPER_COACH">Sleeper Coach</option>
                  <option value="NON_AC_DELUXE">Non-AC Deluxe</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Total Seats</label>
                <Input
                  type="number"
                  min={18}
                  max={50}
                  value={newBus.totalSeats}
                  onChange={(e) => setNewBus({ ...newBus, totalSeats: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-4 text-xs font-medium text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newBus.hasAC}
                  onChange={(e) => setNewBus({ ...newBus, hasAC: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Air Conditioned
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newBus.hasWiFi}
                  onChange={(e) => setNewBus({ ...newBus, hasWiFi: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Wi-Fi System
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newBus.hasCharging}
                  onChange={(e) => setNewBus({ ...newBus, hasCharging: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                USB Charging
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="gradient-teal text-white h-9 text-xs font-semibold px-4">
                Save & Register Coach
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
