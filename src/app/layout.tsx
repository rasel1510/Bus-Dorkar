import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { LanguageProvider } from "@/context/language-context";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===== SEO & Social Metadata =====
export const metadata: Metadata = {
  title: {
    default: "Bus Dorkar — Bangladesh Inter-District Bus Ticketing Platform",
    template: "%s | Bus Dorkar",
  },
  description:
    "Discover, compare, and book inter-district buses across Bangladesh. Real-time seat availability, digital tickets, verified operators, and map-based route discovery.",
  keywords: [
    "bus ticket bangladesh",
    "inter district bus",
    "bus dorkar",
    "dhaka to chattogram bus",
    "dhaka to sylhet bus",
    "dhaka to cox's bazar bus",
    "bangladesh bus booking",
    "online bus ticket",
  ],
  authors: [{ name: "Bus Dorkar" }],
  openGraph: {
    title: "Bus Dorkar — Bangladesh Inter-District Bus Ticketing",
    description:
      "Find and book inter-district buses across Bangladesh with real-time seat availability and digital tickets.",
    type: "website",
    locale: "en_BD",
    siteName: "Bus Dorkar",
  },
  // ===== PWA / Mobile Metadata =====
  applicationName: "Bus Dorkar",
  appleWebApp: {
    capable: true,
    title: "Bus Dorkar",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192" },
    ],
  },
};

// ===== Viewport (separate export — required in Next.js 14+) =====
export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground bg-white">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          {/* PWA Components — rendered outside AuthProvider so they're always visible */}
          <OfflineBanner />
          <PWAInstallPrompt />
        </LanguageProvider>
      </body>
    </html>
  );
}
