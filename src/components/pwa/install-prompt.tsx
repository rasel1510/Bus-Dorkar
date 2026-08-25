"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, X, Share, CheckCircle, ChevronRight, HelpCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const SESSION_DISMISSED_KEY = "busdorkar_pwa_prompt_dismissed";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.log("SW registration skipped:", err));
    }

    // 2. Check if already installed in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        (window.navigator as { standalone?: boolean }).standalone === true);
    setIsStandalone(standalone);

    if (standalone) {
      return;
    }

    // 3. Detect iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // 4. Listen for native browser install prompt (Chrome / Edge / Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Listen for custom open-pwa-install event anywhere in the app
    const handleCustomOpen = () => {
      setIsVisible(true);
      setShowGuide(false);
    };
    window.addEventListener("open-pwa-install", handleCustomOpen);

    // 6. Check if user already dismissed in this session
    const wasDismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true";

    // Show prompt in bottom-right corner after smooth initial 1.2s delay
    const timer = setTimeout(() => {
      if (!wasDismissed && !standalone) {
        setIsVisible(true);
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-pwa-install", handleCustomOpen);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstalledSuccess(true);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
          }, 2000);
        }
      } catch {
        setShowGuide(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowGuide((prev) => !prev);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
  };

  if (!mounted || isStandalone) {
    return null;
  }

  return (
    <>
      {/* 1. Main Expanded Install Alert (Bottom-Right) */}
      {isVisible ? (
        <aside
          aria-label="PWA Application Installation Alert"
          className="fixed bottom-4 right-4 z-[9998] w-[calc(100%-2rem)] sm:w-[320px] max-w-full animate-in fade-in slide-in-from-bottom-5 duration-500"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-teal-500/30 shadow-2xl shadow-teal-950/20 backdrop-blur-xl">
            {/* Top Accent Gradient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600" />

            <div className="p-3.5 sm:p-4 space-y-3">
              {/* Header Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* App Icon */}
                  <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 p-0.5 shadow-md shadow-teal-600/30 flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icon-192x192.png"
                      alt="Bus Dorkar App"
                      className="h-9 w-9 rounded-[9px] object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-extrabold text-slate-900 tracking-tight truncate">
                      Bus Dorkar App
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight">
                      Fast & offline-ready
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleDismiss}
                  aria-label="Close install prompt"
                  title="Minimize"
                  className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Success Banner */}
              {installedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>App installed successfully!</span>
                </div>
              )}

              {/* Collapsible Guide for Browsers without auto-prompt */}
              {showGuide && !installedSuccess && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 space-y-1.5 animate-in fade-in duration-200">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-teal-600" /> How to install:
                  </p>
                  {isIOS ? (
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Tap <Share className="inline h-3 w-3 text-blue-600 mx-0.5" /> <strong>Share</strong> in Safari, then tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                    </p>
                  ) : (
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Click the <strong>Install App icon (⊕ / ⤓)</strong> in your browser address bar, or open the browser menu (⋮) &gt; <strong>&ldquo;Install Bus Dorkar&rdquo;</strong>.
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                <Button
                  onClick={handleInstallClick}
                  id="pwa-install-action-btn"
                  className="flex-1 h-9.5 gradient-teal hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{deferredPrompt ? "Install App Now" : showGuide ? "Close Guide" : "Install App"}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-75 ml-auto" />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="h-9.5 text-xs font-bold text-slate-600 hover:text-slate-900 border-slate-200 rounded-xl px-3 cursor-pointer"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </aside>
      ) : (
        /* 2. Persistent Floating Trigger Chip when closed/minimized */
        <div className="fixed bottom-4 right-4 z-[9997] animate-in fade-in zoom-in-90 duration-300">
          <button
            onClick={() => {
              setIsVisible(true);
              setShowGuide(false);
            }}
            id="pwa-reopen-trigger-btn"
            title="Install Bus Dorkar App (PWA)"
            className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white text-slate-800 border-2 border-teal-500/40 rounded-full shadow-lg shadow-teal-950/15 hover:shadow-xl hover:border-teal-600 transition-all hover:scale-105 cursor-pointer group backdrop-blur-md"
          >
            <div className="h-6 w-6 rounded-full gradient-teal flex items-center justify-center text-white shadow-xs">
              <Smartphone className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-extrabold text-slate-800 pr-1 group-hover:text-teal-700 transition-colors">
              Install App
            </span>
          </button>
        </div>
      )}
    </>
  );
}
