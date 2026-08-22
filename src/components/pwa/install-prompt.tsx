"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Download, X, Share } from "lucide-react";

const emptySubscribe = () => () => {};

// Types for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    // Check if user already dismissed or installed PWA
    const alreadyDismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    if (alreadyDismissed) {
      return;
    }

    // Check standalone mode (already installed)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true);
    setIsStandalone(standalone);

    if (standalone) {
      localStorage.setItem(DISMISSED_KEY, "true");
      setDismissed(true);
      return;
    }

    // Detect iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // Listen for install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      // Only prompt if not previously dismissed
      if (localStorage.getItem(DISMISSED_KEY) !== "true") {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setDismissed(false);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setDismissed(true);
      localStorage.setItem(DISMISSED_KEY, "true");
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, "true");
  };

  // Don't render if:
  // - Not on the home page ('/')
  // - Not mounted (SSR)
  // - Already in standalone mode (installed)
  // - User dismissed it previously
  // - Not on iOS and no install prompt available
  if (pathname !== "/") return null;
  if (!mounted || isStandalone || dismissed) return null;
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9998] mx-auto max-w-sm"
      style={{ animation: "slide-up 0.4s ease-out forwards" }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-2xl shadow-teal-900/10">
        {/* Gradient accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500" />

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            {/* App icon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-192x192.png"
              alt="Bus Dorkar"
              className="h-12 w-12 rounded-xl shadow-md flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    Install Bus Dorkar
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add to your home screen for faster access
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  aria-label="Dismiss install prompt"
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* iOS Instructions */}
          {isIOS && (
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Tap{" "}
                <Share className="inline h-3.5 w-3.5 text-blue-500 mx-0.5" />{" "}
                <strong>Share</strong> in Safari, then tap{" "}
                <strong>&ldquo;Add to Home Screen&rdquo;</strong> to install.
              </p>
            </div>
          )}

          {/* Android/Chrome Install Button */}
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              id="pwa-install-button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-600/20 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Add to Home Screen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
