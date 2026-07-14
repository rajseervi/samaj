"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/types";

interface AuthContextValue {
  user: AdminUser | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* ─── Hardcoded admin credentials (change these in production) ─── */
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "प्रबंधक";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("samaj_admin_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
    setIsInitialized(true);
  }, []);

  const login = useCallback(
    (username: string, password: string): boolean => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const u: AdminUser = { username, name: ADMIN_NAME };
        setUser(u);
        localStorage.setItem("samaj_admin_user", JSON.stringify(u));
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("samaj_admin_user");
    router.push("/admin");
  }, [router]);

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
