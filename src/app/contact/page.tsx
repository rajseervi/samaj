"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getDb } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface EnquiryForm {
  name: string;
  phone: string;
  village: string;
  type: "poster" | "general" | "donation" | "seva";
  message: string;
}

const TYPE_OPTIONS: { value: EnquiryForm["type"]; label: string; icon: string }[] = [
  { value: "poster", label: "पोस्टर बनवाने हेतु", icon: "📋" },
  { value: "donation", label: "दान/सहयोग हेतु", icon: "💰" },
  { value: "seva", label: "सेवा कार्य हेतु", icon: "🙏" },
  { value: "general", label: "सामान्य पूछताछ", icon: "💬" },
];

export default function ContactPage() {
  const [form, setForm] = useState<EnquiryForm>({
    name: "",
    phone: "",
    village: "",
    type: "poster",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError("कृपया नाम और फोन नंबर भरें।");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const db = getDb();
      await addDoc(collection(db, "enquiries"), {
        name: form.name,
        phone: form.phone,
        village: form.village,
        type: form.type,
        message: form.message,
        status: "new",
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setForm({ name: "", phone: "", village: "", type: "poster", message: "" });
    } catch (err) {
      console.error("Submit error:", err);
      setError("कुछ त्रुटि हुई। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-[#FFEDC4] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] flex items-center justify-center text-3xl shadow-lg border-2 border-[#DAA520]">
              🕉️
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#8B0000]">संपर्क करें</h1>
          <p className="text-[#B8860B] font-semibold mt-1 text-sm">
            श्री अखिल भारतीय सीरवी समाज ट्रस्ट, हरिद्वार
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-[#DAA520] p-8 text-center animate-fade-slide-up">
            <span className="text-6xl block mb-4">✅</span>
            <h2 className="text-2xl font-extrabold text-[#8B0000] mb-2">जय माताजी! 🙏</h2>
            <p className="text-[#5C3317] font-semibold mb-4">
              आपका संदेश सफलतापूर्वक प्राप्त हो गया है।
            </p>
            <p className="text-sm text-[#B8860B] mb-6">
              हमारी टीम शीघ्र ही आपसे संपर्क करेगी।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl hover:bg-[#E88920] transition shadow-lg"
              >
                📝 नया संदेश भेजें
              </button>
              <Link
                href="/"
                className="px-6 py-2.5 bg-[#8B0000] text-[#FFD700] font-bold rounded-xl hover:bg-[#5C0000] transition shadow-lg"
              >
                🏠 होम पेज
              </Link>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl border-2 border-[#DAA520] p-6 sm:p-8"
          >
            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-700 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="mb-4">
              <label className="block text-[#8B0000] font-extrabold text-sm mb-1.5">
                👤 नाम <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="अपना पूरा नाम लिखें"
                className="w-full px-4 py-3 border-2 border-[#DAA520]/40 rounded-xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/50 focus:border-[#FF9933] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-[#8B0000] font-extrabold text-sm mb-1.5">
                📞 फोन नंबर <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="उदा. 9876543210"
                className="w-full px-4 py-3 border-2 border-[#DAA520]/40 rounded-xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/50 focus:border-[#FF9933] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 transition-all"
              />
            </div>

            {/* Village */}
            <div className="mb-4">
              <label className="block text-[#8B0000] font-extrabold text-sm mb-1.5">
                🏘️ गाँव / स्थान
              </label>
              <input
                type="text"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder="अपने गाँव का नाम लिखें"
                className="w-full px-4 py-3 border-2 border-[#DAA520]/40 rounded-xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/50 focus:border-[#FF9933] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 transition-all"
              />
            </div>

            {/* Enquiry Type */}
            <div className="mb-4">
              <label className="block text-[#8B0000] font-extrabold text-sm mb-1.5">
                📌 पूछताछ का प्रकार
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, type: opt.value })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                      form.type === opt.value
                        ? "border-[#FF9933] bg-[#FFF3E0] text-[#8B0000] shadow-md"
                        : "border-[#DAA520]/30 bg-white text-[#B8860B] hover:border-[#FF9933]/50"
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-[#8B0000] font-extrabold text-sm mb-1.5">
                ✍️ आपका संदेश
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="अपना संदेश यहाँ लिखें..."
                className="w-full px-4 py-3 border-2 border-[#DAA520]/40 rounded-xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/50 focus:border-[#FF9933] focus:outline-none focus:ring-2 focus:ring-[#FF9933]/20 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF9933] to-[#E07800] text-white font-extrabold text-lg rounded-xl shadow-lg hover:from-[#FF8C00] hover:to-[#CC6600] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  <span>भेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <span>📨</span>
                  <span>संदेश भेजें</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer links */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#B8860B] hover:text-[#8B0000] font-semibold text-sm transition">
            ← होम पेज पर वापस जाएं
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
