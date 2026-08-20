// Extended Dev Store for Passenger Extras: Notifications, Saved Items, Payment Logs

export interface PassengerNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "BOOKING" | "PAYMENT" | "SYSTEM" | "PROMO";
  read: boolean;
  createdAt: string;
}

export interface SavedPassenger {
  id: string;
  userId: string;
  name: string;
  phone: string;
  gender: string;
}

export interface SavedRoute {
  id: string;
  userId: string;
  fromDistrictId: string;
  fromDistrictName: string;
  toDistrictId: string;
  toDistrictName: string;
}

const globalForExtras = globalThis as unknown as {
  devNotifications: Map<string, PassengerNotification[]> | undefined;
  devSavedPassengers: Map<string, SavedPassenger[]> | undefined;
  devSavedRoutes: Map<string, SavedRoute[]> | undefined;
};

export const devNotifications =
  globalForExtras.devNotifications ?? new Map<string, PassengerNotification[]>();
export const devSavedPassengers =
  globalForExtras.devSavedPassengers ?? new Map<string, SavedPassenger[]>();
export const devSavedRoutes =
  globalForExtras.devSavedRoutes ?? new Map<string, SavedRoute[]>();

if (process.env.NODE_ENV !== "production") {
  globalForExtras.devNotifications = devNotifications;
  globalForExtras.devSavedPassengers = devSavedPassengers;
  globalForExtras.devSavedRoutes = devSavedRoutes;
}

/** Get notifications for a user */
export function getDevNotifications(userId: string): PassengerNotification[] {
  if (!devNotifications.has(userId)) {
    // Seed mock initial welcome notification
    const initial: PassengerNotification[] = [
      {
        id: "notif-1",
        userId,
        title: "Welcome to Bus Dorkar! 🚌",
        message: "Search buses across 24+ districts in Bangladesh with real-time seat tracking.",
        type: "SYSTEM",
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];
    devNotifications.set(userId, initial);
  }
  return devNotifications.get(userId) || [];
}

/** Add a new notification */
export function addDevNotification(
  userId: string,
  notif: Omit<PassengerNotification, "id" | "userId" | "createdAt" | "read">
) {
  const list = getDevNotifications(userId);
  const newNotif: PassengerNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    userId,
    read: false,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newNotif);
  devNotifications.set(userId, list);
  return newNotif;
}

/** Mark notification as read */
export function markNotificationRead(userId: string, notifId: string) {
  const list = getDevNotifications(userId);
  const notif = list.find((n) => n.id === notifId);
  if (notif) notif.read = true;
  devNotifications.set(userId, list);
}

/** Get saved passengers */
export function getDevSavedPassengers(userId: string): SavedPassenger[] {
  return devSavedPassengers.get(userId) || [];
}

/** Add saved passenger */
export function addDevSavedPassenger(userId: string, passenger: Omit<SavedPassenger, "id" | "userId">) {
  const list = getDevSavedPassengers(userId);
  const newP: SavedPassenger = { ...passenger, id: `sp-${Date.now()}`, userId };
  list.push(newP);
  devSavedPassengers.set(userId, list);
  return newP;
}

/** Delete saved passenger */
export function deleteDevSavedPassenger(userId: string, passengerId: string) {
  const list = getDevSavedPassengers(userId).filter((p) => p.id !== passengerId);
  devSavedPassengers.set(userId, list);
}

/** Get saved routes */
export function getDevSavedRoutes(userId: string): SavedRoute[] {
  return devSavedRoutes.get(userId) || [];
}

/** Add saved route */
export function addDevSavedRoute(userId: string, route: Omit<SavedRoute, "id" | "userId">) {
  const list = getDevSavedRoutes(userId);
  const newR: SavedRoute = { ...route, id: `sr-${Date.now()}`, userId };
  list.push(newR);
  devSavedRoutes.set(userId, list);
  return newR;
}

/** Delete saved route */
export function deleteDevSavedRoute(userId: string, routeId: string) {
  const list = getDevSavedRoutes(userId).filter((r) => r.id !== routeId);
  devSavedRoutes.set(userId, list);
}
