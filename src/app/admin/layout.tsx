"use client";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const NAV_ITEMS = [
  { label: "डैशबोर्ड", href: "/admin/dashboard", icon: "📊" },
  { label: "भामाशाह सूची", href: "/admin/donators", icon: "👥" },
  { label: "खाते", href: "/admin/accounts", icon: "💰" },
  { label: "बही-खाता", href: "/admin/ledger", icon: "📒" },
  { label: "पोस्टर", href: "/admin/posters", icon: "📋" },
  { label: "पूछताछ", href: "/admin/enquiries", icon: "📨" },
];

function AdminShell({ children }: { children: ReactNode }) {
  const { isLoggedIn, logout, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [permError, setPermError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => setPermError(e.detail);
    window.addEventListener("firestore-permission-error", handler as EventListener);
    return () => window.removeEventListener("firestore-permission-error", handler as EventListener);
  }, []);

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

  useEffect(() => {
    if (!isLoggedIn && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoggedIn, isLoginPage, router]);

  // Redirect side-effects must be in useEffects, not in render body
  useEffect(() => {
    if (isLoginPage && isLoggedIn) {
      router.replace("/admin/dashboard");
    }
  }, [isLoginPage, isLoggedIn, router]);

  if (!isLoggedIn && !isLoginPage) {
    return null;
  }

  // Login page — render children without shell
  if (isLoginPage && !isLoggedIn) {
    return <>{children}</>;
  }

  // Logged in on login page — don't render shell while redirecting
  if (isLoginPage && isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-[#8B0000] to-[#5C0000] text-white flex flex-col shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#FFD700]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-[#8B0000] text-xl font-bold shadow-lg">
              🕉️
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#FFD700] leading-tight">
                सीरवी समाज
              </p>
              <p className="text-[10px] text-white/70 leading-tight">
                प्रबंधन पैनल
              </p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#FFD700]">👤</span>
            <span className="font-semibold text-white/90">{user?.name}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setSidebarOpen(false);
                  router.push(item.href);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-[#FFD700] text-[#8B0000] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-semibold text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <span>🚪</span>
            <span>लॉगआउट</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white px-4 py-3 flex items-center gap-3 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-bold text-sm">सीरवी समाज प्रबंधन</span>
        </header>

        {/* ─── Firestore Permission Error Banner ─── */}
        {permError && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 bg-red-50 border-2 border-red-400 rounded-2xl shadow-lg overflow-hidden" role="alert">
            <div className="bg-red-600 text-white px-5 py-3 flex items-center justify-between">
              <span className="font-bold text-base">🔥 Firestore Permission Denied</span>
              <button onClick={() => setPermError(null)} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 text-sm text-red-900 leading-relaxed whitespace-pre-line font-mono">
              {permError}
            </div>
            <div className="px-5 pb-4">
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-md"
              >
                🚀 Open Firebase Console
              </a>
            </div>
          </div>
        )}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
