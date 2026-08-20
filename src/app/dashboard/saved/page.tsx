"use client";

import { useState, useEffect } from "react";
import { Bookmark, User, MapPin, Plus, Trash2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { allDistricts } from "@/lib/data/districts";
import { DistrictCombobox } from "@/components/ui/district-combobox";

interface SavedPassenger {
  id: string;
  name: string;
  phone: string;
  gender: string;
}

interface SavedRoute {
  id: string;
  fromDistrictId: string;
  fromDistrictName: string;
  toDistrictId: string;
  toDistrictName: string;
}

export default function SavedItemsPage() {
  const [passengers, setPassengers] = useState<SavedPassenger[]>([]);
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // New passenger form
  const [pName, setPName] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pGender, setPGender] = useState("male");
  const [showAddPassenger, setShowAddPassenger] = useState(false);

  // New route form
  const [fromId, setFromId] = useState("dhaka");
  const [toId, setToId] = useState("coxs-bazar");
  const [showAddRoute, setShowAddRoute] = useState(false);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      if (data.success) {
        setPassengers(data.passengers || []);
        setRoutes(data.routes || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassenger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pPhone.trim()) return;

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PASSENGER",
          name: pName.trim(),
          phone: pPhone.trim(),
          gender: pGender,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPassengers((prev) => [...prev, data.item]);
        setPName("");
        setPPhone("");
        setShowAddPassenger(false);
      }
    } catch {
      // ignore
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    const fromD = allDistricts.find((d) => d.id === fromId);
    const toD = allDistricts.find((d) => d.id === toId);
    if (!fromD || !toD) return;

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ROUTE",
          fromDistrictId: fromD.id,
          fromDistrictName: fromD.name,
          toDistrictId: toD.id,
          toDistrictName: toD.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRoutes((prev) => [...prev, data.item]);
        setShowAddRoute(false);
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string, type: "PASSENGER" | "ROUTE") => {
    try {
      await fetch("/api/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });
      if (type === "PASSENGER") {
        setPassengers((prev) => prev.filter((p) => p.id !== id));
      } else {
        setRoutes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Saved Items</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          Quickly access frequent passengers and favorite bus routes
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600 mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saved Routes Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-600" /> Favorite Routes ({routes.length})
              </h2>
              <Button
                onClick={() => setShowAddRoute(!showAddRoute)}
                variant="outline"
                className="text-xs font-bold h-8 px-3 border-teal-200 text-teal-700 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Route
              </Button>
            </div>

            {showAddRoute && (
              <form onSubmit={handleAddRoute} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">From</label>
                    <DistrictCombobox value={fromId} onChange={setFromId} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">To</label>
                    <DistrictCombobox value={toId} onChange={setToId} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowAddRoute(false)} className="text-xs font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-teal text-white text-xs font-bold h-8 rounded-lg">
                    Save Route
                  </Button>
                </div>
              </form>
            )}

            {routes.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No saved routes yet. Add your frequent travel routes!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {routes.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span>{r.fromDistrictName}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-teal-600" />
                      <span>{r.toDistrictName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/search?from=${r.fromDistrictId}&to=${r.toDistrictId}`}>
                        <Button className="gradient-teal text-white text-[10px] font-bold h-7 px-2.5 rounded-md">
                          Search
                        </Button>
                      </Link>
                      <button onClick={() => handleDelete(r.id, "ROUTE")} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Passengers Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-teal-600" /> Saved Passengers ({passengers.length})
              </h2>
              <Button
                onClick={() => setShowAddPassenger(!showAddPassenger)}
                variant="outline"
                className="text-xs font-bold h-8 px-3 border-teal-200 text-teal-700 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Passenger
              </Button>
            </div>

            {showAddPassenger && (
              <form onSubmit={handleAddPassenger} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input placeholder="Full Name" value={pName} onChange={(e) => setPName(e.target.value)} required className="h-9 text-xs bg-white" />
                  <Input placeholder="01XXXXXXXXX" value={pPhone} onChange={(e) => setPPhone(e.target.value)} required className="h-9 text-xs bg-white" />
                  <select value={pGender} onChange={(e) => setPGender(e.target.value)} className="h-9 text-xs bg-white border border-slate-300 rounded-lg px-2">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowAddPassenger(false)} className="text-xs font-bold">
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-teal text-white text-xs font-bold h-8 rounded-lg">
                    Save Passenger
                  </Button>
                </div>
              </form>
            )}

            {passengers.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No saved co-passengers. Save family or friends for fast checkout!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {passengers.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{p.phone} • {p.gender}</p>
                    </div>
                    <button onClick={() => handleDelete(p.id, "PASSENGER")} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
