"use client";

import { useEffect, useState } from "react";
import { LocateFixed, MapPin, Navigation, Bus, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allDistricts, majorTerminals, District } from "@/lib/data/districts";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR window errors
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface InteractiveMapProps {
  fromDistrictId: string;
  toDistrictId: string;
  onSelectFromDistrict?: (districtId: string) => void;
}

export function InteractiveMap({
  fromDistrictId,
  toDistrictId,
  onSelectFromDistrict,
}: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [nearestDistrict, setNearestDistrict] = useState<District | null>(null);
  const [L, setL] = useState<any>(null);

  // Initialize Leaflet custom icon setup
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  // Calculate distance between two coordinates in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get Live Location via Browser Geolocation API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocating(false);

        // Find nearest Bangladesh district
        let minDistance = Infinity;
        let closest: District | null = null;
        allDistricts.forEach((dist) => {
          const distKm = getDistance(coords.lat, coords.lng, dist.lat, dist.lng);
          if (distKm < minDistance) {
            minDistance = distKm;
            closest = dist;
          }
        });

        if (closest) {
          setNearestDistrict(closest);
          if (onSelectFromDistrict) {
            onSelectFromDistrict((closest as District).id);
          }
        }
      },
      (error) => {
        setLocating(false);
        alert(`Location Error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fromDistrict = allDistricts.find((d) => d.id === fromDistrictId) || allDistricts[0];
  const toDistrict = allDistricts.find((d) => d.id === toDistrictId) || allDistricts[1];

  // Route path coordinates between origin and destination
  const routePositions: [number, number][] = [
    [fromDistrict.lat, fromDistrict.lng],
    [toDistrict.lat, toDistrict.lng],
  ];

  // Custom Leaflet Icons
  const createCustomIcon = (color: string, label: string) => {
    if (!L) return undefined;
    return L.divIcon({
      className: "custom-map-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 15px ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const createLiveUserIcon = () => {
    if (!L) return undefined;
    return L.divIcon({
      className: "user-live-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 20px;
            height: 20px;
            background-color: #3b82f6;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 0 20px #3b82f6;
          "></div>
          <div style="
            position: absolute;
            top: -10px;
            left: -10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #3b82f6;
            opacity: 0.6;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="space-y-4">
      {/* Live Location Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 glass-card rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-bd-teal-500/10 border border-bd-teal-500/20 flex items-center justify-center text-bd-teal-400">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Live Location & Terminal Map
            </h3>
            <p className="text-xs text-slate-400">
              {userLocation
                ? `Detected: Near ${nearestDistrict?.name} District (${nearestDistrict?.nameBn})`
                : "Detect your location to automatically find nearby bus terminals"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGetLocation}
          disabled={locating}
          id="detect-live-location-btn"
          className="gradient-teal text-bd-navy-950 font-bold text-xs h-10 px-4 rounded-xl shadow-lg shadow-bd-teal-500/20 flex items-center gap-2"
        >
          <LocateFixed className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
          {locating ? "Locating..." : userLocation ? "Update Live Location" : "Detect My Live Location"}
        </Button>
      </div>

      {/* Interactive Map Container */}
      <div className="relative h-[420px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl glass-card">
        {/* Leaflet CSS requirement */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        {L && (
          <MapContainer
            center={[23.8103, 90.4125]} // Center on Dhaka
            zoom={7}
            scrollWheelZoom={false}
            className="h-full w-full z-0 bg-bd-navy-950"
          >
            {/* Dark Matter OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Route Polyline connecting Origin to Destination */}
            <Polyline
              positions={routePositions}
              pathOptions={{
                color: "#14b8a6",
                weight: 4,
                opacity: 0.8,
                dashArray: "8, 8",
              }}
            />

            {/* Origin Marker */}
            <Marker
              position={[fromDistrict.lat, fromDistrict.lng]}
              icon={createCustomIcon("#14b8a6", "A")}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-900 font-sans">
                  <div className="font-bold text-sm text-emerald-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Origin: {fromDistrict.name} ({fromDistrict.nameBn})
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Division: {fromDistrict.division}</p>
                </div>
              </Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker
              position={[toDistrict.lat, toDistrict.lng]}
              icon={createCustomIcon("#10b981", "B")}
            >
              <Popup>
                <div className="p-1 text-slate-900 font-sans">
                  <div className="font-bold text-sm text-teal-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Destination: {toDistrict.name} ({toDistrict.nameBn})
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Division: {toDistrict.division}</p>
                </div>
              </Popup>
            </Marker>

            {/* Live User Location Marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={createLiveUserIcon()}>
                <Popup>
                  <div className="p-1 text-slate-900 font-sans">
                    <div className="font-bold text-sm text-blue-600 flex items-center gap-1">
                      <LocateFixed className="h-4 w-4" /> Your Current Live Location
                    </div>
                    {nearestDistrict && (
                      <p className="text-xs text-slate-600 mt-1">
                        Nearest District: {nearestDistrict.name} ({nearestDistrict.nameBn})
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Major Inter-District Bus Terminals */}
            {majorTerminals.map((terminal, idx) => (
              <Marker
                key={idx}
                position={[terminal.lat, terminal.lng]}
                icon={createCustomIcon("#0284c7", "T")}
              >
                <Popup>
                  <div className="p-1 text-slate-900 font-sans">
                    <div className="font-bold text-xs text-sky-700 flex items-center gap-1">
                      <Terminal className="h-3.5 w-3.5" /> {terminal.name}
                    </div>
                    {terminal.nameBn && <p className="text-xs text-slate-500">{terminal.nameBn}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 z-10 glass-card px-3 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-4 border border-white/10 shadow-lg">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-bd-teal-400 shadow-sm shadow-bd-teal-400" />
            Origin ({fromDistrict.name})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-bd-emerald-400 shadow-sm shadow-bd-emerald-400" />
            Destination ({toDistrict.name})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            Bus Terminals
          </span>
          {userLocation && (
            <span className="flex items-center gap-1.5 font-semibold text-blue-400">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping" />
              You
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
