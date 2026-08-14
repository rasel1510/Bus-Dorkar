import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
