// Profile service — dev-store backed profile management

import { DevUser, devUserStore, findDevUser } from "@/lib/dev-store";

export interface ProfileData {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  emergencyContact: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
}

// Global profile extensions store (fields beyond the base DevUser)
const globalForProfiles = globalThis as unknown as {
  devProfileExtras: Map<string, Partial<ProfileData>> | undefined;
};
const profileExtras = globalForProfiles.devProfileExtras ?? new Map<string, Partial<ProfileData>>();
if (process.env.NODE_ENV !== "production") {
  globalForProfiles.devProfileExtras = profileExtras;
}

export function getProfileByUserId(userId: string): ProfileData | null {
  // Search through devUserStore to find user by ID
  for (const user of devUserStore.values()) {
    if (user.id === userId) {
      const extras = profileExtras.get(userId) || {};
      return {
        id: user.id,
        name: extras.name || user.name,
        email: extras.email !== undefined ? extras.email : (user.email || null),
        phone: user.phone,
        role: user.role,
        emergencyContact: extras.emergencyContact || null,
        gender: extras.gender || null,
        dateOfBirth: extras.dateOfBirth || null,
        address: extras.address || null,
      };
    }
  }

  // Return a default profile based on userId for dev mode
  return {
    id: userId,
    name: "Passenger",
    email: null,
    phone: "+8801700000000",
    role: "PASSENGER",
    emergencyContact: null,
    gender: null,
    dateOfBirth: null,
    address: null,
  };
}

export function updateProfile(userId: string, updates: Partial<ProfileData>): ProfileData | null {
  const existing = profileExtras.get(userId) || {};
  const merged = { ...existing, ...updates };
  profileExtras.set(userId, merged);

  // Also update the devUserStore name/email if changed
  for (const [key, user] of devUserStore.entries()) {
    if (user.id === userId) {
      if (updates.name) user.name = updates.name;
      if (updates.email !== undefined) user.email = updates.email;
      devUserStore.set(key, user);
    }
  }

  return getProfileByUserId(userId);
}
