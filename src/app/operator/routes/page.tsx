"use client";

import { useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Clock,
  Navigation,
  ArrowRight,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
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

interface OperatorRouteItem {
  id: string;
  fromName: string;
  toName: string;
  highway: string;
  distanceKm: number;
  durationHours: string;
  intermediateStops: string[];
  baseFareBDT: number;
  schedules: { time: string; busType: string; fare: number }[];
  status: "ACTIVE" | "SUSPENDED";
}

const INITIAL_ROUTES: OperatorRouteItem[] = [
  {
    id: "RT-01",
    fromName: "Dhaka",
    toName: "Chattogram",
    highway: "N1 Dhaka-Chattogram Expressway",
    distanceKm: 248,
    durationHours: "5h 15m",
    intermediateStops: ["Kanchpur Bridge", "Cumilla Cantonment", "Feni Bypass"],
    baseFareBDT: 1300,
    status: "ACTIVE",
    schedules: [
      { time: "06:30 AM", busType: "Scania Multi-Axle", fare: 1300 },
      { time: "08:00 AM", busType: "Volvo B11R", fare: 1250 },
      { time: "11:30 AM", busType: "Scania Multi-Axle", fare: 1300 },
      { time: "03:30 PM", busType: "Scania Multi-Axle", fare: 1300 },
      { time: "10:30 PM", busType: "Double Decker Sleeper", fare: 1800 },
      { time: "11:45 PM", busType: "Scania Multi-Axle", fare: 1300 },
    ],
  },
  {
    id: "RT-02",
    fromName: "Dhaka",
    toName: "Cox's Bazar",
    highway: "N1 Highway & Marine Expressway",
    distanceKm: 395,
    durationHours: "8h 45m",
    intermediateStops: ["Cumilla", "Feni", "Chattogram Bypass", "Chakaria"],
    baseFareBDT: 1800,
    status: "ACTIVE",
    schedules: [
      { time: "08:00 AM", busType: "Scania Multi-Axle", fare: 1800 },
      { time: "08:30 PM", busType: "Double Decker Sleeper", fare: 2200 },
      { time: "10:00 PM", busType: "Scania Multi-Axle", fare: 1800 },
      { time: "11:15 PM", busType: "Double Decker Sleeper", fare: 2200 },
    ],
  },
  {
    id: "RT-03",
    fromName: "Dhaka",
    toName: "Sylhet",
    highway: "N2 Dhaka-Sylhet National Highway",
    distanceKm: 236,
    durationHours: "5h 30m",
    intermediateStops: ["Narsingdi", "Bhairab", "Brahmanbaria", "Shaistaganj"],
    baseFareBDT: 1200,
    status: "ACTIVE",
    schedules: [
      { time: "07:15 AM", busType: "Scania Touring", fare: 1200 },
      { time: "10:30 AM", busType: "Scania Touring", fare: 1200 },
      { time: "02:00 PM", busType: "Scania Touring", fare: 1200 },
      { time: "09:30 PM", busType: "Scania Touring", fare: 1200 },
    ],
  },
  {
    id: "RT-04",
    fromName: "Dhaka",
    toName: "Rajshahi",
    highway: "N5 Jamuna Bridge Expressway",
    distanceKm: 256,
    durationHours: "5h 45m",
    intermediateStops: ["Chandra", "Tangail", "Sirajganj", "Natore"],
    baseFareBDT: 1100,
    status: "ACTIVE",
    schedules: [
      { time: "08:00 AM", busType: "Scania Multi-Axle", fare: 1100 },
      { time: "01:30 PM", busType: "Scania Multi-Axle", fare: 1100 },
      { time: "10:00 PM", busType: "Scania Multi-Axle", fare: 1100 },
    ],
  },
];

export default function OperatorRoutesPage() {
  const [routes, setRoutes] = useState<OperatorRouteItem[]>(INITIAL_ROUTES);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    fromName: "Dhaka",
    toName: "",
    highway: "",
    distanceKm: 250,
    durationHours: "5h 00m",
    intermediateStops: "",
    baseFareBDT: 1000,
  });

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoute.toName) return;

    const stops = newRoute.intermediateStops
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const created: OperatorRouteItem = {
      id: `RT-${String(routes.length + 1).padStart(2, "0")}`,
      fromName: newRoute.fromName,
      toName: newRoute.toName,
      highway: newRoute.highway || "National Highway Corridor",
      distanceKm: Number(newRoute.distanceKm),
      durationHours: newRoute.durationHours,
      intermediateStops: stops.length > 0 ? stops : ["Direct Non-stop"],
      baseFareBDT: Number(newRoute.baseFareBDT),
      status: "ACTIVE",
      schedules: [
        { time: "08:00 AM", busType: "Scania Multi-Axle", fare: Number(newRoute.baseFareBDT) },
        { time: "09:30 PM", busType: "Scania Multi-Axle", fare: Number(newRoute.baseFareBDT) },
      ],
    };

    setRoutes([created, ...routes]);
    setAddModalOpen(false);
    setNewRoute({
      fromName: "Dhaka",
      toName: "",
      highway: "",
      distanceKm: 250,
      durationHours: "5h 00m",
      intermediateStops: "",
      baseFareBDT: 1000,
    });
  };

  const filtered = routes.filter(
    (r) =>
      r.fromName.toLowerCase().includes(search.toLowerCase()) ||
      r.toName.toLowerCase().includes(search.toLowerCase()) ||
      r.highway.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Route & Timetable Schedules
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Inter-district corridors, departure time slots, intermediate stops, and base fares.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="gradient-teal text-white font-semibold text-xs h-9 rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Route
        </Button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search route origin, destination, or highway..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50"
          />
        </div>
        <Badge variant="outline" className="text-xs font-mono border-slate-200 hidden sm:inline">
          {filtered.length} Active Corridors
        </Badge>
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        {filtered.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>{route.fromName}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span>{route.toName}</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    {route.highway} • {route.distanceKm} km • Approx. {route.durationHours}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Base Fare</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  ৳{route.baseFareBDT}
                </span>
              </div>
            </div>

            {/* Intermediate Stops */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Intermediate Stoppages & Boarding Points
              </span>
              <div className="flex flex-wrap gap-1.5">
                {route.intermediateStops.map((stop, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    {idx + 1}. {stop}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Schedule Departures */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Active Daily Departures ({route.schedules.length} slots)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                {route.schedules.map((sched, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-0.5"
                  >
                    <span className="font-mono font-black text-slate-900 block text-xs">
                      {sched.time}
                    </span>
                    <span className="text-[10px] text-teal-700 font-medium truncate block">
                      {sched.busType.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block">
                      ৳{sched.fare}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Route Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-600" />
              Add New Route Corridor
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Aligned with Section 19: Define origin, destination, distance, and base fare.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoute} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Origin City</label>
                <Input
                  required
                  value={newRoute.fromName}
                  onChange={(e) => setNewRoute({ ...newRoute, fromName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Destination *</label>
                <Input
                  required
                  placeholder="e.g. Barishal"
                  value={newRoute.toName}
                  onChange={(e) => setNewRoute({ ...newRoute, toName: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Highway Corridor</label>
              <Input
                placeholder="e.g. N8 Padma Bridge Expressway"
                value={newRoute.highway}
                onChange={(e) => setNewRoute({ ...newRoute, highway: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Distance (Km)</label>
                <Input
                  type="number"
                  value={newRoute.distanceKm}
                  onChange={(e) => setNewRoute({ ...newRoute, distanceKm: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Duration</label>
                <Input
                  value={newRoute.durationHours}
                  onChange={(e) => setNewRoute({ ...newRoute, durationHours: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Base Fare (৳)</label>
                <Input
                  type="number"
                  value={newRoute.baseFareBDT}
                  onChange={(e) => setNewRoute({ ...newRoute, baseFareBDT: Number(e.target.value) })}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Intermediate Stoppages (comma separated)
              </label>
              <Input
                placeholder="e.g. Bhanga, Madaripur, Gournadi"
                value={newRoute.intermediateStops}
                onChange={(e) => setNewRoute({ ...newRoute, intermediateStops: e.target.value })}
                className="h-9 text-xs"
              />
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
                Save Corridor
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
