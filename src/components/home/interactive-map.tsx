"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LocateFixed,
  MapPin,
  Navigation,
  Bus,
  Terminal,
  Layers,
  Search,
  Maximize2,
  Minimize2,
  Sparkles,
  Route,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allDistricts, majorTerminals, District } from "@/lib/data/districts";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to prevent SSR window errors
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
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);

// Helper component inside MapContainer to auto-fit map view to markers
function MapBoundsController({
  bounds,
}: {
  bounds: [number, number][];
}) {
  const [map, setMap] = useState<any>(null);

  // Import useMap hook safely
  useEffect(() => {
    import("react-leaflet").then((mod) => {
      // Find Leaflet map instance from parent container context if available
    });
  }, []);

  return null;
}

// Available Map Tile Themes
const MAP_THEMES = [
  {
    id: "voyager",
    name: "CARTO Voyager (Light)",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  {
    id: "osm",
    name: "OpenStreetMap Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    id: "satellite",
    name: "Esri Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
];

interface InteractiveMapProps {
  fromDistrictId: string;
  toDistrictId: string;
  onSelectFromDistrict?: (districtId: string) => void;
  onSelectToDistrict?: (districtId: string) => void;
}

export function InteractiveMap({
  fromDistrictId,
  toDistrictId,
  onSelectFromDistrict,
  onSelectToDistrict,
}: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [nearestDistrict, setNearestDistrict] = useState<District | null>(null);
  const [nearestTerminal, setNearestTerminal] = useState<any | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("voyager");
  const [terminalQuery, setTerminalQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "terminals" | "districts">("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [busProgress, setBusProgress] = useState(0.45); // bus position ratio along route
  const [L, setL] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Dynamic import of Leaflet on client mount
  useEffect(() => {
    setMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  // Bus position animation along route polyline
  useEffect(() => {
    const interval = setInterval(() => {
      setBusProgress((prev) => (prev >= 0.95 ? 0.05 : prev + 0.015));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Geodesic distance calculation in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Detect GPS Live Location
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
        let minDistKm = Infinity;
        let closestDist: District | null = null;
        allDistricts.forEach((dist) => {
          const d = getDistance(coords.lat, coords.lng, dist.lat, dist.lng);
          if (d < minDistKm) {
            minDistKm = d;
            closestDist = dist;
          }
        });

        // Find nearest bus terminal
        let minTermKm = Infinity;
        let closestTerm: any = null;
        majorTerminals.forEach((term) => {
          const d = getDistance(coords.lat, coords.lng, term.lat, term.lng);
          if (d < minTermKm) {
            minTermKm = d;
            closestTerm = term;
          }
        });

        if (closestDist) {
          setNearestDistrict(closestDist);
          if (onSelectFromDistrict) {
            onSelectFromDistrict((closestDist as District).id);
          }
        }
        if (closestTerm) {
          setNearestTerminal({ ...closestTerm, distanceKm: minTermKm });
        }
      },
      (error) => {
        setLocating(false);
        alert(`Location Access Error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fromDistrict = allDistricts.find((d) => d.id === fromDistrictId) || allDistricts[0];
  const toDistrict = allDistricts.find((d) => d.id === toDistrictId) || allDistricts[1];

  // Calculated Road Metrics
  const directDistanceKm = getDistance(
    fromDistrict.lat,
    fromDistrict.lng,
    toDistrict.lat,
    toDistrict.lng
  );
  // Estimated driving distance is ~1.25x direct geodesic distance due to highway twists
  const estimatedRoadKm = Math.round(directDistanceKm * 1.25);
  // Estimated bus journey time (average 45-55 km/h including terminal stops)
  const estHoursLow = Math.max(1, Math.floor(estimatedRoadKm / 55));
  const estHoursHigh = Math.max(estHoursLow + 1, Math.ceil(estimatedRoadKm / 42));

  // Determine Highway route name based on districts
  const getHighwayName = (fromId: string, toId: string) => {
    const pair = [fromId, toId].sort().join("-");
    if (pair.includes("chattogram") || pair.includes("coxs-bazar")) return "N1 Dhaka-Chattogram Highway";
    if (pair.includes("sylhet")) return "N2 Dhaka-Sylhet Highway";
    if (pair.includes("rajshahi") || pair.includes("bogura") || pair.includes("rangpur")) return "N5 / N405 Highway";
    if (pair.includes("khulna") || pair.includes("jessore")) return "N7 Padma Bridge Expressway";
    if (pair.includes("barishal") || pair.includes("patuakhali")) return "N8 Padma Bridge Expressway";
    return "National Highway Route";
  };

  const highwayName = getHighwayName(fromDistrict.id, toDistrict.id);

  // Animated bus marker coordinates between Origin & Destination
  const animatedBusLat = fromDistrict.lat + (toDistrict.lat - fromDistrict.lat) * busProgress;
  const animatedBusLng = fromDistrict.lng + (toDistrict.lng - fromDistrict.lng) * busProgress;

  // Route path positions
  const routePositions: [number, number][] = [
    [fromDistrict.lat, fromDistrict.lng],
    [toDistrict.lat, toDistrict.lng],
  ];

  // Filtered Terminals based on Search & Category Filter
  const filteredTerminals = useMemo(() => {
    return majorTerminals.filter((term) => {
      const matchesSearch =
        !terminalQuery ||
        term.name.toLowerCase().includes(terminalQuery.toLowerCase()) ||
        (term.nameBn && term.nameBn.includes(terminalQuery)) ||
        term.district.toLowerCase().includes(terminalQuery.toLowerCase());

      if (activeFilter === "terminals") {
        return matchesSearch;
      }
      return matchesSearch;
    });
  }, [terminalQuery, activeFilter]);

  // Current active map tile config
  const currentTileTheme = MAP_THEMES.find((t) => t.id === selectedTheme) || MAP_THEMES[0];

  // Dynamic Leaflet Custom Icons
  const createCustomIcon = (
    color: string,
    label: string,
    type: "origin" | "destination" | "terminal" | "bus"
  ) => {
    if (!L) return undefined;

    if (type === "origin") {
      return L.divIcon({
        className: "custom-leaflet-origin-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              background: linear-gradient(135deg, #14b8a6, #0d9488);
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 0 20px rgba(20, 184, 166, 0.8), 0 4px 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: 13px;
            ">
              A
            </div>
            <div style="
              background: rgba(15, 23, 42, 0.9);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.4);
              border-radius: 6px;
              padding: 1px 6px;
              font-size: 10px;
              font-weight: 700;
              margin-top: 3px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            ">${fromDistrict.name}</div>
          </div>
        `,
        iconSize: [32, 54],
        iconAnchor: [16, 16],
      });
    }

    if (type === "destination") {
      return L.divIcon({
        className: "custom-leaflet-dest-marker",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="
              background: linear-gradient(135deg, #10b981, #059669);
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 4px 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: 13px;
            ">
              B
            </div>
            <div style="
              background: rgba(15, 23, 42, 0.9);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.4);
              border-radius: 6px;
              padding: 1px 6px;
              font-size: 10px;
              font-weight: 700;
              margin-top: 3px;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            ">${toDistrict.name}</div>
          </div>
        `,
        iconSize: [32, 54],
        iconAnchor: [16, 16],
      });
    }

    if (type === "bus") {
      return L.divIcon({
        className: "custom-leaflet-bus-marker",
        html: `
          <div style="
            background: linear-gradient(135deg, #f59e0b, #d97706);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 18px rgba(245, 158, 11, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #090d16;
            transform: scale(1.1);
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"/>
              <path d="M16 6v6"/>
              <path d="M2 12h20"/>
              <path d="M18 18h2a1 1 0 0 0 1-1V7a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v10a1 1 0 0 0 1 1h2"/>
              <circle cx="7" cy="18" r="2"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    }

    // Default Bus Terminal icon
    return L.divIcon({
      className: "custom-leaflet-terminal-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  const createLiveUserIcon = () => {
    if (!L) return undefined;
    return L.divIcon({
      className: "user-live-radar-marker",
      html: `
        <div style="position: relative;">
          <div style="
            width: 22px;
            height: 22px;
            background-color: #3b82f6;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 0 20px #3b82f6;
          "></div>
          <div style="
            position: absolute;
            top: -12px;
            left: -12px;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            border: 2px solid #3b82f6;
            opacity: 0.65;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  return (
    <div
      className={`space-y-4 transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 p-4 bg-white/95 backdrop-blur-xl flex flex-col justify-between" : ""
      }`}
    >
      {/* ===== 1. LIVE ROUTE & GPS METRICS BAR ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-md">
        {/* Route Connection Overview */}
        <div className="lg:col-span-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Route className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
                <span>{fromDistrict.name}</span>
                <ArrowRight className="h-4 w-4 text-teal-600" />
                <span>{toDistrict.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200 font-bold">
                  {highwayName}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2 font-medium">
                <span>Road Distance: <strong className="text-slate-900">{estimatedRoadKm} km</strong></span>
                <span>•</span>
                <span>Est. Bus Time: <strong className="text-slate-900">{estHoursLow}-{estHoursHigh} Hours</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* GPS Live Location Detector Button */}
        <div className="lg:col-span-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={locating}
            id="detect-live-location-btn"
            className="gradient-teal text-white font-extrabold text-xs h-11 px-4 rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
          >
            <LocateFixed className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
            {locating ? "Locating..." : userLocation ? "Update GPS Location" : "Detect My Live GPS Location"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-11 w-11 p-0 rounded-xl bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* GPS Detection Result Notice */}
      {userLocation && nearestDistrict && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
            Detected near <strong>{nearestDistrict.name} District ({nearestDistrict.nameBn})</strong>
            {nearestTerminal && (
              <> • Closest Bus Terminal: <strong>{nearestTerminal.name} ({nearestTerminal.distanceKm} km away)</strong></>
            )}
          </span>
          <button
            onClick={() => onSelectFromDistrict && onSelectFromDistrict(nearestDistrict.id)}
            className="font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
          >
            Set as Origin
          </button>
        </div>
      )}

      {/* ===== 2. MAP HEADER CONTROL TOOLBAR ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Bus Terminal Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search terminal or district on map..."
            value={terminalQuery}
            onChange={(e) => setTerminalQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-teal-600"
          />
        </div>

        {/* Map Tile Style Switcher Dropdown / Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-600 font-bold mr-1 hidden sm:flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-teal-600" /> Layer:
          </span>
          {MAP_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTheme === theme.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {theme.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 3. OPENSTREETMAP CONTAINER ===== */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-50 transition-all ${
          isFullscreen ? "flex-1 min-h-[500px]" : "h-[340px] sm:h-[450px]"
        }`}
      >
        {/* Leaflet Stylesheet standard CDN */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        {mounted && L && (
          <MapContainer
            key={selectedTheme}
            center={[23.8103, 90.4125]} // Dhaka center coordinates
            zoom={7}
            scrollWheelZoom={false}
            className="h-full w-full z-0 bg-slate-100"
          >
            {/* OpenStreetMap Tile Provider */}
            <TileLayer
              attribution={currentTileTheme.attribution}
              url={currentTileTheme.url}
              maxZoom={18}
            />

            {/* Dynamic Polyline connecting Origin & Destination */}
            <Polyline
              positions={routePositions}
              pathOptions={{
                color: "#0d9488",
                weight: 5,
                opacity: 0.9,
                dashArray: "10, 10",
              }}
            />

            {/* Simulated Live Bus Icon moving along Polyline */}
            <Marker
              position={[animatedBusLat, animatedBusLng]}
              icon={createCustomIcon("#d97706", "Bus", "bus")}
            >
              <Tooltip permanent direction="top" offset={[0, -18]} className="bg-white border-teal-600 text-slate-900 text-[10px] font-bold rounded-md px-2 py-0.5 shadow-md">
                🚌 Live Express Bus En Route
              </Tooltip>
            </Marker>

            {/* Origin District Marker (A) */}
            <Marker
              position={[fromDistrict.lat, fromDistrict.lng]}
              icon={createCustomIcon("#0d9488", "A", "origin")}
            >
              <Popup>
                <div className="p-3 w-64 text-slate-900 font-sans space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Origin District
                    </span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                      {fromDistrict.division}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {fromDistrict.name} ({fromDistrict.nameBn})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Coordinates: {fromDistrict.lat.toFixed(4)}°N, {fromDistrict.lng.toFixed(4)}°E
                    </p>
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Departure Point Selected
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Destination District Marker (B) */}
            <Marker
              position={[toDistrict.lat, toDistrict.lng]}
              icon={createCustomIcon("#059669", "B", "destination")}
            >
              <Popup>
                <div className="p-3 w-64 text-slate-900 font-sans space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Destination District
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {toDistrict.division}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {toDistrict.name} ({toDistrict.nameBn})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Coordinates: {toDistrict.lat.toFixed(4)}°N, {toDistrict.lng.toFixed(4)}°E
                    </p>
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Destination Point Selected
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Live GPS User Location Marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={createLiveUserIcon()}>
                <Popup>
                  <div className="p-3 w-56 text-slate-900 font-sans space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                      <LocateFixed className="h-4 w-4" /> Your Current Live GPS
                    </div>
                    {nearestDistrict && (
                      <p className="text-xs text-slate-600">
                        Nearest District: <strong className="text-slate-900">{nearestDistrict.name}</strong>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Major Inter-District Bus Terminals */}
            {filteredTerminals.map((terminal, idx) => (
              <Marker
                key={idx}
                position={[terminal.lat, terminal.lng]}
                icon={createCustomIcon("#0284c7", "T", "terminal")}
              >
                <Popup>
                  <div className="p-3 w-60 text-slate-900 font-sans space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700">
                      <Terminal className="h-4 w-4" /> Bus Terminal
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{terminal.name}</h4>
                      {terminal.nameBn && <p className="text-xs text-slate-500">{terminal.nameBn}</p>}
                    </div>
                    <div className="pt-1 flex gap-2">
                      {onSelectFromDistrict && (
                        <button
                          onClick={() => {
                            const foundDist = allDistricts.find((d) => d.id === terminal.district);
                            if (foundDist) onSelectFromDistrict(foundDist.id);
                          }}
                          className="text-[10px] px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer"
                        >
                          Select Origin
                        </button>
                      )}
                      {onSelectToDistrict && (
                        <button
                          onClick={() => {
                            const foundDist = allDistricts.find((d) => d.id === terminal.district);
                            if (foundDist) onSelectToDistrict(foundDist.id);
                          }}
                          className="text-[10px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                        >
                          Select Dest.
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* ===== MAP LEGEND FLOATING BAR ===== */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 px-3.5 py-2 rounded-xl text-[11px] text-slate-800 flex flex-wrap items-center gap-3 sm:gap-4 border border-slate-200 shadow-lg backdrop-blur-md">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-teal-600 shadow-sm" />
            Origin ({fromDistrict.name})
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-emerald-600 shadow-sm" />
            Destination ({toDistrict.name})
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-sky-600 shadow-sm" />
            Terminals ({filteredTerminals.length})
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm animate-pulse" />
            Live Express Bus
          </span>
          {userLocation && (
            <span className="flex items-center gap-1.5 font-bold text-blue-700">
              <span className="h-3 w-3 rounded-full bg-blue-600 animate-ping" />
              You
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
