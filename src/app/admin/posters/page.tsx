"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { getPosters, savePoster, deletePoster } from "@/lib/db";
import PosterForm from "@/components/PosterForm";
import PosterPreview from "@/components/PosterPreview";
import { sharePosterImage } from "@/lib/share";
import type { Poster, PosterFormData } from "@/types";

const DAY_NAMES = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];

function getTodayDate(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayDay(): string {
  return DAY_NAMES[new Date().getDay()];
}

function getDayFromDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return DAY_NAMES[d.getDay()];
}

const DEFAULT_MESSAGE = `आज की परमार्थ सेवा आज हरिद्वार भवन की भोजनशाला में 'प्रसाद' स्वरूप नाश्ते एवं दोनों समय के भोजन सेवा का परम सौभाग्य प्राप्त हुआ है। परिवार द्वारा समाज के प्रति प्रेम त्याग और समर्पण की भावना से परिपूर्ण यह सेवा-कार्य अत्यंत ही वंदनीय है ऐसे महान भामाशाह जो समाज के प्रेरणास्पद है। यह उनका अनुपम योगदान समाज हित में सदैव स्मरणीय रहेगा।

हम इस पुनीत कार्य हेतु आपके हृदय से आभारी हैं और जगत जननी श्री आई माताजी से उनके उत्तम स्वास्थ्य, चिरस्थायी सुख-समृद्धि तथा दीर्घायु के लिए हार्दिक प्रार्थना करतें हैं

परम धर्म सेवा, अन्नदान महादान - मानव कल्याण का अनुपम प्रयास`;

const initialFormData: PosterFormData = {
  date: getTodayDate(),
  day: getTodayDay(),
  sponsorName: "",
  village: "",
  message: DEFAULT_MESSAGE,
  photoDataUrl: null,
};

