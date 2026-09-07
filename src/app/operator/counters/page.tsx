"use client";

import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  PhoneCall,
  Clock,
  Navigation,
  CheckCircle2,
  Users,
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

interface CounterItem {
  id: string;
  name: string;
  district: string;
  terminal: string;
  address: string;
  phone: string;
  manager: string;
  openingHours: string;
  lat: number;
  lng: number;
  status: "ACTIVE" | "INACTIVE";
}

const INITIAL_COUNTERS: CounterItem[] = [
  {
    id: "CNT-01",
    name: "Rajarbagh Central Station & VIP Lounge",
    district: "Dhaka",
    terminal: "Central Rajarbagh Station",
    address: "9/2 Outer Circular Road, Rajarbagh, Dhaka",
    phone: "+880 1711-536034",
    manager: "Md. Jahangir Alam",
    openingHours: "24 Hours (Round the Clock)",
    lat: 23.7385,
    lng: 90.4182,
    status: "ACTIVE",
  },
  {
    id: "CNT-02",
    name: "Sayedabad Janapath Counter",
    district: "Dhaka",
    terminal: "Sayedabad Inter-District Terminal",
    address: "Janapath More, Sayedabad, Dhaka-1204",
    phone: "+880 1711-536040",
    manager: "Kamal Uddin",
    openingHours: "05:30 AM - 11:45 PM",
    lat: 23.7118,
    lng: 90.4268,
    status: "ACTIVE",
  },
  {
    id: "CNT-03",
    name: "Gabtoli North-Bengal Counter",
    district: "Dhaka",
    terminal: "Gabtoli Inter-District Terminal Gate 1",
    address: "Gabtoli Bus Stand, Mirpur, Dhaka-1216",
    phone: "+880 1819-445566",
    manager: "Anwar Hossain",
    openingHours: "05:00 AM - 12:00 AM",
    lat: 23.7806,
    lng: 90.3436,
    status: "ACTIVE",
  },
  {
    id: "CNT-04",
    name: "Dampara Main Station Chattogram",
    district: "Chattogram",
    terminal: "Dampara Bus Station",
    address: "Opposite Police Lines, CDA Avenue, Chattogram",
    phone: "+880 1711-536055",
    manager: "Nasirul Islam",
    openingHours: "24 Hours (Round the Clock)",
    lat: 22.3592,
    lng: 91.8214,
    status: "ACTIVE",
  },
  {
    id: "CNT-05",
    name: "Jhawtala Central Counter Cox's Bazar",
    district: "Cox's Bazar",
    terminal: "Jhawtala Bus Concourse",
    address: "Main Road, Jhawtala, Cox's Bazar",
    phone: "+880 1711-536070",
    manager: "Abul Kashem",
    openingHours: "06:00 AM - 11:30 PM",
    lat: 21.4312,
    lng: 91.9795,
    status: "ACTIVE",
  },
  {
    id: "CNT-06",
    name: "Kadamtali Central Terminal Sylhet",
    district: "Sylhet",
    terminal: "Kadamtali Inter-District Concourse",
    address: "Kadamtali Bus Terminal Gate 2, Sylhet",
    phone: "+880 1711-889922",
    manager: "Matiur Rahman",
    openingHours: "05:30 AM - 11:00 PM",
    lat: 24.8812,
    lng: 91.8715,
    status: "ACTIVE",
  },
];

export default function OperatorCountersPage() {
  const [counters, setCounters] = useState<CounterItem[]>(INITIAL_COUNTERS);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCounter, setNewCounter] = useState({
    name: "",
    district: "Dhaka",
    terminal: "",
    address: "",
    phone: "",
    manager: "",
    openingHours: "06:00 AM - 11:00 PM",
  });

  const handleAddCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounter.name || !newCounter.phone) return;

    const created: CounterItem = {
      id: `CNT-${String(counters.length + 1).padStart(2, "0")}`,
      name: newCounter.name,
      district: newCounter.district,
      terminal: newCounter.terminal || "District Terminal",
      address: newCounter.address || "Main Station, District Hub",
      phone: newCounter.phone,
      manager: newCounter.manager || "Counter In-Charge",
      openingHours: newCounter.openingHours,
      lat: 23.8103,
      lng: 90.4125,
      status: "ACTIVE",
    };

    setCounters([created, ...counters]);
    setAddModalOpen(false);
    setNewCounter({
      name: "",
      district: "Dhaka",
      terminal: "",
      address: "",
      phone: "",
      manager: "",
      openingHours: "06:00 AM - 11:00 PM",
    });
  };

  const filtered = counters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.terminal.toLowerCase().includes(search.toLowerCase()) ||
      c.manager.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Counter Terminals & Staff Directory
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Physical ticket booking booths, station managers, and passenger boarding check-ins.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="gradient-teal text-white font-semibold text-xs h-9 rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Counter Booth
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search counter name, district, manager, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50"
          />
        </div>
        <Badge variant="outline" className="text-xs font-mono border-slate-200 hidden sm:inline">
          {filtered.length} Terminals Registered
        </Badge>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cnt) => (
          <div
            key={cnt.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-[10px] font-mono border-slate-300 mb-1">
                    {cnt.district} District
                  </Badge>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {cnt.name}
                  </h3>
                  <span className="text-xs text-teal-700 font-semibold">{cnt.terminal}</span>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                  {cnt.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{cnt.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <a href={`tel:${cnt.phone}`} className="font-mono font-bold text-teal-700 hover:underline">
                    {cnt.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Manager: <strong>{cnt.manager}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500 font-medium">{cnt.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={`https://www.google.com/maps?q=${cnt.lat},${cnt.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                Map Location
              </a>
              <span className="text-slate-400 font-mono text-[10px]">ID: {cnt.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Counter Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Register New Counter Booth
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Aligned with Section 22: Assign terminal location, address, and counter manager.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCounter} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Counter Name *</label>
              <Input
                required
                placeholder="e.g. Kalabagan Executive Counter"
                value={newCounter.name}
                onChange={(e) => setNewCounter({ ...newCounter, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">District</label>
                <select
                  value={newCounter.district}
                  onChange={(e) => setNewCounter({ ...newCounter, district: e.target.value })}
                  className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2.5 text-xs font-medium text-slate-800"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Cox's Bazar">Cox&apos;s Bazar</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Rangpur">Rangpur</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Terminal Station</label>
                <Input
                  placeholder="e.g. Kalabagan Bus Stand"
                  value={newCounter.terminal}
                  onChange={(e) => setNewCounter({ ...newCounter, terminal: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Address</label>
              <Input
                placeholder="e.g. 12/A Mirpur Road, Kalabagan, Dhaka"
                value={newCounter.address}
                onChange={(e) => setNewCounter({ ...newCounter, address: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <Input
                  required
                  placeholder="+880 17XXXXXXXX"
                  value={newCounter.phone}
                  onChange={(e) => setNewCounter({ ...newCounter, phone: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Manager Name</label>
                <Input
                  placeholder="e.g. Md. Shahidul Islam"
                  value={newCounter.manager}
                  onChange={(e) => setNewCounter({ ...newCounter, manager: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Opening Hours</label>
              <Input
                value={newCounter.openingHours}
                onChange={(e) => setNewCounter({ ...newCounter, openingHours: e.target.value })}
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
                Save Counter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
