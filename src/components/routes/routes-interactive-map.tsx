"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { BusRoute } from "@/lib/data/routes-data";
import { allDistricts, majorTerminals } from "@/lib/data/districts";
import { MapPin, Bus, Navigation, Layers, Compass, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

interface RoutesInteractiveMapProps {
  routes: BusRoute[];
  selectedRoute: BusRoute | null;
  onSelectRoute: (route: BusRoute) => void;
}

export function RoutesInteractiveMap({
  routes,
  selectedRoute,
  onSelectRoute,
}: RoutesInteractiveMapProps) {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  // Compute polyline coordinates for selected or popular routes
  const routePolylines = useMemo(() => {
    return routes.map((r) => {
      const stopCoords: [number, number][] = [];
      r.stops.forEach((stop) => {
        const d = allDistricts.find((dist) => dist.id === stop.districtId);
        if (d) {
          stopCoords.push([d.lat, d.lng]);
        }
      });
      return {
        route: r,
        coords: stopCoords,
        isSelected: selectedRoute?.id === r.id,
      };
    });
  }, [routes, selectedRoute]);

  // Terminal & district markers
  const districtMarkers = useMemo(() => {
    return allDistricts.filter((d) =>
      [
        "dhaka",
        "chattogram",
        "coxs-bazar",
        "sylhet",
        "rajshahi",
        "khulna",
        "barishal",
        "rangpur",
        "mymensingh",
        "bogura",
        "cumilla",
        "jessore",
        "dinajpur",
        "bandarban",
        "kushtia",
      ].includes(d.id)
    );
  }, []);

  const createCustomIcon = (name: string, isSelected: boolean) => {
    if (!L) return undefined;
    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          background: ${isSelected ? "#0d9488" : "#ffffff"};
          color: ${isSelected ? "#ffffff" : "#0f172a"};
          border: 2px solid ${isSelected ? "#0f766e" : "#cbd5e1"};
          padding: 3px 7px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 11px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          white-space: nowrap;
        ">
          <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${isSelected ? "#ffffff" : "#0d9488"};"></span>
          ${name}
        </div>
      `,
      iconSize: [80, 26],
      iconAnchor: [40, 13],
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 font-medium text-sm">
        Initializing Bangladesh Route Network Map...
      </div>
    );
  }

  return (
    <div className="w-full h-[540px] rounded-2xl overflow-hidden border border-slate-200 relative shadow-sm">
      {/* Map Header Floating Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-bold text-slate-800">
        <Navigation className="h-3.5 w-3.5 text-teal-600" />
        <span>Interactive Bangladesh National Bus Corridors</span>
      </div>

      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Polylines for routes */}
        {routePolylines.map((item, idx) => (
          <Polyline
            key={idx}
            positions={item.coords}
            pathOptions={{
              color: item.isSelected ? "#0d9488" : "#94a3b8",
              weight: item.isSelected ? 5 : 2.5,
              opacity: item.isSelected ? 1 : 0.6,
              dashArray: item.isSelected ? undefined : "6, 6",
            }}
            eventHandlers={{
              click: () => onSelectRoute(item.route),
            }}
          >
            <Tooltip sticky>
              <span className="font-bold text-xs text-slate-900">
                {item.route.fromName} ↔ {item.route.toName} ({item.route.distanceKm} km, {item.route.duration})
              </span>
            </Tooltip>
          </Polyline>
        ))}

        {/* District Markers */}
        {districtMarkers.map((district) => {
          const isOrigin = selectedRoute?.fromId === district.id;
          const isDest = selectedRoute?.toId === district.id;
          const isHighlighted = isOrigin || isDest;

          return (
            <Marker
              key={district.id}
              position={[district.lat, district.lng]}
              icon={createCustomIcon(district.name, isHighlighted)}
            >
              <Popup>
                <div className="p-2 space-y-1 text-slate-900">
                  <p className="font-extrabold text-sm">{district.name} ({district.nameBn})</p>
                  <p className="text-xs text-slate-500 font-medium">{district.division} Division Hub</p>
                  <div className="pt-2">
                    <Link href={`/search?from=${district.id}&to=coxs-bazar`}>
                      <span className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-1">
                        Find departures from here &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
