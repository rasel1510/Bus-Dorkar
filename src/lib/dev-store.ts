export interface DevUser {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  role: "PASSENGER" | "BUS_OPERATOR" | "COUNTER_STAFF" | "DRIVER" | "ADMIN";
}

const globalForDevStore = globalThis as unknown as {
  devUserStore: Map<string, DevUser> | undefined;
};

export const devUserStore = globalForDevStore.devUserStore ?? new Map<string, DevUser>();

if (process.env.NODE_ENV !== "production") {
  globalForDevStore.devUserStore = devUserStore;
}

export function saveDevUser(user: DevUser) {
  if (user.phone) devUserStore.set(user.phone, user);
  if (user.email) devUserStore.set(user.email.toLowerCase(), user);
  // Also store by raw phone digits for easy lookup
  const digits = user.phone.replace(/\D/g, "");
  if (digits) devUserStore.set(digits, user);
}

// Pre-seed default Admin user
const defaultAdminUser: DevUser = {
  id: "admin-rasel-001",
  name: "Rasel Admin",
  email: "rasel4897981@gmail.com",
  phone: "+8801700000001",
  role: "ADMIN",
};
saveDevUser(defaultAdminUser);

export function findDevUser(identifier: string): DevUser | undefined {
  const clean = identifier.trim();
  if (devUserStore.has(clean)) return devUserStore.get(clean);
  if (devUserStore.has(clean.toLowerCase())) return devUserStore.get(clean.toLowerCase());
  
  const digits = clean.replace(/\D/g, "");
  if (digits) {
    if (devUserStore.has(digits)) return devUserStore.get(digits);
    for (const [, user] of devUserStore.entries()) {
      if (user.phone && user.phone.replace(/\D/g, "").endsWith(digits.slice(-10))) {
        return user;
      }
    }
  }
  return undefined;
}
