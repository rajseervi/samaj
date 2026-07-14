"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate brief delay
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        router.push("/admin/dashboard");
      } else {
        setError("❌ गलत उपयोगकर्ता नाम या पासवर्ड। कृपया पुनः प्रयास करें।");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
      {/* Decorative top border */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_-15px_rgba(139,0,0,0.3)] border-2 border-[#FFD700]/60 bg-white">
          {/* Top gold line */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-8" />

          <div className="px-8 py-10 text-center">
            {/* Logo / Icon */}
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-lg border-2 border-[#FFD700]">
                <span className="text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  🕉️
                </span>
              </div>
            </div>

            <h1 className="text-[#8B0000] font-extrabold text-2xl leading-tight mb-1">
              प्रबंधन पैनल
            </h1>
            <p className="text-[#B8860B] text-sm font-semibold mb-6">
              श्री अखिल भारतीय सीरवी समाज ट्रस्ट हरिद्वार भवन की भोजनशाला
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5C3317] text-left mb-1">
                  उपयोगकर्ता नाम
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="उपयोगकर्ता नाम दर्ज करें"
                  required
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5C3317] text-left mb-1">
                  पासवर्ड
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें"
                  required
                  className="w-full px-4 py-3 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#FF9933] to-[#E88920] text-white font-bold rounded-xl shadow-lg hover:from-[#E88920] hover:to-[#D47A1A] disabled:opacity-60 disabled:cursor-not-allowed transition text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    कृपया प्रतीक्षा करें...
                  </>
                ) : (
                  "🔐 लॉगिन करें"
                )}
              </button>
            </form>

            {/* Back link */}
            <a
              href="/"
              className="inline-block mt-6 text-sm text-[#B8860B] font-semibold hover:text-[#8B0000] transition"
            >
              ← मुख्य पेज पर वापस जाएं
            </a>
          </div>

          {/* Bottom gold line */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-8" />
        </div>
      </div>
    </div>
  );
}
