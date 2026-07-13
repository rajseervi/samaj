"use client";

import { PosterFormData } from "@/types";
import { forwardRef, useEffect, useRef, useState } from "react";

interface PosterPreviewProps {
  data: PosterFormData;
}

const PosterPreview = forwardRef<HTMLDivElement, PosterPreviewProps>(
  function PosterPreview({ data }, ref) {
    const hasPhoto = !!data.photoDataUrl;

    const [animKey, setAnimKey] = useState(0);
    const prevDataRef = useRef(data);

    useEffect(() => {
      const prev = prevDataRef.current;
      if (
        prev.sponsorName !== data.sponsorName ||
        prev.village !== data.village ||
        prev.date !== data.date ||
        prev.day !== data.day ||
        prev.message !== data.message ||
        prev.photoDataUrl !== data.photoDataUrl
      ) {
        setAnimKey((k) => k + 1);
      }
      prevDataRef.current = data;
    }, [data]);

    return (
      <div
        ref={ref}
        id="poster-canvas"
        className="relative w-full max-w-[600px] mx-auto overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, #FFCC66 0%, #FFB347 8%, #FFA500 18%, #FF8C00 30%, #FF7F00 45%, #FF8C00 60%, #FFA500 75%, #FFB347 88%, #FFCC66 100%)",
          aspectRatio: "3 / 4",
          minHeight: "500px",
        }}
      >
        {/* ── Top Decorative Border ── */}
        <div className="absolute top-0 left-0 right-0 h-[16px] pointer-events-none z-20">
          <div className="h-[6px] bg-[#B22222]" />
          <div
            className="h-[10px]"
            style={{
              background:
                "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 5px, #B22222 5px, #B22222 10px)",
            }}
          />
        </div>

        {/* ── Bottom Decorative Border ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[16px] pointer-events-none z-20">
          <div
            className="h-[10px]"
            style={{
              background:
                "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 5px, #B22222 5px, #B22222 10px)",
            }}
          />
          <div className="h-[6px] bg-[#B22222]" />
        </div>

        {/* ── Side Decorative Borders ── */}
        <div className="absolute top-0 bottom-0 left-0 w-[8px] pointer-events-none z-20"
          style={{
            background: "repeating-linear-gradient(180deg, #FFD700 0px, #FFD700 3px, #B22222 3px, #B22222 6px)",
          }}
        />
        <div className="absolute top-0 bottom-0 right-0 w-[8px] pointer-events-none z-20"
          style={{
            background: "repeating-linear-gradient(180deg, #FFD700 0px, #FFD700 3px, #B22222 3px, #B22222 6px)",
          }}
        />

        {/* ── Corner Motifs ── */}
        <span className="absolute top-[18px] left-[10px] text-[14px] text-[#FFD700] pointer-events-none z-30 drop-shadow-md">✦</span>
        <span className="absolute top-[18px] right-[10px] text-[14px] text-[#FFD700] pointer-events-none z-30 drop-shadow-md">✦</span>
        <span className="absolute bottom-[18px] left-[10px] text-[14px] text-[#FFD700] pointer-events-none z-30 drop-shadow-md">✦</span>
        <span className="absolute bottom-[18px] right-[10px] text-[14px] text-[#FFD700] pointer-events-none z-30 drop-shadow-md">✦</span>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col h-full px-6 sm:px-7 pt-5 pb-4">

          {/* ===== TOP: Trust Name ===== */}
          <div className="text-center shrink-0">
            <h1 className="text-[15px] sm:text-[19px] font-extrabold text-[#8B0000] leading-tight tracking-wide">
              श्री अखिल भारतीय सीरवी समाज ट्रस्ट
            </h1>
          </div>

          {/* ── Stars Divider ── */}
          <div className="flex items-center justify-center gap-1.5 my-1 shrink-0">
            <span className="text-[#FFD700] text-[16px] sm:text-[20px] drop-shadow-md">✦</span>
            <span className="text-[#FFD700] text-[10px] sm:text-[13px] drop-shadow-md">✦</span>
            <span className="text-[#FFD700] text-[16px] sm:text-[20px] drop-shadow-md">✦</span>
          </div>

          {/* ===== Aaj Ka Bhamashah Banner ===== */}
          <div className="text-center shrink-0 mb-1.5">
            <div className="inline-block bg-gradient-to-r from-[#8B0000] via-[#B22222] to-[#8B0000] rounded-full px-7 sm:px-12 py-1 sm:py-1.5 shadow-lg border-[3px] border-[#FFD700]">
              <h2 className="text-[14px] sm:text-[17px] font-extrabold text-white leading-tight tracking-wide whitespace-nowrap">
                ✦ आज का भामाशाह ✦
              </h2>
            </div>
          </div>

          {/* ===== CENTER: Two-Column Photo + Details ===== */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="grid grid-cols-[45%_55%] gap-3 w-full max-w-[420px] mx-auto items-center">

              {/* LEFT: Photo Frame */}
              <div className="relative w-full aspect-square">
                {/* Outer glow ring */}
                <div className="absolute -inset-2.5 rounded-full bg-gradient-to-br from-[#FFD700]/50 via-[#FFA500]/30 to-transparent blur-sm" />
                {/* Gold ring 1 (outermost) */}
                <div className="absolute -inset-2 rounded-full border-[3px] border-[#FFD700] shadow-lg" />
                {/* Deep red ring */}
                <div className="absolute -inset-1 rounded-full border-[3px] border-[#8B0000] shadow-md" />
                {/* Gold ring 2 (inner) */}
                <div className="absolute -inset-[1px] rounded-full border-[2px] border-[#FFD700]" />
                {/* Photo */}
                <div className="absolute inset-0 rounded-full overflow-hidden border-[5px] border-[#FFD700] bg-[#FFF8E7] shadow-inner shadow-black/20">
                  {hasPhoto ? (
                    <img
                      src={data.photoDataUrl!}
                      alt="Sponsor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF8E7] to-[#FFE4B5]">
                      <span className="text-[24px] sm:text-[28px] mb-0.5">📷</span>
                      <p className="text-[7px] sm:text-[9px] font-bold text-[#C4A35A] text-center px-1 leading-tight">
                        फोटो
                      </p>
                    </div>
                  )}
                </div>
                {/* Sparkle dots */}
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-[#FFD700] drop-shadow-md">✦</span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-[#FFD700] drop-shadow-md">✦</span>
                <span className="absolute top-1/2 -left-2 -translate-y-1/2 text-[8px] text-[#FFD700] drop-shadow-md">✦</span>
                <span className="absolute top-1/2 -right-2 -translate-y-1/2 text-[8px] text-[#FFD700] drop-shadow-md">✦</span>
              </div>

              {/* RIGHT: Details */}
              <div className="flex flex-col gap-1 text-left pl-1">
                {/* Sponsor Name */}
                <AnimatedEntry key={`name-${animKey}`}>
                  <h3 className="text-[11px] sm:text-[14px] font-extrabold text-[#8B0000] leading-tight">
                    {data.sponsorName || "श्री ................. जी"}
                  </h3>
                </AnimatedEntry>

                {/* Village */}
                <AnimatedEntry key={`village-${animKey}`}>
                  <p className="text-[10px] sm:text-[12px] font-bold text-[#5C3317] leading-tight">
                    {data.village || "गाँव / शहर ................."}
                  </p>
                </AnimatedEntry>

                {/* Date + Day */}
                <AnimatedEntry key={`date-${animKey}`}>
                  <p className="text-[10px] sm:text-[12px] font-bold text-[#5C3317] leading-tight">
                    {data.date || data.day
                      ? `${data.date || "दिनांक"}${data.day ? ` (${data.day})` : ""}`
                      : "दिनांक (वार)"}
                  </p>
                </AnimatedEntry>
              </div>

            </div>
          </div>

          {/* ===== MESSAGE SECTION ===== */}
          {data.message && (
            <AnimatedEntry
              key={`msg-${animKey}`}
              className="shrink-0 max-h-[25%] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="bg-[#FFF8E7]/85 border-[3px] border-[#FFD700]/80 rounded-xl px-3 py-2 shadow-inner">
                <p className="text-[9px] sm:text-[10px] font-semibold text-[#4A2800] leading-relaxed whitespace-pre-line text-center">
                  {data.message}
                </p>
              </div>
            </AnimatedEntry>
          )}

          {/* ===== FOOTER ===== */}
          <div className="shrink-0 text-center mt-1.5">
            {/* Divider */}
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className="text-[#FFD700] text-[15px] sm:text-[17px] drop-shadow-md">🏺</span>
              <div className="flex-1 h-[3px] bg-gradient-to-r from-transparent via-[#FFD700] to-[#8B0000] rounded-full" />
              <span className="text-[#8B0000] text-[22px] sm:text-[24px] font-serif drop-shadow-md">ॐ</span>
              <div className="flex-1 h-[3px] bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-transparent rounded-full" />
              <span className="text-[#FFD700] text-[15px] sm:text-[17px] drop-shadow-md">🏺</span>
            </div>

            <p className="text-[9px] sm:text-[10px] font-extrabold text-[#5C3317] leading-relaxed">
              कार्यकारिणी
            </p>
            <p className="text-[7px] sm:text-[8px] font-bold text-[#8B0000] leading-relaxed">
              अखिल भारतीय सीरवी समाज ट्रस्ट, भोजन शाला हरिद्वार
            </p>

            {/* Slogans */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 mt-1">
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#FFD700] bg-[#8B0000] px-2 sm:px-3 py-0.5 rounded-full whitespace-nowrap border border-[#FFD700] shadow-sm">
                🕉️ परम धर्म सेवा
              </span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#FFD700] bg-[#8B0000] px-2 sm:px-3 py-0.5 rounded-full whitespace-nowrap border border-[#FFD700] shadow-sm">
                🕉️ अन्नदान महादान
              </span>
            </div>

            <p className="text-[7px] sm:text-[8px] text-center text-[#8B0000] mt-0.5 font-semibold leading-relaxed">
              ॥ जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे ॥
            </p>
          </div>
        </div>
      </div>
    );
  }
);

/* ── Animated Entry ── */
function AnimatedEntry({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ${className ?? ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
      }}
    >
      {children}
    </div>
  );
}

export default PosterPreview;
