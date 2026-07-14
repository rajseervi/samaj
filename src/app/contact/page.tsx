"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getDb } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

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
    <div className="min-h-screen bg-[#FFF8E7] relative overflow-hidden">
      <Header />

      {/* === HERO BACKGROUND === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep warm gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-[45vh]"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.25) 0%, transparent 55%),
              radial-gradient(ellipse at 20% 70%, rgba(255,140,0,0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 60%, rgba(255,165,0,0.15) 0%, transparent 40%),
              linear-gradient(170deg, #1a0a00 0%, #3d1500 15%, #6B2F0A 35%, #A0522D 60%, #D2691E 85%, #FF8C00 100%)
            `,
          }}
        />

        {/* Bottom fade */}
        <div className="absolute top-[40vh] left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#FFF8E7]/70 to-[#FFF8E7]"/>

        {/* Ornamental mandala rings (subtle) */}
        <div className="absolute left-1/2 top-[22vh] -translate-x-1/2 -translate-y-1/2">
          <div className="w-[500px] h-[500px] rounded-full border border-dashed border-[#FFD700]/10"
            style={{ marginLeft: "-250px", marginTop: "-250px", animation: "spinSlow 30s linear infinite" }} />
          <div className="w-[380px] h-[380px] rounded-full border border-[#DAA520]/10"
            style={{ top: "60px", left: "60px", position: "absolute", animation: "spinSlow 22s linear infinite reverse" }} />
          <div className="w-[260px] h-[260px] rounded-full border-2 border-dotted border-[#FFD700]/12"
            style={{ top: "120px", left: "120px", position: "absolute", animation: "spinSlow 16s linear infinite" }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`fp-${i}`}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 5}px`,
                height: `${2 + Math.random() * 5}px`,
                background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFA500" : "#FF8C00",
                boxShadow: `0 0 ${4 + Math.random() * 6}px ${i % 3 === 0 ? "#FFD700" : "#FFA500"}`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                opacity: 0,
                animation: `floatParticle ${5 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* === PAGE CONTENT === */}
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero header section */}
          <div className="text-center mb-14">
            {/* Gold Om */}
            <Link href="/" className="inline-block mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#FFD700] via-[#DAA520] to-[#B8860B] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]/60 relative"
                style={{ boxShadow: "0 0 60px rgba(255,215,0,0.3), 0 0 100px rgba(255,165,0,0.15), 0 0 150px rgba(255,140,0,0.1)" }}>
                <img src="/om-gold.svg" alt="ॐ" className="w-16 h-16 scale-110" />
              </div>
            </Link>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-[0_2px_12px_rgba(139,0,0,0.5)]"
              style={{ textShadow: "2px 2px 0 #8B0000, 4px 4px 0 rgba(0,0,0,0.2), 0 0 60px rgba(255,215,0,0.2)" }}>
              संपर्क करें
            </h1>

            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent rounded"/>
              <span className="text-[#FFD700]/80 text-2xl">✦</span>
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent rounded"/>
            </div>

            <p className="text-lg text-[#FFD700]/90 font-bold max-w-xl mx-auto leading-relaxed">
              श्री अखिल भारतीय सीरवी समाज ट्रस्ट, हरिद्वार भवन की भोजनशाला
            </p>
            <p className="text-sm text-white/60 mt-2 font-semibold">
              आपके सुझाव, पूछताछ और सेवा भाव का स्वागत है
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border-3 border-[#DAA520] p-10 text-center animate-fade-slide-up"
                style={{ borderWidth: "3px" }}>
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#4CAF50]/10 to-[#4CAF50]/20 flex items-center justify-center border-2 border-[#4CAF50]/30">
                  <span className="text-4xl">✅</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#8B0000] mb-2">जय माताजी! 🙏</h2>
                <p className="text-[#5C3317] font-semibold mb-2">
                  आपका संदेश सफलतापूर्वक प्राप्त हो गया है।
                </p>
                <p className="text-sm text-[#B8860B] mb-8">
                  हमारी टीम शीघ्र ही आपसे संपर्क करेगी।
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-7 py-3 bg-gradient-to-r from-[#FF9933] to-[#E07800] text-white font-extrabold rounded-xl hover:from-[#FF8C00] hover:to-[#CC6600] transition shadow-lg"
                  >
                    📝 नया संदेश भेजें
                  </button>
                  <Link
                    href="/"
                    className="px-7 py-3 bg-[#8B0000] text-[#FFD700] font-extrabold rounded-xl hover:bg-[#5C0000] transition shadow-lg border-2 border-[#DAA520]/30"
                  >
                    🏠 होम पेज
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <div className="max-w-lg mx-auto">
              <form
                onSubmit={handleSubmit}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#DAA520] p-8"
              >
                {/* Form header */}
                <div className="text-center mb-6 pb-6 border-b-2 border-dashed border-[#DAA520]/30">
                  <span className="text-3xl block mb-2">📨</span>
                  <h3 className="text-lg font-extrabold text-[#8B0000]">अपना संदेश भेजें</h3>
                  <p className="text-xs text-[#B8860B] font-semibold mt-1">सभी जानकारी भरकर हमसे संपर्क करें</p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm font-semibold flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Name */}
                <div className="mb-5">
                  <label className="block text-[#8B0000] font-extrabold text-sm mb-2">
                    👤 पूरा नाम <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="अपना पूरा नाम लिखें"
                    className="w-full px-5 py-3.5 border-2 border-[#DAA520]/30 rounded-2xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/40 focus:border-[#FF9933] focus:outline-none focus:ring-4 focus:ring-[#FF9933]/10 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="mb-5">
                  <label className="block text-[#8B0000] font-extrabold text-sm mb-2">
                    📞 फोन नंबर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="उदा. 9876543210"
                    className="w-full px-5 py-3.5 border-2 border-[#DAA520]/30 rounded-2xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/40 focus:border-[#FF9933] focus:outline-none focus:ring-4 focus:ring-[#FF9933]/10 transition-all"
                  />
                </div>

                {/* Village */}
                <div className="mb-5">
                  <label className="block text-[#8B0000] font-extrabold text-sm mb-2">
                    🏘️ गाँव / स्थान
                  </label>
                  <input
                    type="text"
                    value={form.village}
                    onChange={(e) => setForm({ ...form, village: e.target.value })}
                    placeholder="अपने गाँव का नाम लिखें"
                    className="w-full px-5 py-3.5 border-2 border-[#DAA520]/30 rounded-2xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/40 focus:border-[#FF9933] focus:outline-none focus:ring-4 focus:ring-[#FF9933]/10 transition-all"
                  />
                </div>

                {/* Enquiry Type */}
                <div className="mb-5">
                  <label className="block text-[#8B0000] font-extrabold text-sm mb-2">
                    📌 पूछताछ का प्रकार
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: opt.value })}
                        className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                          form.type === opt.value
                            ? "border-[#FF9933] bg-gradient-to-br from-[#FFF3E0] to-[#FFE8CC] text-[#8B0000] shadow-lg scale-[1.02]"
                            : "border-[#DAA520]/20 bg-white text-[#B8860B] hover:border-[#FF9933]/40 hover:bg-[#FFFDF5]"
                        }`}
                      >
                        <span className="text-base">{opt.icon}</span>
                        <span className="leading-tight">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-[#8B0000] font-extrabold text-sm mb-2">
                    ✍️ आपका संदेश
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="अपना संदेश यहाँ लिखें..."
                    className="w-full px-5 py-3.5 border-2 border-[#DAA520]/30 rounded-2xl bg-[#FFFDF5] text-[#5C3317] font-semibold placeholder:text-[#B8860B]/40 focus:border-[#FF9933] focus:outline-none focus:ring-4 focus:ring-[#FF9933]/10 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-[#FF9933] via-[#FF8C00] to-[#E07800] text-white font-extrabold text-lg rounded-2xl shadow-xl hover:from-[#FF8C00] hover:via-[#E07000] hover:to-[#CC6600] hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  style={{ boxShadow: "0 6px 30px rgba(255,140,0,0.4), 0 0 0 2px rgba(255,215,0,0.2)" }}
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

              {/* Footer */}
              <div className="text-center mt-8 pb-4">
                <p className="text-[#8B0000]/40 text-xs font-semibold mb-3">
                  ॥ जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे ॥
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/80 backdrop-blur-sm text-[#8B0000] font-bold rounded-xl hover:bg-white hover:shadow-lg transition border border-[#DAA520]/30"
                >
                  <span>←</span> होम पेज पर वापस जाएं
                </Link>
              </div>
            </div>
          )}
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
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
          10% { opacity: 0.7; }
          50% { opacity: 0.3; transform: translateY(-30px) translateX(10px) scale(1.2); }
          90% { opacity: 0.1; }
          100% { opacity: 0; transform: translateY(-50px) translateX(-5px) scale(0.5); }
        }
      `}</style>
    </div>
  );
}
