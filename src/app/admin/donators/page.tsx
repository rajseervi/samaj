"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { getDonators, saveDonator, updateDonator, deleteDonator, getLedger } from "@/lib/db";
import type { Donator, LedgerEntry } from "@/types";

type SortKey = "name" | "village" | "totalDonation" | "lastDonationDate";
type SortDir = "asc" | "desc";

export default function DonatorsPage() {
  const [donators, setDonators] = useState<Donator[]>([]);
  const [allLedger, setAllLedger] = useState<LedgerEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Donator | null>(null);
  const [editing, setEditing] = useState<Donator | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalDonation");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Form state
  const [formName, setFormName] = useState("");
  const [formVillage, setFormVillage] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formTotalDonation, setFormTotalDonation] = useState(0);
  const [formLastDate, setFormLastDate] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setDonators(await getDonators());
    setAllLedger(await getLedger());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormName(""); setFormVillage(""); setFormPhone(""); setFormEmail("");
    setFormNotes(""); setFormTotalDonation(0); setFormLastDate("");
    setShowModal(true);
  };

  const openEdit = (d: Donator) => {
    setEditing(d);
    setFormName(d.name); setFormVillage(d.village); setFormPhone(d.phone);
    setFormEmail(d.email); setFormNotes(d.notes); setFormTotalDonation(d.totalDonation);
    setFormLastDate(d.lastDonationDate);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप "${name}" को हटाना चाहते हैं? सारा रिकॉर्ड स्थायी रूप से हट जाएगा।`)) return;
    await deleteDonator(id);
    await loadData();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await updateDonator(editing.id, { name: formName, village: formVillage, phone: formPhone, email: formEmail, totalDonation: formTotalDonation, lastDonationDate: formLastDate, notes: formNotes });
    } else {
      await saveDonator({ name: formName, village: formVillage, phone: formPhone, email: formEmail, totalDonation: formTotalDonation, lastDonationDate: formLastDate, notes: formNotes });
    }
    setSaving(false);
    setShowModal(false);
    await loadData();
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["नाम", "गाँव/शहर", "फ़ोन", "ईमेल", "कुल दान", "अंतिम दान तिथि", "नोट्स"];
    const rows = donators.map((d) => [
      d.name, d.village, d.phone, d.email, d.totalDonation.toString(), d.lastDonationDate, d.notes,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bhamashah-list-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Sorting & filtering
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = donators.filter(
      (d) => d.name.toLowerCase().includes(q) || d.village.toLowerCase().includes(q) || d.phone.includes(q)
    );
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "village") cmp = a.village.localeCompare(b.village);
      else if (sortKey === "totalDonation") cmp = a.totalDonation - b.totalDonation;
      else if (sortKey === "lastDonationDate") cmp = a.lastDonationDate.localeCompare(b.lastDonationDate);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [donators, searchQuery, sortKey, sortDir]);

  const totalDonationSum = donators.reduce((s, d) => s + d.totalDonation, 0);

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="text-left px-4 py-3 font-bold cursor-pointer select-none hover:bg-white/10 transition"
      onClick={() => toggleSort(k)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === k && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
      </span>
    </th>
  );

  // Detail view - donator's transactions
  const donatorTxns = showDetail
    ? allLedger.filter((e) => e.donatorId === showDetail.id).slice(0, 20)
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000]">👥 भामाशाह सूची</h1>
          <p className="text-[#B8860B] font-medium mt-1">
            कुल {donators.length} भामाशाह • कुल दान: <span className="font-extrabold text-[#8B0000]">₹ {formatNumber(totalDonationSum)}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-4 py-2.5 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition flex items-center gap-1.5 text-sm">
            📥 CSV
          </button>
          <button onClick={openAdd} className="px-5 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] transition flex items-center gap-2 text-sm">
            <span>➕</span> नया भामाशाह
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 नाम, गाँव या फ़ोन से खोजें..."
          className="w-full max-w-md px-4 py-2.5 border-2 border-[#DAA520] rounded-xl bg-white text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white">
                <SortHeader label="नाम" k="name" />
                <SortHeader label="गाँव/शहर" k="village" />
                <th className="text-left px-4 py-3 font-bold">फ़ोन</th>
                <SortHeader label="कुल दान" k="totalDonation" />
                <SortHeader label="अंतिम दान" k="lastDonationDate" />
                <th className="text-center px-4 py-3 font-bold">कार्य</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-[#C4A35A] font-medium">कोई भामाशाह नहीं मिला</td></tr>
              ) : (
                filtered.map((d, i) => (
                  <tr key={d.id} className={`border-t border-[#DAA520]/30 ${i % 2 === 0 ? "bg-[#FFF8E7]" : "bg-white"} hover:bg-[#FFF3D6] transition`}>
                    <td className="px-4 py-3">
                      <button onClick={() => setShowDetail(d)} className="font-bold text-[#4A2800] hover:text-[#FF9933] transition text-left">
                        {d.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#5C3317]">{d.village}</td>
                    <td className="px-4 py-3 text-[#5C3317]">{d.phone}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-[#8B0000]">₹ {formatNumber(d.totalDonation)}</td>
                    <td className="px-4 py-3 text-[#5C3317]">{d.lastDonationDate || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => { setShowDetail(d); }} className="px-2.5 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition" title="विवरण">👁️</button>
                        <button onClick={() => openEdit(d)} className="px-2.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition" title="संपादित">✏️</button>
                        <button onClick={() => handleDelete(d.id, d.name)} className="px-2.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition" title="हटाएं">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#DAA520] w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#DAA520]/30 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#8B0000]">{showDetail.name}</h2>
                <p className="text-sm text-[#B8860B]">{showDetail.village}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="text-2xl text-[#B8860B] hover:text-[#8B0000]">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-[#B8860B] font-semibold">📞 फ़ोन:</span> <span className="font-bold text-[#4A2800]">{showDetail.phone || "—"}</span></div>
                <div><span className="text-[#B8860B] font-semibold">✉️ ईमेल:</span> <span className="font-bold text-[#4A2800]">{showDetail.email || "—"}</span></div>
                <div><span className="text-[#B8860B] font-semibold">💰 कुल दान:</span> <span className="font-extrabold text-[#8B0000]">₹ {formatNumber(showDetail.totalDonation)}</span></div>
                <div><span className="text-[#B8860B] font-semibold">📅 अंतिम दान:</span> <span className="font-bold text-[#4A2800]">{showDetail.lastDonationDate || "—"}</span></div>
              </div>
              {showDetail.notes && (
                <div>
                  <p className="text-sm text-[#B8860B] font-semibold mb-1">📝 नोट्स:</p>
                  <p className="text-sm font-medium text-[#4A2800] bg-[#FFF8E7] p-3 rounded-xl border border-[#DAA520]/40">{showDetail.notes}</p>
                </div>
              )}

              {/* Donator's recent transactions */}
              <div>
                <p className="text-sm font-extrabold text-[#8B0000] mb-2">📋 हाल की लेन-देन</p>
                {donatorTxns.length === 0 ? (
                  <p className="text-xs text-[#C4A35A] text-center py-4">कोई लेन-देन नहीं</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {donatorTxns.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between text-xs bg-[#FFF8E7] px-3 py-2 rounded-lg border border-[#DAA520]/30">
                        <span className="text-[#4A2800] font-medium">{tx.date} - {tx.description}</span>
                        <span className={`font-extrabold ${tx.type === "credit" ? "text-green-700" : "text-red-700"}`}>
                          {tx.type === "credit" ? "+" : "-"}₹ {formatNumber(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add/Edit Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#DAA520] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-[#DAA520]/30">
              <h2 className="text-xl font-extrabold text-[#8B0000]">{editing ? "✏️ भामाशाह संपादित करें" : "➕ नया भामाशाह जोड़ें"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">नाम *</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="श्री ... जी"
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">गाँव/शहर</label>
                  <input type="text" value={formVillage} onChange={(e) => setFormVillage(e.target.value)} placeholder="गाँव या शहर का नाम"
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">फ़ोन</label>
                  <input type="text" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="मोबाइल नंबर"
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">ईमेल</label>
                  <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="ईमेल पता"
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">कुल दान (₹)</label>
                  <input type="number" value={formTotalDonation} onChange={(e) => setFormTotalDonation(Number(e.target.value))} min="0"
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#5C3317] mb-1">अंतिम दान तिथि</label>
                  <input type="date" value={formLastDate} onChange={(e) => setFormLastDate(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">नोट्स</label>
                <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} placeholder="कोई विशेष जानकारी..."
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition resize-y" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 px-5 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] disabled:opacity-60 transition">
                  {saving ? "सहेज रहा है..." : editing ? "💾 सहेजें" : "✅ जोड़ें"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition">
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

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}
