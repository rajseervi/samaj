"use client";

import { useState, useEffect } from "react";
import { getDashboardStats, getAccounts, getDonators, getLedger } from "@/lib/db";
import type { DashboardStats, Account, Donator, LedgerEntry } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [donators, setDonators] = useState<Donator[]>([]);
  const [allEntries, setAllEntries] = useState<LedgerEntry[]>([]);

  useEffect(() => {
    (async () => {
      setStats(await getDashboardStats());
      setAccounts(await getAccounts());
      setDonators(await getDonators());
      setAllEntries(await getLedger());
    })();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Compute monthly summary for current year
  const currentYear = new Date().getFullYear();
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    const monthEntries = allEntries.filter((e) => e.date.startsWith(`${currentYear}-${m}`));
    const credit = monthEntries.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
    const debit = monthEntries.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0);
    return { month: i, label: getMonthLabel(i), credit, debit };
  });

  const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.credit, d.debit, 1)));

  // Top 5 donators
  const topDonators = [...donators].sort((a, b) => b.totalDonation - a.totalDonation).slice(0, 5);

  // Recent 5 entries
  const recentEntries = allEntries.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000]">
            📊 डैशबोर्ड
          </h1>
          <p className="text-[#B8860B] font-medium mt-1">
            श्री अखिल भारतीय सीरवी समाज ट्रस्ट हरिद्वार भवन की भोजनशाला का सम्पूर्ण विवरण
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/ledger"
            className="px-4 py-2 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] transition text-sm"
          >
            📒 नई प्रविष्टि
          </a>
          <a
            href="/admin/donators"
            className="px-4 py-2 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition text-sm"
          >
            👥 भामाशाह
          </a>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon="👥" label="कुल भामाशाह" value={stats.totalDonators} color="from-blue-600 to-blue-800" />
        <StatCard icon="💰" label="कुल दान" value={`₹ ${formatNumber(stats.totalDonations)}`} color="from-green-600 to-green-800" />
        <StatCard icon="💸" label="कुल खर्च" value={`₹ ${formatNumber(stats.totalExpenses)}`} color="from-red-600 to-red-800" />
        <StatCard icon="🏦" label="शेष राशि" value={`₹ ${formatNumber(stats.balance)}`} color="from-[#8B0000] to-[#5C0000]" />
      </div>

      {/* ─── Chart + Top Donators Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Chart (spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-5">
          <h2 className="text-lg font-extrabold text-[#8B0000] mb-4 flex items-center gap-2">
            <span>📈</span> मासिक आय-व्यय ({currentYear})
          </h2>
          <div className="flex items-end gap-1.5 sm:gap-2 h-40 sm:h-48">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                {/* Debit (red) */}
                <div
                  className="w-full max-w-[32px] bg-red-500 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(d.debit / maxVal) * 100}%` }}
                  title={`${d.label} - खर्च: ₹${formatNumber(d.debit)}`}
                />
                {/* Credit (green) */}
                <div
                  className="w-full max-w-[32px] bg-green-500 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(d.credit / maxVal) * 100}%` }}
                  title={`${d.label} - दान: ₹${formatNumber(d.credit)}`}
                />
                <span className="text-[9px] sm:text-[10px] font-bold text-[#5C3317] mt-1 text-center leading-tight">
                  {getShortMonthLabel(d.month)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-[#B8860B]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-sm" /> दान</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-sm" /> खर्च</span>
          </div>
        </div>

        {/* Top 5 Donators */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-5">
          <h2 className="text-lg font-extrabold text-[#8B0000] mb-4 flex items-center gap-2">
            <span>🏆</span> शीर्ष भामाशाह
          </h2>
          {topDonators.length === 0 ? (
            <p className="text-[#C4A35A] text-sm font-medium text-center py-8">कोई भामाशाह नहीं</p>
          ) : (
            <div className="space-y-2.5">
              {topDonators.map((d, i) => (
                <div key={d.id} className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-700' : 'bg-[#8B0000]/60'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#4A2800] truncate">{d.name}</p>
                    <p className="text-[10px] text-[#B8860B]">{d.village}</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#8B0000] whitespace-nowrap">
                    ₹ {formatNumber(d.totalDonation)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a href="/admin/donators" className="inline-block mt-3 text-xs font-bold text-[#FF9933] hover:text-[#E88920] transition">
            सभी भामाशाह देखें →
          </a>
        </div>
      </div>

      {/* ─── Two-Column: Recent + Accounts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-5">
          <h2 className="text-lg font-extrabold text-[#8B0000] mb-4 flex items-center gap-2">
            <span>📋</span> हाल की लेन-देन
          </h2>
          {recentEntries.length === 0 ? (
            <p className="text-[#C4A35A] text-sm font-medium text-center py-8">कोई लेन-देन नहीं</p>
          ) : (
            <div className="space-y-2.5">
              {recentEntries.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8E7] border border-[#DAA520]/40">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#4A2800] truncate">{tx.description}</p>
                    <p className="text-xs text-[#B8860B] mt-0.5">{tx.date} • {tx.reference}</p>
                  </div>
                  <span className={`ml-3 text-sm font-extrabold whitespace-nowrap ${tx.type === "credit" ? "text-green-700" : "text-red-700"}`}>
                    {tx.type === "credit" ? "+" : "-"}₹ {formatNumber(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a href="/admin/ledger" className="inline-block mt-3 text-sm font-bold text-[#FF9933] hover:text-[#E88920] transition">
            सभी लेन-देन देखें →
          </a>
        </div>

        {/* Accounts Summary */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-5">
          <h2 className="text-lg font-extrabold text-[#8B0000] mb-4 flex items-center gap-2">
            <span>🏦</span> खातों का सारांश
          </h2>
          {accounts.length === 0 ? (
            <p className="text-[#C4A35A] text-sm font-medium text-center py-8">कोई खाता नहीं</p>
          ) : (
            <div className="space-y-2.5">
              {accounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8E7] border border-[#DAA520]/40">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#4A2800] truncate">{acc.name}</p>
                    <p className="text-xs text-[#B8860B] mt-0.5">
                      {acc.type === "bank" ? "🏦 बैंक" : acc.type === "cash" ? "💵 रोकड़" : "📱 डिजिटल"}
                    </p>
                  </div>
                  <span className="ml-3 text-sm font-extrabold text-[#8B0000] whitespace-nowrap">₹ {formatNumber(acc.balance)}</span>
                </div>
              ))}
            </div>
          )}
          <a href="/admin/accounts" className="inline-block mt-3 text-sm font-bold text-[#FF9933] hover:text-[#E88920] transition">
            सभी खाते देखें →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card Component ─── */
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white p-4 sm:p-5`}>
      <div className="relative z-10">
        <div className="text-2xl sm:text-3xl mb-1.5">{icon}</div>
        <p className="text-xs sm:text-sm font-semibold text-white/80">{label}</p>
        <p className="text-lg sm:text-2xl font-extrabold mt-0.5">{value}</p>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
    </div>
  );
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

function getMonthLabel(i: number): string {
  const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
  return months[i];
}

function getShortMonthLabel(i: number): string {
  const months = ["जन", "फर", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"];
  return months[i];
}
