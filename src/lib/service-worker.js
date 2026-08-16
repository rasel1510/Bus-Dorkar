// Bus Dorkar Service Worker
// Handles push notifications and offline caching

const CACHE_NAME = "bus-dorkar-v1";
const STATIC_ASSETS = ["/", "/search", "/offline"];

// ===== INSTALL: Pre-cache static assets =====
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE: Clean up old caches =====
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ===== FETCH: Network-first strategy =====
self.addEventListener("fetch", (event) => {
  // Only handle GET requests for same-origin
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok && event.request.destination === "image") {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ===== PUSH NOTIFICATIONS =====
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Bus Dorkar", body: event.data.text() };
  }

  const options = {
    body: data.body || "You have a new notification from Bus Dorkar.",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [100, 50, 100],
    tag: data.tag || "bus-dorkar-notification",
    renotify: true,
    data: {
      url: data.url || "/dashboard/bookings",
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: "view", title: "View Details" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Bus Dorkar", options)
  );
});

// ===== NOTIFICATION CLICK =====
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