export default function PostersPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [formData, setFormData] = useState<PosterFormData>(initialFormData);
  const [tab, setTab] = useState<"create" | "list">("create");
  const [isDownloading, setIsDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const loadPosters = async () => {
    setPosters(await getPosters());
  };

  useEffect(() => {
    loadPosters();
  }, []);

  const handleFormChange = (data: PosterFormData) => {
    if (data.date !== formData.date) {
      const autoDay = getDayFromDate(data.date);
      setFormData({ ...data, day: autoDay });
    } else {
      setFormData(data);
    }
  };

  const handleLoad = (poster: Poster) => {
    setFormData({
      date: poster.date,
      day: poster.day,
      sponsorName: poster.sponsorName,
      village: poster.village,
      message: poster.message,
      photoDataUrl: poster.photoDataUrl,
    });
    setTab("create");
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await savePoster(formData);
    setSaving(false);
    setFormData(initialFormData);
    await loadPosters();
    setTab("list");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप "${name}" का पोस्टर हटाना चाहते हैं?`)) return;
    await deletePoster(id);
    await loadPosters();
  };

  const capturePoster = useCallback(async (filenameDate: string) => {
    const el = posterRef.current;
    if (!el) return;

    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFA500",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `bhamashah-poster-${filenameDate || "date"}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("पोस्टर डाउनलोड करने में त्रुटि।");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    await capturePoster(formData.date);
  }, [formData.date, capturePoster]);

  const handleDownloadSaved = useCallback(
    async (poster: Poster) => {
      setFormData({
        date: poster.date,
        day: poster.day,
        sponsorName: poster.sponsorName,
        village: poster.village,
        message: poster.message,
        photoDataUrl: poster.photoDataUrl,
      });
      await new Promise((r) => setTimeout(r, 300));
      await capturePoster(poster.date);
    },
    [capturePoster]
  );

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const handleShareSaved = useCallback(
    async (poster: Poster) => {
      // Load poster into form (updates preview)
      setFormData({
        date: poster.date,
        day: poster.day,
        sponsorName: poster.sponsorName,
        village: poster.village,
        message: poster.message,
        photoDataUrl: poster.photoDataUrl,
      });
      // Wait for preview to render
      await new Promise((r) => setTimeout(r, 400));
      // Capture and share the poster image
      if (posterRef.current) {
        await sharePosterImage(posterRef.current, {
          date: poster.date,
          day: poster.day,
          sponsorName: poster.sponsorName,
          village: poster.village,
          message: poster.message,
          photoDataUrl: poster.photoDataUrl,
        });
      }
    },
    []
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000]">📋 पोस्टर प्रबंधन</h1>
          <p className="text-[#B8860B] font-medium mt-1">
            कुल {posters.length} पोस्टर सहेजे गए
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("list")}
            className={`px-4 py-2.5 font-bold rounded-xl transition text-sm ${
              tab === "list"
                ? "bg-[#8B0000] text-[#FFD700] shadow-lg"
                : "border-2 border-[#DAA520] text-[#8B0000] hover:bg-[#FFF3D6]"
            }`}
          >
            📚 सूची
          </button>
          <button
            onClick={() => setTab("create")}
            className={`px-4 py-2.5 font-bold rounded-xl transition text-sm ${
              tab === "create"
                ? "bg-[#FF9933] text-white shadow-lg"
                : "border-2 border-[#DAA520] text-[#8B0000] hover:bg-[#FFF3D6]"
            }`}
          >
            ➕ नया पोस्टर
          </button>
        </div>
      </div>

      {/* ─── CREATE TAB ─── */}
      {tab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-6">
            <PosterForm data={formData} onChange={handleFormChange} />

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    डाउनलोड हो रहा है...
                  </>
                ) : (
                  <>
                    <span>📥</span> डाउनलोड करें
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {saving ? "सहेज रहा है..." : <><span>💾</span> सहेजें</>}
              </button>
              <button
                onClick={async () => {
                  if (posterRef.current) {
                    await sharePosterImage(posterRef.current, formData);
                  }
                }}
                className="px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:bg-[#1EBE5C] transition flex items-center justify-center gap-2"
              >
                <span>💬</span> WhatsApp
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition"
              >
                🔄 रीसेट
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-8">
            <h2 className="text-center text-lg font-bold text-[#8B0000] mb-3">📋 लाइव पूर्वावलोकन</h2>
            <PosterPreview ref={posterRef} data={formData} />
          </div>
        </div>
      )}

      {/* ─── LIST TAB ─── */}
      {tab === "list" && (
        <div>
          {posters.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-12 text-center">
              <span className="text-6xl">📭</span>
              <p className="text-[#C4A35A] font-bold mt-4 text-lg">कोई सहेजा गया पोस्टर नहीं है</p>
              <button
                onClick={() => setTab("create")}
                className="mt-4 px-6 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl hover:bg-[#E88920] transition inline-flex items-center gap-2"
              >
                ➕ पहला पोस्टर बनाएं
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {posters.map((poster) => (
                <div
                  key={poster.id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: "340px" }}>
                    <div
                      className="w-full h-full overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(180deg, #FFCC66 0%, #FFB347 8%, #FFA500 18%, #FF8C00 30%, #FF7F00 45%, #FF8C00 60%, #FFA500 75%, #FFB347 88%, #FFCC66 100%)",
                      }}
                    >
                      <div className="h-[5px] bg-[#B22222]" />
                      <div
                        className="h-[8px]"
                        style={{
                          background:
                            "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 3px, #B22222 3px, #B22222 6px)",
                        }}
                      />
                      <div className="px-3 pt-2 flex flex-col items-center h-full">
                        <p className="text-[7px] font-extrabold text-[#8B0000] text-center leading-tight">
                          श्री अखिल भारतीय सीरवी समाज ट्रस्ट हरिद्वार भवन की भोजनशाला
                        </p>
                        <p className="text-[5px] font-extrabold text-white bg-[#8B0000] rounded-full px-2 py-0.5 mt-1">
                          ✦ आज के भामाशाह ✦
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-1 w-full">
                          <div className="w-[30%] shrink-0">
                            <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-[#FFD700] bg-[#FFF8E7]">
                              {poster.photoDataUrl ? (
                                <img src={poster.photoDataUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#FFE4B5] text-[12px]">📷</div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-extrabold text-[#8B0000] leading-tight truncate">
                              {poster.sponsorName || "श्री ... जी"}
                            </p>
                            <p className="text-[7px] font-bold text-[#5C3317] truncate">
                              {poster.village || "गाँव/शहर"}
                            </p>
                            <p className="text-[6px] font-bold text-[#5C3317] mt-0.5">
                              {poster.date} {poster.day && `(${poster.day})`}
                            </p>
                          </div>
                        </div>
                        {poster.message && (
                          <p className="text-[5px] font-semibold text-[#4A2800] text-center leading-tight mt-1 line-clamp-3 px-1">
                            {poster.message.slice(0, 120)}...
                          </p>
                        )}
                        <p className="text-[5px] font-bold text-[#8B0000] mt-auto pb-1">
                          अखिल भारतीय सीरवी समाज ट्रस्ट, हरिद्वार
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button
                        onClick={() => handleLoad(poster)}
                        className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-lg"
                      >
                        📝 लोड करें
                      </button>
                      <button
                        onClick={() => handleDownloadSaved(poster)}
                        className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
                      >
                        📥 डाउनलोड
                      </button>
                      <button
                        onClick={() => handleShareSaved(poster)}
                        className="px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-[#1EBE5C] transition shadow-lg"
                      >
                        💬 शेयर
                      </button>
                      <button
                        onClick={() => handleDelete(poster.id, poster.sponsorName || "अज्ञात")}
                        className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition shadow-lg"
                      >
                        🗑️ हटाएं
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-[#DAA520]/30 bg-[#FFF8E7]">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-[#8B0000] truncate">
                          {poster.sponsorName || "बिना नाम का पोस्टर"}
                        </p>
                        <p className="text-xs text-[#B8860B]">
                          {poster.date} {poster.day && `(${poster.day})`} • {formatDate(poster.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handleLoad(poster)}
                          className="px-2.5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                          title="लोड करें"
                        >
                          📝
                        </button>
                        <button
                          onClick={() => handleDownloadSaved(poster)}
                          className="px-2.5 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition"
                          title="डाउनलोड"
                        >
                          📥
                        </button>
                        <button
                          onClick={() => handleShareSaved(poster)}
                          className="px-2.5 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-[#1EBE5C] transition"
                          title="WhatsApp पर शेयर करें"
                        >
                          💬
                        </button>
                        <button
                          onClick={() => handleDelete(poster.id, poster.sponsorName || "अज्ञात")}
                          className="px-2.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                          title="हटाएं"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
