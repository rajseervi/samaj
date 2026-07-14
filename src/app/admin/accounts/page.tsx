"use client";

import { useState, useEffect, FormEvent } from "react";
import { getAccounts, saveAccount, updateAccount, deleteAccount } from "@/lib/db";
import type { Account } from "@/types";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<Account["type"]>("bank");
  const [formBalance, setFormBalance] = useState(0);
  const [formDesc, setFormDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setAccounts(await getAccounts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormName("");
    setFormType("bank");
    setFormBalance(0);
    setFormDesc("");
    setShowModal(true);
  };

  const openEdit = (a: Account) => {
    setEditing(a);
    setFormName(a.name);
    setFormType(a.type);
    setFormBalance(a.balance);
    setFormDesc(a.description);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप "${name}" को हटाना चाहते हैं?`)) return;
    await deleteAccount(id);
    await loadData();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editing) {
      await updateAccount(editing.id, {
        name: formName,
        type: formType,
        balance: formBalance,
        description: formDesc,
      });
    } else {
      await saveAccount({
        name: formName,
        type: formType,
        balance: formBalance,
        description: formDesc,
      });
    }

    setSaving(false);
    setShowModal(false);
    await loadData();
  };

  const typeIcon = (t: Account["type"]) => (t === "bank" ? "🏦" : t === "cash" ? "💵" : "📱");
  const typeLabel = (t: Account["type"]) =>
    t === "bank" ? "बैंक खाता" : t === "cash" ? "रोकड़ खाता" : "डिजिटल खाता";

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000]">💰 खाते</h1>
          <p className="text-[#B8860B] font-medium mt-1">
            कुल शेष: <span className="font-extrabold text-[#8B0000]">₹ {totalBalance.toLocaleString("en-IN")}</span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] transition flex items-center gap-2 text-sm"
        >
          <span>➕</span> नया खाता जोड़ें
        </button>
      </div>

      {/* Cards */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-12 text-center">
          <p className="text-[#C4A35A] font-medium text-lg">कोई खाता नहीं</p>
          <p className="text-[#C4A35A] text-sm mt-1">कृपया एक नया खाता जोड़ें</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] overflow-hidden hover:shadow-xl transition"
            >
              {/* Colored top bar */}
              <div
                className={`h-2 ${
                  a.type === "bank"
                    ? "bg-blue-600"
                    : a.type === "cash"
                    ? "bg-green-600"
                    : "bg-purple-600"
                }`}
              />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeIcon(a.type)}</span>
                    <div>
                      <h3 className="font-extrabold text-[#4A2800] leading-tight">{a.name}</h3>
                      <span className="text-xs font-semibold text-[#B8860B]">{typeLabel(a.type)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-2xl font-extrabold text-[#8B0000] mb-2">
                  ₹ {a.balance.toLocaleString("en-IN")}
                </p>

                {a.description && (
                  <p className="text-xs text-[#5C3317] mb-3">{a.description}</p>
                )}

                <div className="flex gap-2 pt-2 border-t border-[#DAA520]/30">
                  <button
                    onClick={() => openEdit(a)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                  >
                    ✏️ संपादित करें
                  </button>
                  <button
                    onClick={() => handleDelete(a.id, a.name)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                  >
                    🗑️ हटाएं
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#DAA520] w-full max-w-md">
            <div className="px-6 py-5 border-b border-[#DAA520]/30">
              <h2 className="text-xl font-extrabold text-[#8B0000]">
                {editing ? "✏️ खाता संपादित करें" : "➕ नया खाता जोड़ें"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">खाते का नाम *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  placeholder="जैसे: SBI बैंक खाता"
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">खाते का प्रकार</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as Account["type"])}
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                >
                  <option value="bank">🏦 बैंक खाता</option>
                  <option value="cash">💵 रोकड़ खाता</option>
                  <option value="digital">📱 डिजिटल खाता</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">शेष राशि (₹)</label>
                <input
                  type="number"
                  value={formBalance}
                  onChange={(e) => setFormBalance(Number(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5C3317] mb-1">विवरण</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="खाते के बारे में संक्षिप्त जानकारी"
                  className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] disabled:opacity-60 transition"
                >
                  {saving ? "सहेज रहा है..." : editing ? "💾 सहेजें" : "✅ जोड़ें"}
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
