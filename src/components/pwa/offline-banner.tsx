"use client";

import { useOffline } from "next/offline";
import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineBanner() {
  const isOffline = useOffline();
  const [visible, setVisible] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setVisible(true);
      setWasOffline(true);
      setReconnected(false);
    } else if (wasOffline) {
      // Show brief "reconnected" message then hide
      setReconnected(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setReconnected(false);
        setWasOffline(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-center px-4 py-3 transition-all duration-500 ${
        reconnected
          ? "bg-emerald-600 text-white"
          : "bg-slate-900 text-white"
      }`}
      style={{
        animation: "slide-up 0.3s ease-out forwards",
        boxShadow: reconnected
          ? "0 -4px 20px rgba(5, 150, 105, 0.4)"
          : "0 -4px 20px rgba(15, 23, 42, 0.3)",
      }}
    >
      <div className="flex items-center gap-2.5 max-w-md w-full justify-center">
        {reconnected ? (
          <>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <RefreshCw className="h-3 w-3 text-white" />
            </div>
            <p className="text-sm font-semibold">
              Back online — syncing your data…
            </p>
          </>
        ) : (
          <>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              <WifiOff className="h-3 w-3 text-white" />
            </div>
            <p className="text-sm font-semibold">
              You&apos;re offline — requests will retry when connected
            </p>
          </>
        )}
      </div>
    </div>
  );
}
