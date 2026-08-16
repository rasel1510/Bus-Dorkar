import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bus Dorkar — Bangladesh Bus Ticketing",
    short_name: "Bus Dorkar",
    description:
      "Book inter-district buses across Bangladesh. Real-time seat availability, digital tickets, and verified operators.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["travel", "transportation", "lifestyle"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Search Buses",
        short_name: "Search",
        description: "Search for available buses between districts",
        url: "/search",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "My Bookings",
        short_name: "Bookings",
        description: "View your active and past bookings",
        url: "/dashboard/bookings",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
