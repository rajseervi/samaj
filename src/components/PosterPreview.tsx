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

    const colors = {
      maroon: "#8B0000",
      red: "#B22222",
      gold: "#FFD700",
      orange: "#FF9933",
      brownDark: "#5C3317",
      brown: "#4A2800",
      cream: "#FFF8E7",
      peach: "#FFE4B5",
      tan: "#C4A35A",
      darkGold: "#B8860B",
      lightOrange: "#FF8C00",
    };

    return (
      <div
        ref={ref}
        id="poster-canvas"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 595,
          margin: "0 auto",
          overflow: "hidden",
          aspectRatio: "1 / 1.414",
          background:
            "linear-gradient(180deg, #FFCC66 0%, #FFB347 8%, #FFA500 18%, #FF8C00 30%, #FF7F00 45%, #FF8C00 60%, #FFA500 75%, #FFB347 88%, #FFCC66 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Top decorative stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 20,
            background:
              "repeating-linear-gradient(90deg, #B22222 0px, #B22222 4px, #FFD700 4px, #FFD700 6px, #B22222 6px, #B22222 10px)",
          }}
        />

        {/* Bottom decorative stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 20,
            background:
              "repeating-linear-gradient(90deg, #B22222 0px, #B22222 4px, #FFD700 4px, #FFD700 6px, #B22222 6px, #B22222 10px)",
          }}
        />

        {/* ── BACKGROUND TEXTURE: Paper depth layers ── */}

        {/* Layer 1: Broad sweeping curves (light/dark bands for depth) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 0.30,
            background: `
              radial-gradient(ellipse 80% 50% at 20% 30%, rgba(255,248,231,0.55) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 75% 70%, rgba(255,215,0,0.20) 0%, transparent 50%),
              radial-gradient(ellipse 70% 60% at 60% 15%, rgba(255,228,181,0.45) 0%, transparent 50%),
              radial-gradient(ellipse 50% 45% at 10% 85%, rgba(255,240,200,0.40) 0%, transparent 50%),
              radial-gradient(ellipse 55% 35% at 85% 45%, rgba(255,235,195,0.35) 0%, transparent 50%)
            `,
          }}
        />

        {/* Layer 2: Horizontal grain lines for handmade-paper texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 0.09,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 5px,
                rgba(139,0,0,0.15) 5px,
                rgba(139,0,0,0.15) 6px,
                transparent 6px,
                transparent 14px,
                rgba(178,34,34,0.10) 14px,
                rgba(178,34,34,0.10) 15px,
                transparent 15px,
                transparent 28px,
                rgba(139,0,0,0.12) 28px,
                rgba(139,0,0,0.12) 29px,
                transparent 29px,
                transparent 40px
              )
            `,
            backgroundSize: "100% 40px",
          }}
        />

        {/* Layer 3: Soft circular highlight blobs for 3D depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 0.15,
            background: `
              radial-gradient(circle at 15% 20%, rgba(255,255,255,0.55) 0%, transparent 35%),
              radial-gradient(circle at 88% 55%, rgba(255,255,255,0.40) 0%, transparent 30%),
              radial-gradient(circle at 40% 88%, rgba(255,248,220,0.50) 0%, transparent 35%),
              radial-gradient(circle at 70% 12%, rgba(255,245,210,0.45) 0%, transparent 32%),
              radial-gradient(circle at 5% 65%, rgba(255,250,230,0.40) 0%, transparent 28%)
            `,
          }}
        />

        {/* Layer 4: Diagonal crosshatch micro-texture (no SVG filter, works everywhere) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            opacity: 0.05,
            backgroundImage: `
              repeating-linear-gradient(
                35deg,
                transparent,
                transparent 2px,
                rgba(139,0,0,0.25) 2px,
                rgba(139,0,0,0.25) 3px
              ),
              repeating-linear-gradient(
                -35deg,
                transparent,
                transparent 2px,
                rgba(139,0,0,0.20) 2px,
                rgba(139,0,0,0.20) 3px
              )
            `,
            backgroundSize: "20px 20px, 20px 20px",
          }}
        />

        {/* ── DECORATIVE SIDE BORDERS ── */}
        {/* Left border panel */}
        <div style={{ position: "absolute", left: -2, top: 60, bottom: 60, width: 20, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", opacity: 0.35 }}>
          <span style={{ fontSize: 18, color: "#FFD700", textShadow: "1px 1px 2px rgba(139,0,0,0.4)" }}>🪔</span>
          <div style={{ flex: 1, width: 2, background: "linear-gradient(180deg, transparent, #FFD700 20%, #FFD700 80%, transparent)", margin: "4px 0" }} />
          <span style={{ fontSize: 14, color: "#FFD700", textShadow: "1px 1px 2px rgba(139,0,0,0.4)" }}>🌸</span>
          <div style={{ flex: 1, width: 2, background: "linear-gradient(180deg, transparent, #FFD700 20%, #FFD700 80%, transparent)", margin: "4px 0" }} />
          <span style={{ fontSize: 18, color: "#FFD700", textShadow: "1px 1px 2px rgba(139,0,0,0.4)" }}>🪔</span>
        </div>

        {/* Right border panel */}
        <div style={{ position: "absolute", right: -2, top: 60, bottom: 60, width: 20, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", opacity: 0.35 }}>
          <span style={{ fontSize: 18, color: "#FFD700", textShadow: "1px 1px 2px rgba(139,0,0,0.4)" }}>🪔</span>
          <div style={{ flex: 1, width: 2, background: "linear-gradient(180deg, transparent, #FFD700 20%, #FFD700 80%, transparent)", margin: "4px 0" }} />
          <span style={{ fontSize: 14, color: "#FFD700", textShadow: "1px 1px 2px rgba(139,0,0,0.4)" }}>🌸</span>
          <div style={{ flex: 1, width: 2, background: "linear-gradient(180deg, transparent, #FFD700 20%, #FFD700 80%, transparent)", margin: "4px 0" }} />
          <span style={{ fontSize: 18, color: "#FFD700", textShadow: "1px 1px 2px rgba(139,0,0,0.4)" }}>🪔</span>
        </div>

        {/* ── CORNER ORNAMENTS ── */}
        {/* Top-left corner */}
        <div style={{ position: "absolute", top: 8, left: 4, zIndex: 4, opacity: 0.3 }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="8" cy="8" r="6" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="#FFD700" opacity="0.4" />
            <line x1="14" y1="8" x2="40" y2="8" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
            <line x1="8" y1="14" x2="8" y2="40" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>

        {/* Top-right corner */}
        <div style={{ position: "absolute", top: 8, right: 4, zIndex: 4, opacity: 0.3, transform: "scaleX(-1)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="8" cy="8" r="6" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="#FFD700" opacity="0.4" />
            <line x1="14" y1="8" x2="40" y2="8" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
            <line x1="8" y1="14" x2="8" y2="40" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>

        {/* Bottom-left corner */}
        <div style={{ position: "absolute", bottom: 8, left: 4, zIndex: 4, opacity: 0.3, transform: "scaleY(-1)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="8" cy="8" r="6" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="#FFD700" opacity="0.4" />
            <line x1="14" y1="8" x2="40" y2="8" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
            <line x1="8" y1="14" x2="8" y2="40" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>

        {/* Bottom-right corner */}
        <div style={{ position: "absolute", bottom: 8, right: 4, zIndex: 4, opacity: 0.3, transform: "scale(-1, -1)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="8" cy="8" r="6" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="3" fill="#FFD700" opacity="0.4" />
            <line x1="14" y1="8" x2="40" y2="8" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
            <line x1="8" y1="14" x2="8" y2="40" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>

        {/* ── TOP / BOTTOM ORNAMENTAL BANDS ── */}
        {/* Top band between header stripe and content */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 30,
            right: 30,
            height: 3,
            zIndex: 4,
            opacity: 0.25,
            background: "linear-gradient(90deg, transparent, #FFD700 15%, #8B0000 50%, #FFD700 85%, transparent)",
            borderRadius: 2,
          }}
        />

        {/* Bottom band above footer stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 30,
            right: 30,
            height: 3,
            zIndex: 4,
            opacity: 0.25,
            background: "linear-gradient(90deg, transparent, #FFD700 15%, #8B0000 50%, #FFD700 85%, transparent)",
            borderRadius: 2,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "10px 16px 10px",
            justifyContent: "space-between",
          }}
        >
          {/* ── HEADER ── */}
          <div style={{ flexShrink: 0 }}>
            {/* Decorative top ornaments above title */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 4, opacity: 0.5 }}>
              <span style={{ fontSize: 12, color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.4)" }}>🪔</span>
              <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #FFD700, transparent)" }} />
              <span style={{ fontSize: 10, color: "#FFD700" }}>ॐ</span>
              <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #FFD700, transparent)" }} />
              <span style={{ fontSize: 12, color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.4)" }}>🪔</span>
            </div>

            <h1
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#FFFFFF",
                background: "linear-gradient(180deg, rgb(137,13,13), rgb(139,0,0), rgb(178,34,34), rgb(139,0,0))",
                border: "3px solid #F2DB09",
                lineHeight: 1.3,
                textAlign: "center",
                textShadow: "1px 1px 0px #FFDC0D, 2px 2px 0px rgba(86,85,72,0.57)",
                margin: "0 6px 6px 5px",
                padding: "10px 14px",
                borderRadius: "0 17px 0 17px",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 12px rgba(139,0,0,0.35), 0 0 20px rgba(255,215,0,0.15)",
              }}
            >
              श्री अखिल भारतीय सीरवी समाज ट्रस्ट<br />
              हरिद्वार भवन की भोजनशाला
            </h1>

            {/* Stars divider */}
            <div style={{ textAlign: "center", margin: "-2px 0" }}>
              <span style={{ color: "#6B0000", fontSize: 16, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>✦</span>
              <span style={{ color: "#6B0000", fontSize: 10, margin: "0 2px", textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>✦</span>
              <span style={{ color: "#6B0000", fontSize: 16, textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>✦</span>
            </div>

            {/* Banner pill */}
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  display: "inline-block",
                  borderRadius: 9999,
                  padding: "6px 32px",
                  background: "linear-gradient(180deg, #6B0000, #8B0000, #B22222, #8B0000)",
                  border: "3px solid #FFD700",
                  boxShadow: "0 4px 12px rgba(139,0,0,0.4)",
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1.3,
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  margin: "0px 0px 20px 238px",
                }}
              >
                ✦ आज के भामाशाह ✦
              </span>
            </div>
          </div>

          {/* ── BODY: Photo + Details ── */}
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 0,
              padding: "8px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: 16,
              }}
            >
              {/* LEFT: Photo (square) */}
              <div style={{ width: "40%", flexShrink: 0 }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1",
                  }}
                >
                  {/* Glow box */}
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bottom: -8,
                      left: -8,
                      borderRadius: 14,
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,215,0,0.25), rgba(255,165,0,0.15), transparent)",
                    }}
                  />
                  {/* Outer gold border */}
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      bottom: -6,
                      left: -6,
                      borderRadius: 12,
                      border: "2.5px solid #FFD700",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                    }}
                  />
                  {/* Inner maroon border */}
                  <div
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      bottom: -2,
                      left: -2,
                      borderRadius: 10,
                      border: "2.5px solid #8B0000",
                    }}
                  />
                  {/* Photo square */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "3px solid #FFD700",
                      background: colors.cream,
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
                    }}
                  >
                    {hasPhoto ? (
                      <img
                        src={data.photoDataUrl!}
                        alt="Sponsor"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `linear-gradient(180deg, ${colors.cream}, ${colors.peach})`,
                        }}
                      >
                        <span style={{ fontSize: 22 }}>📷</span>
                        <p style={{ fontSize: 7, fontWeight: 700, color: colors.tan, margin: 0 }}>फोटो</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Text details in bordered boxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 auto", minWidth: 0 }}>
                {/* Sponsor Name Box */}
                <AnimatedEntry key={`name-${animKey}`}>
                  <div
                    style={{
                      border: "2.5px solid #8B0000",
                      borderRadius: 10,
                      padding: "7px 10px",
                      background: "rgba(255, 248, 231, 0.85)",
                      boxShadow: "0 2px 6px rgba(139,0,0,0.12), inset 0 1px 2px rgba(255,215,0,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 2 }}>
                      <span style={{ fontSize: 8, color: "#FFD700" }}>✦</span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#B8860B" }}>नाम</span>
                      <span style={{ fontSize: 8, color: "#FFD700" }}>✦</span>
                    </div>
                    <div
                      style={{
                        borderTop: "1.5px dashed #DAA520",
                        paddingTop: 4,
                      }}
                    >
                      <h3 style={{ fontSize: 20,justifyContent: "center", fontWeight: 800, color: colors.maroon, lineHeight: 1.3, margin: 0 }}>
                        {data.sponsorName || "श्री ................. जी"}
                      </h3>
                    </div>
                  </div>
                </AnimatedEntry>

                {/* Village Box */}
                <AnimatedEntry key={`village-${animKey}`}>
                  <div
                    style={{
                      border: "2.5px solid #8B0000",
                      borderRadius: 10,
                      padding: "6px 10px",
                      background: "rgba(255, 248, 231, 0.85)",
                      boxShadow: "0 2px 6px rgba(139,0,0,0.12), inset 0 1px 2px rgba(255,215,0,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 2 }}>
                      <span style={{ fontSize: 8, color: "#FFD700" }}>✦</span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#B8860B" }}>गाँव / शहर</span>
                      <span style={{ fontSize: 8, color: "#FFD700" }}>✦</span>
                    </div>
                    <div
                      style={{
                        borderTop: "1.5px dashed #DAA520",
                        paddingTop: 3,
                      }}
                    >
                      <p style={{ fontSize: 13, fontWeight: 700, color: colors.brownDark, lineHeight: 1.3, margin: 0 }}>
                        {data.village || "गाँव / शहर ................."}
                      </p>
                    </div>
                  </div>
                </AnimatedEntry>

                {/* Date Box */}
                <AnimatedEntry key={`date-${animKey}`}>
                  <div
                    style={{
                      border: "2.5px solid #8B0000",
                      borderRadius: 10,
                      padding: "6px 10px",
                      background: "rgba(255, 248, 231, 0.85)",
                      boxShadow: "0 2px 6px rgba(139,0,0,0.12), inset 0 1px 2px rgba(255,215,0,0.2)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 2 }}>
                      <span style={{ fontSize: 8, color: "#FFD700" }}>✦</span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#B8860B" }}>दिनांक</span>
                      <span style={{ fontSize: 8, color: "#FFD700" }}>✦</span>
                    </div>
                    <div
                      style={{
                        borderTop: "1.5px dashed #DAA520",
                        paddingTop: 3,
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, color: colors.brownDark, lineHeight: 1.3, margin: 0 }}>
                        {data.date || data.day
                          ? `${data.date || "दिनांक"}${data.day ? ` (${data.day})` : ""}`
                          : "दिनांक (वार)"}
                      </p>
                    </div>
                  </div>
                </AnimatedEntry>
              </div>
            </div>
          </div>

          {/* ── MESSAGE ── */}
          {data.message && (
            <AnimatedEntry
              key={`msg-${animKey}`}
              styleOverride={{
                flex: "0 0 auto",
                maxHeight: "60%",
                overflowY: "auto",
                scrollbarWidth: "none",
                marginTop: 4,
                marginBottom: 8,
              }}
            >
              <div style={{ position: "relative", padding: 8, margin: "0 2px" }}>
                {/* Outer maroon border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    border: "3px solid #B22222",
                    boxShadow: "0 2px 6px rgba(139,0,0,0.15)",
                  }}
                />
                {/* Inner gold border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 4,
                    borderRadius: 15,
                    border: "2px solid #FFD700",
                  }}
                />
                {/* Corner stars */}
                <span style={{ position: "absolute", top: 3, left: 7, fontSize: 9, color: "#FFD700", zIndex: 2 }}>✦</span>
                <span style={{ position: "absolute", top: 3, right: 7, fontSize: 9, color: "#FFD700", zIndex: 2 }}>✦</span>
                <span style={{ position: "absolute", bottom: 3, left: 7, fontSize: 9, color: "#FFD700", zIndex: 2 }}>✦</span>
                <span style={{ position: "absolute", bottom: 3, right: 7, fontSize: 9, color: "#FFD700", zIndex: 2 }}>✦</span>
                {/* Content */}
                <div
                  style={{
                    position: "relative",
                    background: "rgba(255, 248, 231, 0.9)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    boxShadow: "inset 0 2px 4px rgba(139,0,0,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.brown,
                      lineHeight: 1.7,
                      whiteSpace: "pre-line",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    {data.message}
                  </p>
                </div>
              </div>
            </AnimatedEntry>
          )}

          {/* ── FOOTER ── */}
          <div style={{ flexShrink: 0, textAlign: "center", paddingTop: 4 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 2,
              }}
            >
              <span style={{ color: colors.gold, fontSize: 14, textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>✦</span>
              <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, transparent, #FFD700, #8B0000)" }} />
              <span
                style={{
                  color: colors.maroon,
                  fontSize: 20,
                  fontFamily: "serif",
                  textShadow: "1px 1px 2px rgba(139,0,0,0.3)",
                }}
              >
                ॐ
              </span>
              <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #8B0000, #FFD700, transparent)" }} />
              <span style={{ color: colors.gold, fontSize: 14, textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>✦</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: colors.brownDark, margin: "0 0 2px" }}>कार्यकारिणी</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: colors.maroon, margin: "0 0 6px" }}>
              अखिल भारतीय सीरवी समाज ट्रस्ट, भोजन शाला हरिद्वार
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: colors.gold,
                  background: "linear-gradient(180deg, #6B0000, #8B0000)",
                  padding: "4px 16px",
                  borderRadius: 9999,
                  border: "2px solid #FFD700",
                  boxShadow: "0 2px 6px rgba(139,0,0,0.35)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                परम धर्म सेवा
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: colors.gold,
                  background: "linear-gradient(180deg, #6B0000, #8B0000)",
                  padding: "4px 16px",
                  borderRadius: 9999,
                  border: "2px solid #FFD700",
                  boxShadow: "0 2px 6px rgba(139,0,0,0.35)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                अन्नदान महादान
              </span>
            </div>
            <p style={{ fontSize: 12, color: colors.maroon, fontWeight: 600, margin: 0 }}>
              ॥ जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे ॥
            </p>
          </div>
        </div>
      </div>
    );
  }
);

interface AnimatedEntryProps {
  children: React.ReactNode;
  styleOverride?: React.CSSProperties;
}

function AnimatedEntry({ children, styleOverride }: AnimatedEntryProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      style={{
        transition: "opacity 300ms, transform 300ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        ...(styleOverride || {}),
      }}
    >
      {children}
    </div>
  );
}

export default PosterPreview;
