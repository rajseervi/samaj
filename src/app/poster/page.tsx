"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import PosterForm from "@/components/PosterForm";
import PosterPreview from "@/components/PosterPreview";
import Link from "next/link";
import { useAuth, AuthProvider } from "@/lib/auth-context";
import { PosterFormData } from "@/types";

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

function PosterPageInner() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<PosterFormData>(initialFormData);
  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  /* ─── Auth guard ─── */
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/admin/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FFD700] border-t-[#8B0000] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8B0000] font-bold">रीडायरेक्ट हो रहा है...</p>
        </div>
      </div>
    );
  }

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `bhamashah-poster-${formData.date || "date"}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("पोस्टर डाउनलोड करने में त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setIsDownloading(false);
    }
  }, [formData.date]);

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <header className="relative">
        <div className="h-2 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-[#8B0000] font-bold hover:text-[#FF9933] transition">
            ← प्रबंधन पैनल
          </Link>
          <h1 className="text-lg font-extrabold text-[#8B0000]">📋 पोस्टर जनरेटर (एडमिन)</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-[#DAA520] p-6">
            <PosterForm data={formData} onChange={setFormData} />
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 px-6 py-3.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-lg hover:bg-[#E88920] disabled:opacity-60 disabled:cursor-not-allowed transition text-lg flex items-center justify-center gap-2"
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
                  <><span>📥</span> पोस्टर डाउनलोड करें</>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3.5 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition"
              >
                🔄 रीसेट करें
              </button>
            </div>
          </div>
          <div className="lg:sticky lg:top-8">
            <h2 className="text-center text-lg font-bold text-[#8B0000] mb-3">📋 लाइव पूर्वावलोकन</h2>
            <PosterPreview ref={posterRef} data={formData} />
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-[#FFD700] text-center py-4 mt-8">
        <p className="text-sm font-semibold">श्री अखिल भारतीय सीरवी समाज ट्रस्ट, भोजन शाला हरिद्वार</p>
        <p className="text-xs mt-1 opacity-80">परम धर्म सेवा • अन्नदान महादान</p>
      </footer>
    </div>
  );
}

export default function PosterPage() {
  return (
    <AuthProvider>
      <PosterPageInner />
    </AuthProvider>
  );
}
