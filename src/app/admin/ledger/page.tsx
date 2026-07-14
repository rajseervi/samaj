"use client";

import { useState, useEffect, FormEvent } from "react";
import { getLedger, saveLedgerEntry, deleteLedgerEntry, getAccounts, getDonators } from "@/lib/db";
import type { LedgerEntry, Account, Donator, TransactionType, TransactionCategory } from "@/types";

type FilterPeriod = "all" | "today" | "week" | "month";

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [donators, setDonators] = useState<Donator[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  // Form state
  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formType, setFormType] = useState<TransactionType>("credit");
  const [formCategory, setFormCategory] = useState<TransactionCategory>("donation");
  const [formAmount, setFormAmount] = useState(0);
  const [formDescription, setFormDescription] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formDonatorId, setFormDonatorId] = useState("");
  const [formReference, setFormReference] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setEntries(await getLedger());
    setAccounts(await getAccounts());
    setDonators(await getDonators());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-generate reference number
  useEffect(() => {
    if (!formReference) {
      const prefix = formType === "credit" ? "DON" : "EXP";
      const now = new Date();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const y = now.getFullYear();
      const rand = String(Math.floor(Math.random() * 900) + 100);
      setFormReference(`${prefix}/${y}-${m}/${rand}`);
    }
  }, [formType, formReference]);

  const openAdd = () => {
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormType("credit");
    setFormCategory("donation");
    setFormAmount(0);
    setFormDescription("");
    setFormAccountId(accounts[0]?.id || "");
    setFormDonatorId("");
    setFormReference("");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप इस लेन-देन को हटाना चाहते हैं?")) return;
    await deleteLedgerEntry(id);
    await loadData();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formAccountId) return;
    setSaving(true);

    await saveLedgerEntry({
      date: formDate,
      type: formType,
      category: formCategory,
      amount: formAmount,
      description: formDescription,
      accountId: formAccountId,
      donatorId: formCategory === "donation" ? formDonatorId || undefined : undefined,
      reference: formReference,
    });

    setSaving(false);
    setShowModal(false);
    await loadData();
  };

  /* ─── Filtering ─── */
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const getWeekStart = () => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  };

  const getMonthStart = () => {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  };

  const filtered = entries.filter((e) => {
    if (filterType !== "all" && e.type !== filterType) return false;
    if (filterPeriod === "today" && e.date !== todayStr) return false;
    if (filterPeriod === "week" && e.date < getWeekStart()) return false;
    if (filterPeriod === "month" && e.date < getMonthStart()) return false;
    return true;
  });

  const getAccountName = (id: string) => accounts.find((a) => a.id === id)?.name || id;
  const getDonatorName = (id?: string) => {
    if (!id) return "";
    return donators.find((d) => d.id === id)?.name || "";
  };

  const totalCredit = filtered.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
  const totalDebit = filtered.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0);

  const catLabels: Record<TransactionCategory, string> = {
    donation: "दान",
    expense: "खर्च",
    transfer: "स्थानांतरण",
    salary: "वेतन",
    maintenance: "रखरखाव",
    utility: "उपयोगिता",
    other: "अन्य",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000]">📒 बही-खाता</h1>
          <p className="text-[#B8860B] font-medium mt-1">
            कुल {entries.length} प्रविष्टियाँ
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] transition flex items-center gap-2 text-sm"
        >
          <span>➕</span> नई प्रविष्टि
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
          className="px-3 py-2 border-2 border-[#DAA520] rounded-xl bg-white text-[#4A2800] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
        >
          <option value="all">सभी समय</option>
          <option value="today">आज</option>
          <option value="week">इस सप्ताह</option>
          <option value="month">इस महीने</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as TransactionType | "all")}
          className="px-3 py-2 border-2 border-[#DAA520] rounded-xl bg-white text-[#4A2800] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
        >
          <option value="all">सभी प्रकार</option>
          <option value="credit">जमा (क्रेडिट)</option>
          <option value="debit">निकासी (डेबिट)</option>
        </select>

        {filtered.length > 0 && (
          <div className="flex items-center gap-4 text-sm font-bold ml-auto">
            <span className="text-green-700">जमा: ₹ {totalCredit.toLocaleString("en-IN")}</span>
            <span className="text-red-700">निकासी: ₹ {totalDebit.toLocaleString("en-IN")}</span>
            <span className="text-[#8B0000]">शेष: ₹ {(totalCredit - totalDebit).toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white">
                <th className="text-left px-4 py-3 font-bold">दिनांक</th>
                <th className="text-left px-4 py-3 font-bold">विवरण</th>
                <th className="text-left px-4 py-3 font-bold">श्रेणी</th>
                <th className="text-left px-4 py-3 font-bold">खाता</th>
                <th className="text-left px-4 py-3 font-bold">संदर्भ</th>
                <th className="text-right px-4 py-3 font-bold">जमा</th>
                <th className="text-right px-4 py-3 font-bold">निकासी</th>
                <th className="text-center px-4 py-3 font-bold">कार्य</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#C4A35A] font-medium">
                    कोई लेन-देन नहीं मिला
                  </td>
                </tr>
              ) : (
                filtered.map((e, i) => (
                  <tr
                    key={e.id}
                    className={`border-t border-[#DAA520]/30 ${
                      i % 2 === 0 ? "bg-[#FFF8E7]" : "bg-white"
                    } hover:bg-[#FFF3D6] transition`}
                  >
                    <td className="px-4 py-3 font-semibold text-[#4A2800] whitespace-nowrap">
                      {e.date}
                    </td>
                    <td className="px-4 py-3 text-[#5C3317] max-w-[200px]">
                      <p className="truncate font-medium" title={e.description}>
                        {e.description}
                      </p>
                      {e.donatorId && (
                        <p className="text-xs text-[#B8860B]">{getDonatorName(e.donatorId)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFF3D6] text-[#8B0000] border border-[#DAA520]/50">
                        {catLabels[e.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5C3317] max-w-[120px] truncate" title={getAccountName(e.accountId)}>
                      {getAccountName(e.accountId)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#B8860B] font-mono">{e.reference}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-green-700 whitespace-nowrap">
                      {e.type === "credit" ? `₹ ${e.amount.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-red-700 whitespace-nowrap">
                      {e.type === "debit" ? `₹ ${e.amount.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-2 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                        title="हटाएं"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#DAA520] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-[#DAA520]/30">
              <h2 className="text-xl font-extrabold text-[#8B0000]">➕ नई प्रविष्टि जोड़ें</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Date + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">दिनांक *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">प्रकार *</label>
                  <select
                    value={formType}
                    onChange={(e) => {
                      setFormType(e.target.value as TransactionType);
                      setFormReference("");
                    }}
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  >
                    <option value="credit">💰 जमा (क्रेडिट)</option>
                    <option value="debit">💸 निकासी (डेबिट)</option>
                  </select>
                </div>
              </div>

              {/* Category + Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">श्रेणी *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TransactionCategory)}
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  >
                    <option value="donation">दान</option>
                    <option value="expense">खर्च</option>
                    <option value="transfer">स्थानांतरण</option>
                    <option value="salary">वेतन</option>
                    <option value="maintenance">रखरखाव</option>
                    <option value="utility">उपयोगिता</option>
                    <option value="other">अन्य</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">राशि (₹) *</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    min="1"
                    required
                    placeholder="राशि दर्ज करें"
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">विवरण *</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                  placeholder="लेन-देन का विवरण"
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              {/* Account + Donator */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">खाता *</label>
                  <select
                    value={formAccountId}
                    onChange={(e) => setFormAccountId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  >
                    <option value="">— चुनें —</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} (₹ {a.balance.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">
                    भामाशाह {formCategory === "donation" ? "" : "(वैकल्पिक)"}
                  </label>
                  <select
                    value={formDonatorId}
                    onChange={(e) => setFormDonatorId(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  >
                    <option value="">— कोई नहीं —</option>
                    {donators.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.village})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reference */}
              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">संदर्भ संख्या</label>
                <input
                  type="text"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  placeholder="DON/2026-07/001"
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !formAccountId}
                  className="flex-1 px-5 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] disabled:opacity-60 transition"
                >
                  {saving ? "सहेज रहा है..." : "✅ जोड़ें"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
