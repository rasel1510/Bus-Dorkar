"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserSession {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  role: "PASSENGER" | "BUS_OPERATOR" | "COUNTER_STAFF" | "DRIVER" | "ADMIN";
  avatar?: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (userData: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = "busdorkar_user_session";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, val: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(val)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      // 1. Try server-side HttpOnly session check first ($O(1)$ response)
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
          setIsLoading(false);
          return;
        }
      }

      // 2. Fallback to client storage
      let storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedUser) {
        const cookieVal = getCookie(AUTH_STORAGE_KEY);
        if (cookieVal) {
          storedUser = decodeURIComponent(cookieVal);
        }
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();

    const handleAuthChange = () => loadSession();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [loadSession]);

  const login = (userData: UserSession) => {
    setUser(userData);
    const jsonStr = JSON.stringify(userData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, jsonStr);
      setCookie(AUTH_STORAGE_KEY, jsonStr);
      window.dispatchEvent(new Event("auth-change"));
    } catch (e) {
      console.error("Failed to save user session:", e);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      deleteCookie(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event("auth-change"));
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Failed to clear server session:", e);
    }
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
