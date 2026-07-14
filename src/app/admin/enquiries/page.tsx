"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry, type Enquiry } from "@/lib/db";

const TYPE_LABELS: Record<Enquiry["type"], { label: string; icon: string }> = {
  poster: { label: "पोस्टर", icon: "📋" },
  donation: { label: "दान", icon: "💰" },
  seva: { label: "सेवा", icon: "🙏" },
  general: { label: "सामान्य", icon: "💬" },
};

const STATUS_LABELS: Record<Enquiry["status"], { label: string; color: string }> = {
  new: { label: "नई", color: "bg-blue-100 text-blue-800 border-blue-300" },
  read: { label: "पढ़ी हुई", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  resolved: { label: "हल हुई", color: "bg-green-100 text-green-800 border-green-300" },
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Enquiry["status"] | "all">("all");

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const data = await getEnquiries();
    setEnquiries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleStatusChange = async (id: string, status: Enquiry["status"]) => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप वाकई इस पूछताछ को हटाना चाहते हैं?")) return;
    await deleteEnquiry(id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    read: enquiries.filter((e) => e.status === "read").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000]">📨 पूछताछ प्रबंधन</h1>
          <p className="text-[#B8860B] font-semibold text-sm mt-1">
            संपर्क फॉर्म से आई हुई सभी पूछताछ
          </p>
        </div>
        <button
          onClick={fetchEnquiries}
          className="px-4 py-2 bg-[#FF9933] text-white font-bold rounded-xl hover:bg-[#E88920] transition shadow-md text-sm"
        >
          🔄 रिफ्रेश
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "new", "read", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
              filter === f
                ? "bg-[#8B0000] text-[#FFD700] border-[#8B0000]"
                : "bg-white text-[#8B0000] border-[#DAA520]/40 hover:border-[#FF9933]"
            }`}
          >
            {f === "all" ? "सभी" : STATUS_LABELS[f].label}
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-black/10 text-xs">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <span className="text-4xl animate-spin inline-block">⏳</span>
          <p className="text-[#B8860B] font-semibold mt-2">लोड हो रहा है...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-12 text-center">
          <span className="text-5xl block mb-3">📭</span>
          <h3 className="text-xl font-extrabold text-[#8B0000] mb-2">कोई पूछताछ नहीं</h3>
          <p className="text-[#B8860B] font-semibold text-sm">
            {filter === "all" ? "अभी तक कोई पूछताछ प्राप्त नहीं हुई है।" : `"${STATUS_LABELS[filter as Enquiry['status']].label}" स्थिति में कोई पूछताछ नहीं है।`}
          </p>
        </div>
      )}

      {/* Enquiry Cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white rounded-2xl shadow-md border-2 border-[#DAA520]/30 hover:border-[#FF9933]/50 transition-all overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  {/* Name and type */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5] flex items-center justify-center text-lg border border-[#DAA520]/40 flex-shrink-0">
                      {TYPE_LABELS[enquiry.type].icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#8B0000] text-base">{enquiry.name}</h3>
                      <p className="text-xs text-[#B8860B] font-semibold">
                        {TYPE_LABELS[enquiry.type].label} • {enquiry.village || "गाँव नहीं बताया"}
                      </p>
                    </div>
                  </div>

                  {/* Status and date */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_LABELS[enquiry.status].color}`}>
                      {STATUS_LABELS[enquiry.status].label}
                    </span>
                    <span className="text-xs text-[#B8860B]/70 font-semibold">
                      {new Date(enquiry.createdAt).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Message */}
                {enquiry.message && (
                  <div className="mb-3 p-3 bg-[#FFFDF5] rounded-xl border border-[#DAA520]/20">
                    <p className="text-sm text-[#5C3317] leading-relaxed">{enquiry.message}</p>
                  </div>
                )}

                {/* Phone */}
                <div className="mb-3 flex items-center gap-4">
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF9933] hover:text-[#E88920] transition"
                  >
                    <span>📞</span>
                    <span>{enquiry.phone}</span>
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#DAA520]/20">
                  {/* Status change buttons */}
                  {enquiry.status !== "read" && (
                    <button
                      onClick={() => handleStatusChange(enquiry.id, "read")}
                      className="px-3 py-1.5 bg-yellow-100 text-yellow-800 font-bold text-xs rounded-lg border border-yellow-300 hover:bg-yellow-200 transition"
                    >
                      📖 पढ़ी हुई
                    </button>
                  )}
                  {enquiry.status !== "resolved" && (
                    <button
                      onClick={() => handleStatusChange(enquiry.id, "resolved")}
                      className="px-3 py-1.5 bg-green-100 text-green-800 font-bold text-xs rounded-lg border border-green-300 hover:bg-green-200 transition"
                    >
                      ✅ हल हुई
                    </button>
                  )}
                  {enquiry.status !== "new" && (
                    <button
                      onClick={() => handleStatusChange(enquiry.id, "new")}
                      className="px-3 py-1.5 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg border border-blue-300 hover:bg-blue-200 transition"
                    >
                      🔵 नई
                    </button>
                  )}
                  <div className="flex-1" />
                  <button
                    onClick={() => handleDelete(enquiry.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 font-bold text-xs rounded-lg border border-red-300 hover:bg-red-200 transition"
                  >
                    🗑️ हटाएं
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
