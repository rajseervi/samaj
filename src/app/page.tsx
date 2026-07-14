"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getBlogPosts, type BlogPost } from "@/data/blog-posts";
import Header from "@/components/Header";

/* ─── 3D Tilt Hook ─── */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) * 12;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  };
  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };
  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}

/* ─── Animated Counter ─── */
function Counter({ end, label, icon }: { end: number; label: string; icon: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(end / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, duration / 60);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);
  return (
    <div ref={ref} className="text-center p-4">
      <span className="text-3xl mb-2 block">{icon}</span>
      <span className="text-4xl font-extrabold text-[#8B0000] block">{count.toLocaleString("en-IN")}+</span>
      <span className="text-sm font-semibold text-[#B8860B] mt-1 block">{label}</span>
    </div>
  );
}

/* ─── Blog Card ─── */
function BlogCard({ post }: { post: BlogPost }) {
  const tilt = useTilt<HTMLDivElement>();
  const catColors: Record<BlogPost["category"], string> = {
    seva: "bg-green-600",
    event: "bg-[#FF9933]",
    announcement: "bg-blue-600",
    story: "bg-purple-600",
  };
  const catLabels: Record<BlogPost["category"], string> = {
    seva: "सेवा",
    event: "आयोजन",
    announcement: "घोषणा",
    story: "कहानी",
  };
  return (
    <div
      {...tilt}
      className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
      style={{ transition: "transform 0.1s ease-out, box-shadow 0.3s" }}
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5] flex items-center justify-center">
        <img src={post.imageUrl} alt="" className="w-20 h-20 object-contain opacity-60" />
        <span className={`absolute top-2 right-2 text-xs font-bold text-white px-2 py-1 rounded-full ${catColors[post.category]}`}>
          {catLabels[post.category]}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-[#B8860B] font-semibold mb-1">
          {new Date(post.date).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <h3 className="text-lg font-extrabold text-[#8B0000] leading-tight mb-2 group-hover:text-[#FF9933] transition-colors">
          {post.titleHi}
        </h3>
        <p className="text-sm text-[#5C3317] leading-relaxed line-clamp-3">
          {post.excerptHi}
        </p>
      </div>
    </div>
  );
}

/* ─── Scroll Reveal ─── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── 3D Carousel Gallery ─── */
const GALLERY_ITEMS = [
  { icon: "🍛", title: "भोजन सेवा", subtitle: "अन्नदान महादान", color: "#FF9933", bgColor: "#FFF3E0" },
  { icon: "🪔", title: "हरिद्वार भवन", subtitle: "भोजनशाला", color: "#8B0000", bgColor: "#FFE0E0" },
  { icon: "🙏", title: "माताजी कृपा", subtitle: "जगत जननी", color: "#B8860B", bgColor: "#FFF8DC" },
  { icon: "✨", title: "सामुदायिक सेवा", subtitle: "परम धर्म", color: "#DAA520", bgColor: "#FFFDF0" },
  { icon: "🎉", title: "आयोजन", subtitle: "धार्मिक उत्सव", color: "#E88920", bgColor: "#FFF5E6" },
  { icon: "❤️", title: "भामाशाह", subtitle: "दानवीरों का सम्मान", color: "#A52A2A", bgColor: "#FFE8E8" },
  { icon: "📿", title: "भजन संध्या", subtitle: "भक्ति एवं सेवा", color: "#CC6600", bgColor: "#FFF0D4" },
  { icon: "🌸", title: "नवरात्रि", subtitle: "शक्ति उपासना", color: "#B22222", bgColor: "#FFD6D6" },
];

function ThreeDCarousel() {
  const [angle, setAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const radius = 220;
  const total = GALLERY_ITEMS.length;

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setAngle((a) => a + 0.3);
    }, 16);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused]);

  const handlePrev = () => setAngle((a) => a + 360 / total + 15);
  const handleNext = () => setAngle((a) => a - 360 / total - 15);

  return (
    <div className="relative">
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 bg-[#8B0000] text-[#FFD700] font-extrabold rounded-xl hover:bg-[#5C0000] transition shadow-lg flex items-center gap-2 border-2 border-[#DAA520]"
        >
          ← पीछे
        </button>
        <button
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="px-5 py-2.5 bg-[#FF9933] text-white font-extrabold rounded-xl hover:bg-[#E88920] transition shadow-lg flex items-center gap-2"
        >
          {isPaused ? "▶ चलाएं" : "⏸ रोकें"}
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2.5 bg-[#8B0000] text-[#FFD700] font-extrabold rounded-xl hover:bg-[#5C0000] transition shadow-lg flex items-center gap-2 border-2 border-[#DAA520]"
        >
          आगे →
        </button>
      </div>

      <div className="relative mx-auto" style={{ width: "100%", height: "420px", perspective: "1000px" }}>
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${angle}deg)`,
            transition: "transform 0.1s linear",
          }}
        >
          {GALLERY_ITEMS.map((item, i) => {
            const theta = (360 / total) * i;
            const rad = (theta * Math.PI) / 180;
            const x = Math.sin(rad) * radius;
            const z = Math.cos(rad) * radius;
            const isFront = Math.abs(z - radius) < 40;
            const scale = isFront ? 1.1 : 0.85;
            const opacity = isFront ? 1 : 0.7;
            const zIndex = isFront ? 10 : 0;

            return (
              <div
                key={i}
                className="absolute cursor-pointer transition-all duration-300"
                style={{
                  width: "160px",
                  height: "200px",
                  marginLeft: "-80px",
                  marginTop: "-100px",
                  transform: `translate3d(${x}px, 0, ${z}px) rotateY(${theta}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
                onClick={() => setSelectedIndex(i)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className="w-full h-full rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4 border-2"
                  style={{
                    background: `linear-gradient(145deg, ${item.bgColor}, #fff)`,
                    borderColor: item.color,
                    boxShadow: isFront
                      ? `0 20px 50px rgba(0,0,0,0.2), 0 0 30px ${item.color}40`
                      : "0 8px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <span className="text-5xl mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">{item.icon}</span>
                  <h4 className="text-base font-extrabold text-center leading-tight" style={{ color: item.color }}>
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold mt-1 text-[#5C3317] opacity-80">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        {GALLERY_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => setAngle(-((360 / total) * i))}
            className="w-3 h-3 rounded-full transition-all duration-300 border-2 border-[#DAA520]"
            style={{
              background: Math.abs(((angle % 360) + 360) % 360 - (360 / total) * i) < 15 ? item.color : "transparent",
              transform: Math.abs(((angle % 360) + 360) % 360 - (360 / total) * i) < 15 ? "scale(1.4)" : "scale(1)",
            }}
            title={item.title}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border-4 border-[#DAA520] p-8 max-w-md w-full text-center animate-fade-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-7xl block mb-4">{GALLERY_ITEMS[selectedIndex].icon}</span>
            <h3 className="text-2xl font-extrabold mb-2" style={{ color: GALLERY_ITEMS[selectedIndex].color }}>
              {GALLERY_ITEMS[selectedIndex].title}
            </h3>
            <p className="text-lg text-[#5C3317] font-semibold mb-6">{GALLERY_ITEMS[selectedIndex].subtitle}</p>
            <p className="text-[#5C3317] leading-relaxed mb-6">
              श्री अखिल भारतीय सीरवी समाज ट्रस्ट, हरिद्वार भवन की भोजनशाला में निरंतर सेवा कार्य चल रहे हैं।
              जगत जननी श्री आई माताजी की कृपा से समाज का हर कार्य सफल हो रहा है।
            </p>
            <button
              onClick={() => setSelectedIndex(null)}
              className="px-6 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl hover:bg-[#E88920] transition"
            >
              बंद करें ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* ═════════════════════════════════════════════════
   ENHANCED 3D HERO SECTION COMPONENTS
   ═════════════════════════════════════════════════ */

/* ─── Enhanced Particle Field with glow trails ─── */
function EnhancedParticleField() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;

  const particles = Array.from({ length: 30 }).map((_, i) => {
    const size = 3 + Math.random() * 10;
    const colors = ["#FFD700", "#FFA500", "#FF8C00", "#FFB347", "#FFF8DC", "#FF9933"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const depth = 0.3 + Math.random() * 1.5;
    return { id: i, size, color, depth,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 40,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ perspective: "800px" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            background: `radial-gradient(circle, ${p.color}, transparent)`,
            left: p.left + "%",
            top: p.top + "%",
            opacity: 0,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}80, 0 0 ${p.size * 4}px ${p.color}40`,
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: p.delay + "s",
            transform: `translateZ(${p.depth * 20}px)`,
            filter: `blur(${p.size < 5 ? 0.5 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── 3D Mandala Rings ─── */
function MandalaRings({ scrollOffset }: { scrollOffset: number }) {
  return (
    <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
      {/* Ring 1 - outermost */}
      <div
        className="absolute rounded-full border-2 border-dashed"
        style={{
          width: "500px", height: "500px",
          marginLeft: "-250px", marginTop: "-250px",
          borderColor: "rgba(255,215,0,0.2)",
          animation: "rotateMandala 25s linear infinite",
          transform: `rotateX(60deg) translateZ(-20px)`,
        }}
      />
      {/* Ring 2 */}
      <div
        className="absolute rounded-full border border-dotted"
        style={{
          width: "420px", height: "420px",
          marginLeft: "-210px", marginTop: "-210px",
          borderColor: "rgba(255,165,0,0.25)",
          animation: "rotateMandala 20s linear infinite reverse",
          transform: `rotateX(60deg) translateZ(-5px)`,
        }}
      />
      {/* Ring 3 */}
      <div
        className="absolute rounded-full border-2"
        style={{
          width: "340px", height: "340px",
          marginLeft: "-170px", marginTop: "-170px",
          borderColor: "rgba(255,215,0,0.35)",
          animation: "rotateMandala 15s linear infinite",
          transform: `rotateX(60deg) translateZ(10px)`,
          boxShadow: "0 0 40px rgba(255,215,0,0.15), inset 0 0 40px rgba(255,215,0,0.1)",
        }}
      />
      {/* Ring 4 - innermost */}
      <div
        className="absolute rounded-full border-2 border-dashed"
        style={{
          width: "260px", height: "260px",
          marginLeft: "-130px", marginTop: "-130px",
          borderColor: "rgba(255,165,0,0.4)",
          animation: "rotateMandala 10s linear infinite reverse",
          transform: `rotateX(60deg) translateZ(25px)`,
        }}
      />
      {/* Mandala dots on rings */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360;
        const rad = (angle * Math.PI) / 180;
        const radius = 170;
        return (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: "8px", height: "8px",
              background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFA500" : "#FF8C00",
              boxShadow: `0 0 6px ${i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FFA500" : "#FF8C00"}`,
              left: `calc(50% + ${Math.cos(rad) * radius}px)`,
              top: `calc(50% + ${Math.sin(rad) * radius * 0.5}px)`,
              animation: `mandalaDotPulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Floating Diyas ─── */
function FloatingDiyas() {
  const [hasMounted, setHasMounted] = useState(false);
  const diyaFlames = useRef([0.38, 0.42, 0.36, 0.44, 0.49]).current;

  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;

  const diyas = [
    { left: "8%", top: "25%", delay: 0, size: 40, floatDur: 5 },
    { left: "85%", top: "30%", delay: 1.5, size: 35, floatDur: 6 },
    { left: "12%", top: "65%", delay: 3, size: 32, floatDur: 4.5 },
    { left: "80%", top: "70%", delay: 0.8, size: 38, floatDur: 5.5 },
    { left: "50%", top: "12%", delay: 2.2, size: 30, floatDur: 4 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {diyas.map((d, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: d.left, top: d.top,
            width: d.size + "px", height: d.size + "px",
            animation: `floatDiya ${d.floatDur}s ease-in-out infinite`,
            animationDelay: d.delay + "s",
            filter: "drop-shadow(0 0 12px rgba(255,140,0,0.6))",
          }}
        >
          {/* Diya bowl */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4 rounded-b-full"
            style={{
              background: "linear-gradient(180deg, #B8860B 0%, #8B6914 50%, #6B4F12 100%)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,215,0,0.3)",
            }}
          />
          {/* Flame */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "60%",
              width: "14px", height: "18px",
              animation: `flickerFlame ${diyaFlames[i]}s ease-in-out infinite alternate`,
            }}
          >
            <div
              className="w-full h-full rounded-[60%_60%_40%_40%]"
              style={{
                background: "linear-gradient(180deg, #FFD700 0%, #FFA500 40%, #FF6347 100%)",
                boxShadow: "0 0 10px #FFA500, 0 0 20px #FF6347, 0 0 30px rgba(255,100,0,0.5)",
              }}
            />
            {/* Inner flame */}
            <div
              className="absolute top-1 left-1/2 -translate-x-1/2 w-[8px] h-[10px] rounded-[60%_60%_40%_40%]"
              style={{
                background: "linear-gradient(180deg, #FFF8DC 0%, #FFD700 100%)",
              }}
            />
          </div>
          {/* Glow aura */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              bottom: "50%",
              width: "30px", height: "30px",
              background: "radial-gradient(circle, rgba(255,200,0,0.5) 0%, transparent 70%)",
              animation: "glowPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Golden Light Rays ─── */
function LightRays() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;

  // Deterministic values — seeded by index so server and client match
  const rays = Array.from({ length: 20 }).map((_, i) => {
    const seed = i * 47.11;
    const angle = (i / 20) * 360;
    const height = 180 + (seed % 120);
    const dur = 4 + ((seed * 7) % 400) / 100;
    const delay = ((seed * 13) % 300) / 100;
    return { angle, height, dur, delay };
  });

  return (
    <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
      {rays.map((ray, i) => (
        <div
          key={i}
          className="absolute origin-bottom"
          style={{
            width: "3px",
            height: `${ray.height}px`,
            background: `linear-gradient(0deg, rgba(255,215,0,0.5) 0%, rgba(255,165,0,0.3) 40%, transparent 100%)`,
            transform: `rotate(${ray.angle}deg)`,
            left: "50%",
            bottom: "0",
            borderRadius: "2px",
            animation: `rayShimmer ${ray.dur}s ease-in-out infinite`,
            animationDelay: `${ray.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Premium Ornate Om Component ─── */
function EnhancedRotatingOm({ parallaxX, parallaxY }: { parallaxX: number; parallaxY: number }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return <div className="w-80 h-80 mx-auto" />;

  // Pre-compute deterministic values for particles (uses index-based seed)
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const seed = i * 137.5;
    const angle = ((seed % 360) / 360) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 170 + (seed % 60);
    const size = 1.5 + ((seed % 100) / 100) * 3;
    const delay = (seed % 400) / 100;
    const dur = 3 + ((seed % 500) / 100);
    const colorIdx = i % 3;
    const colors = ["#FFF8DC", "#FFD700", "#FFA500"];
    return { i, rad, dist, size, delay, dur, color: colors[colorIdx] };
  });

  return (
    <div
      className="relative w-80 h-80 mx-auto cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: "355px",
        transform: `
          translateX(${parallaxX * -15}px)
          translateY(${parallaxY * -10}px)
          rotateY(${parallaxX * 8}deg)
          rotateX(${parallaxY * -5}deg)
        `,
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* === GLOW AURAS === */}
      <div
        className="absolute inset-[-80px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,215,0,${isHovered ? 0.2 : 0.12}) 0%, rgba(255,165,0,${isHovered ? 0.1 : 0.05}) 40%, transparent 70%)`,
          animation: "pulseAura 3s ease-in-out infinite",
          transition: "background 0.5s ease",
        }}
      />
      <div
        className="absolute inset-[-50px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,200,0,${isHovered ? 0.18 : 0.08}) 0%, transparent 60%)`,
          animation: "pulseAura 3s ease-in-out infinite 0.5s",
          transition: "background 0.5s ease",
        }}
      />

      {/* === 8-LAYER ORNAMENTAL RING SYSTEM === */}

      {/* R8: outer pearl ring - 24 glowing dots */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360;
        const rad = (angle * Math.PI) / 180;
        const r = 200;
        return (
          <div
            key={`p8-${i}`}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#DAA520" : "#B8860B",
              boxShadow: `0 0 4px ${i % 3 === 0 ? "#FFD700" : "#DAA520"}`,
              left: `calc(50% + ${Math.cos(rad) * r}px - 4px)`,
              top: `calc(50% + ${Math.sin(rad) * r}px - 4px)`,
              opacity: 0.4,
              animation: `petalDotPulse ${2.5 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        );
      })}

      {/* R7: outer dashed */}
      <div
        className="absolute inset-[-34px] rounded-full pointer-events-none"
        style={{
          border: `${isHovered ? "2px" : "1.5px"} dashed rgba(255,215,0,${isHovered ? 0.3 : 0.18})`,
          animation: `rotateOm ${isHovered ? 18 : 28}s linear infinite`,
          transition: "border 0.5s ease, animation-duration 0.5s ease",
        }}
      />

      {/* R6: thin solid */}
      <div
        className="absolute inset-[-26px] rounded-full pointer-events-none"
        style={{
          border: `1px solid rgba(255,200,0,${isHovered ? 0.3 : 0.18})`,
          animation: `rotateOm ${isHovered ? 15 : 22}s linear infinite reverse`,
          transition: "border 0.5s ease, animation-duration 0.5s ease",
        }}
      />

      {/* R5: dotted band */}
      <div
        className="absolute inset-[-18px] rounded-full pointer-events-none"
        style={{
          border: `3px dotted rgba(255,180,0,${isHovered ? 0.35 : 0.22})`,
          animation: `rotateOm ${isHovered ? 12 : 18}s linear infinite`,
          transition: "border 0.5s ease, animation-duration 0.5s ease",
        }}
      />

      {/* R4: double ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-6px",
          border: "1.5px solid rgba(255,215,0,0.15)",
          animation: `rotateOm ${isHovered ? 14 : 24}s linear infinite reverse`,
          transition: "animation-duration 0.5s ease",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-4px",
          border: "1px solid rgba(255,165,0,0.12)",
          animation: `rotateOm ${isHovered ? 10 : 20}s linear infinite`,
          transition: "animation-duration 0.5s ease",
        }}
      />

      {/* R3: dashed */}
      <div
        className="absolute inset-[-6px] rounded-full pointer-events-none"
        style={{
          border: `2px dashed rgba(255,215,0,${isHovered ? 0.45 : 0.3})`,
          animation: `rotateOm ${isHovered ? 7 : 12}s linear infinite reverse`,
          transition: "border 0.5s ease, animation-duration 0.5s ease",
        }}
      />

      {/* R2: lotus petal dots - 16 petals */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360;
        const rad = (angle * Math.PI) / 180;
        const r = 152;
        const isGold = i % 4 === 0;
        return (
          <div
            key={`petal-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: isGold ? "5px" : "3px",
              height: isGold ? "5px" : "3px",
              borderRadius: "50%",
              background: isGold ? "#FFD700" : i % 4 === 2 ? "#DAA520" : "transparent",
              border: i % 4 === 1 || i % 4 === 3 ? "1px solid rgba(255,215,0,0.35)" : "none",
              boxShadow: isGold ? `0 0 8px #FFD700, 0 0 16px rgba(255,165,0,0.5)` : `0 0 3px #DAA520`,
              left: `calc(50% + ${Math.cos(rad) * r}px)`,
              top: `calc(50% + ${Math.sin(rad) * r}px)`,
              transform: "translate(-50%, -50%)",
              animation: `petalDotPulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        );
      })}

      {/* R1: inner solid */}
      <div
        className="absolute inset-2 rounded-full pointer-events-none"
        style={{
          border: `2.5px solid rgba(255,215,0,${isHovered ? 0.55 : 0.35})`,
          animation: `rotateOm ${isHovered ? 5 : 9}s linear infinite`,
          boxShadow: `0 0 10px rgba(255,215,0,${isHovered ? 0.3 : 0.15})`,
          transition: "border 0.5s ease, box-shadow 0.5s ease, animation-duration 0.5s ease",
        }}
      />

      {/* === MANDALA 8-POINTED STAR === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 320 320" className="w-full h-full absolute" style={{
          animation: `rotateOm ${isHovered ? 8 : 16}s linear infinite reverse`,
          transition: "animation-duration 0.5s ease",
        }}>
          <rect x="156" y="70" width="8" height="180" rx="4" fill="rgba(255,215,0,0.12)" transform="rotate(0, 160, 160)"/>
          <rect x="156" y="70" width="8" height="180" rx="4" fill="rgba(255,215,0,0.12)" transform="rotate(45, 160, 160)"/>
          <rect x="156" y="70" width="8" height="180" rx="4" fill="rgba(255,215,0,0.12)" transform="rotate(90, 160, 160)"/>
          <rect x="156" y="70" width="8" height="180" rx="4" fill="rgba(255,215,0,0.12)" transform="rotate(135, 160, 160)"/>
        </svg>
      </div>

      {/* === LIGHT BEAMS === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{
        animation: `rotateOm ${20}s linear infinite`,
      }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`beam-${i}`}
            className="absolute origin-bottom"
            style={{
              width: "2px",
              height: "130px",
              background: `linear-gradient(0deg, rgba(255,215,0,${isHovered ? 0.35 : 0.15}) 0%, transparent 100%)`,
              transform: `rotate(${i * 30}deg)`,
              bottom: "50%",
              left: "50%",
              marginLeft: "-1px",
            }}
          />
        ))}
      </div>

      {/* === MAIN GOLDEN SPHERE === */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 38% 32%, #FFE55C 0%, #FFD700 15%, #DAA520 35%, #B8860B 55%, #8B6508 75%, #4A2A00 100%)",
          boxShadow: `
            0 0 70px rgba(255,215,0,${isHovered ? 0.6 : 0.4}),
            0 0 140px rgba(255,165,0,${isHovered ? 0.35 : 0.22}),
            0 0 220px rgba(255,140,0,${isHovered ? 0.2 : 0.12}),
            0 0 300px rgba(255,100,0,${isHovered ? 0.1 : 0.05}),
            inset 0 0 90px rgba(255,255,200,${isHovered ? 0.2 : 0.12}),
            inset 0 0 40px rgba(0,0,0,0.3)
          `,
          border: "5px solid #DAA520",
          animation: `omSphereFloat ${isHovered ? 3 : 6}s ease-in-out infinite`,
          transformStyle: "preserve-3d",
          transition: "box-shadow 0.5s ease, animation-duration 0.5s ease",
        }}
      >
        {/* Inner ring 1 */}
        <div
          className="absolute inset-5 rounded-full pointer-events-none"
          style={{
            border: "2px solid rgba(255,255,255,0.2)",
            animation: `rotateOm ${isHovered ? 3 : 7}s linear infinite reverse`,
            transition: "animation-duration 0.5s ease",
          }}
        />
        {/* Inner ring 2 */}
        <div
          className="absolute inset-10 rounded-full pointer-events-none"
          style={{
            border: "1px dotted rgba(255,255,255,0.12)",
            animation: `rotateOm ${isHovered ? 4 : 9}s linear infinite`,
            transition: "animation-duration 0.5s ease",
          }}
        />

        {/* Shiv netra / Trishul dots */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 flex gap-5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF8DC]/60" style={{ boxShadow: "0 0 4px #FFD700" }}/>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/80" style={{ boxShadow: "0 0 6px #FFD700, 0 0 10px rgba(255,165,0,0.5)" }}/>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF8DC]/60" style={{ boxShadow: "0 0 4px #FFD700" }}/>
        </div>

        {/* The Om symbol */}
        <img
          src="/om-gold.svg"
          alt="ॐ"
          className="w-[45%] h-[45%] relative z-10"
          style={{
            filter: "drop-shadow(0 6px 25px rgba(0,0,0,0.7)) drop-shadow(0 0 25px rgba(255,215,0,0.35)) drop-shadow(0 0 50px rgba(255,165,0,0.2))",
            animation: "omBreath 3.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* === AMBIENT SPARKLE PARTICLES === */}
      {particles.map((p) => (
        <div
          key={`amb-${p.i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            left: `calc(50% + ${Math.cos(p.rad) * p.dist}px)`,
            top: `calc(50% + ${Math.sin(p.rad) * p.dist}px)`,
            opacity: 0,
            animation: `ambientSparkle ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Text Reveal Animation ─── */
function AnimatedHeading({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`animate-heading-reveal ${className}`}
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      {children}
    </div>
  );
}

/* ─── Mouse Glow Follower ─── */
function MouseGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(255,165,0,0.06) 30%, transparent 70%)",
        borderRadius: "50%",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

/* ═════════════════════════════════════════════════
   MAIN PAGE
   ═════════════════════════════════════════════════ */

export default function HomePage() {
  const blogPosts = getBlogPosts();
  const heroRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse parallax for hero
  const handleHeroMouseMove = useCallback((e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x, y });
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    setMouseParallax({ x: 0, y: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8E7] overflow-x-hidden">
      <Header />
      <MouseGlow />

      <style jsx global>{`
        /* ── Particle animations ── */
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          50% { opacity: 0.4; transform: translateY(-30px) translateX(15px) scale(1.3); }
          90% { opacity: 0.1; }
          100% { opacity: 0; transform: translateY(-60px) translateX(-10px) scale(0.5); }
        }
        /* ── Mandala ── */
        @keyframes rotateMandala {
          from { transform: rotateX(60deg) rotateY(0deg); }
          to { transform: rotateX(60deg) rotateY(360deg); }
        }
        @keyframes mandalaDotPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.8); }
        }
        /* ── Om rotations ── */
        @keyframes rotateOm {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes rotateOm3D {
          0% { transform: rotateY(0deg) rotateX(5deg); }
          25% { transform: rotateY(90deg) rotateX(1deg); }
          50% { transform: rotateY(180deg) rotateX(5deg); }
          75% { transform: rotateY(270deg) rotateX(0deg); }
          100% { transform: rotateY(360deg) rotateX(5deg); }
        }
        @keyframes counterRotate3D {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(-360deg); }
        }
        @keyframes pulseAura {
          0%, 100% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        /* ── Enhanced Om animations ── */
        @keyframes petalDotPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.8); opacity: 1; }
        }
        @keyframes omSphereFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes omBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes ambientSparkle {
          0%, 100% { opacity: 0; transform: scale(0.3) translateY(0px); }
          30% { opacity: 0.8; transform: scale(1.2) translateY(-4px); }
          70% { opacity: 0.4; transform: scale(0.8) translateY(2px); }
          100% { opacity: 0; transform: scale(0.3) translateY(0px); }
        }
        @keyframes sparkleOrbit {
          0% { transform: rotate(0deg) translateX(0px) scale(1); opacity: 1; }
          50% { transform: rotate(180deg) translateX(10px) scale(0.5); opacity: 0.3; }
          100% { transform: rotate(360deg) translateX(0px) scale(1); opacity: 1; }
        }
        @keyframes rayShimmer {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
        @keyframes rayIntensity {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        /* ── Diya ── */
        @keyframes floatDiya {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(2deg); }
          75% { transform: translateY(10px) rotate(-2deg); }
        }
        @keyframes flickerFlame {
          0% { transform: scaleX(1) scaleY(1); }
          25% { transform: scaleX(0.85) scaleY(1.1); }
          50% { transform: scaleX(1.1) scaleY(0.95); }
          75% { transform: scaleX(0.9) scaleY(1.05); }
          100% { transform: scaleX(1.05) scaleY(0.9); }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        /* ── Heading reveal ── */
        @keyframes headingReveal {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(8px); }
          60% { opacity: 1; filter: blur(0px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .animate-heading-reveal {
          animation: headingReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* ── Gradient shift ── */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientShiftSlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradientShift 6s ease infinite;
        }
        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradientShiftSlow 12s ease infinite;
        }
        /* ── Pulse glow for buttons ── */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3), 0 0 40px rgba(255,165,0,0.2); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,153,51,0.4), 0 0 120px rgba(255,140,0,0.3); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        .animate-scroll-dot {
          animation: scrollBounce 2s ease-in-out infinite;
        }
        /* ── Divider sparkle ── */
        @keyframes dividerSparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-divider-sparkle {
          animation: dividerSparkle 2s ease-in-out infinite;
        }
        /* ── Seva services ── */
        @keyframes sevaParticleRise {
          0%, 100% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 0.6; }
          50% { opacity: 0.2; transform: translateY(-30px); }
          80% { opacity: 0.1; }
        }
        @keyframes sevaCardEnter {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sevaIconPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes borderSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          HERO SECTION - ENHANCED 3D ANIMATED
          ════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Multi-layer animated background */}
        <div
          className="absolute inset-0 animate-gradient-slow"
          style={{
            background: `
              radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 20% 60%, rgba(255,140,0,0.3) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 60%, rgba(255,165,0,0.3) 0%, transparent 40%),
              linear-gradient(160deg, #1a0a00 0%, #3d1500 20%, #8B4513 40%, #D2691E 70%, #FF8C00 100%)
            `,
            backgroundSize: "400% 400%",
          }}
        />

        {/* Dark overlay mesh pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23FFD700'/%3E%3Cpath d='M20 0 L20 40 M0 20 L40 20' stroke='%23FFD700' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Enhanced particle field */}
        <EnhancedParticleField />

        {/* 3D Mandala rings */}
        <MandalaRings scrollOffset={scrollOffset} />

        {/* Floating Diyas */}
        <FloatingDiyas />

        {/* Golden light rays */}
        <LightRays />

        {/* Main content */}
        <div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{
            transform: `translateX(${mouseParallax.x * 15}px) translateY(${mouseParallax.y * 10}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {/* 3D Rotating Om */}
          <AnimatedHeading className="mb-10 mt-10" delay={0}>
            <EnhancedRotatingOm parallaxX={mouseParallax.x} parallaxY={mouseParallax.y} />
          </AnimatedHeading>

          {/* Main Heading */}
          <AnimatedHeading delay={0.3}>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-wide"
              style={{
                textShadow: `
                  3px 3px 0 #8B0000,
                  5px 5px 0 rgba(0,0,0,0.3),
                  0 0 80px rgba(255,215,0,0.3),
                  0 0 150px rgba(255,165,0,0.2)
                `,
              }}
            >
              श्री अखिल भारतीय
              <br />
              सीरवी समाज ट्रस्ट
            </h1>
          </AnimatedHeading>

          {/* Subtitle */}
          <AnimatedHeading delay={0.6}>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFD700] mt-4 drop-shadow-[0_2px_8px_rgba(255,140,0,0.6)]">
              हरिद्वार भवन की भोजनशाला
            </p>
          </AnimatedHeading>

          {/* Decorative Divider */}
          <AnimatedHeading delay={0.8}>
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded" />
              <span className="text-[#FFD700] text-2xl sm:text-3xl animate-divider-sparkle drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                ✦
              </span>
              <div className="w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded" />
            </div>
          </AnimatedHeading>

          {/* Description */}
          <AnimatedHeading delay={1.0}>
            <p className="text-lg sm:text-xl text-white/90 font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
              परम धर्म सेवा • अन्नदान महादान
              <br />
              <span className="text-base opacity-80">
                जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे
              </span>
            </p>
          </AnimatedHeading>

          {/* CTA Buttons with enhanced design */}
          <AnimatedHeading delay={1.2}>
            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
              {/* Primary CTA - Poster */}
              <Link
                href="/contact"
                className="group relative px-10 py-5 bg-gradient-to-br from-[#FF9933] via-[#FF8C00] to-[#E07800] text-white font-extrabold text-lg rounded-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
                style={{
                  boxShadow: "0 8px 32px rgba(255,140,0,0.5), 0 0 0 3px rgba(255,215,0,0.3), 0 0 80px rgba(255,140,0,0.2)",
                  animation: "pulseGlow 3s ease-in-out infinite",
                }}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Shine line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Sparkle icons */}
                <span className="absolute -top-1 -right-1 text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">✨</span>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-2xl group-hover:animate-bounce">📋</span>
                  <span className="tracking-wide">पोस्टर बनाएं</span>
                </span>
              </Link>

              {/* Secondary CTA - Blog */}
              <Link
                href="#blog"
                className="group relative px-10 py-5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-[#FFD700] font-extrabold text-lg rounded-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
                style={{
                  border: "2px solid rgba(255,215,0,0.4)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 0 30px rgba(255,215,0,0.05)",
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: "0 0 40px rgba(255,215,0,0.3), 0 0 80px rgba(255,165,0,0.15)",
                  }}
                />
                {/* Border shine on hover */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#FFD700]/60 transition-all duration-500" />
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-2xl group-hover:animate-bounce">📖</span>
                  <span className="tracking-wide">ब्लॉग पढ़ें</span>
                </span>
              </Link>
            </div>
          </AnimatedHeading>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF8E7] to-transparent pointer-events-none" />
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-20 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFFDF5] to-[#FFF8E7]" />
        {/* Ornamental pattern */}
        <div className="absolute inset-0 opacity-[0.04] bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 3 L33 27 L57 30 L33 33 L30 57 L27 33 L3 30 L27 27 Z' fill='%238B0000'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }} />
        {/* Radial glow accents */}
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.1)_0%,transparent_70%)] pointer-events-none" />
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-4 drop-shadow-[0_1px_2px_rgba(139,0,0,0.1)]">
              ✨ हमारी सेवा का प्रभाव ✨
            </h2>
            {/* Subtitle */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-8 h-[2px] bg-[#DAA520]/40 rounded" />
              <span className="text-[#B8860B] font-semibold text-sm tracking-wide">SEVA IMPACT</span>
              <div className="w-8 h-[2px] bg-[#DAA520]/40 rounded" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Counter end={50000} label="भोजन सेवाएं" icon="🍛" />
              <Counter end={1200} label="भामाशाह" icon="👥" />
              <Counter end={15} label="वर्षों की सेवा" icon="📅" />
              <Counter end={100000} label="लाभार्थी" icon="🙏" />
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── ABOUT TRUST SECTION ── */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E7] via-[#FFF3D6] to-[#FFEDC4] animate-gradient" style={{ backgroundSize: "200% 200%" }} />
        {/* Corner flourishes */}
        <div className="absolute top-0 left-0 w-40 h-40 opacity-[0.08] pointer-events-none">
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="80" fill="none" stroke="#8B0000" strokeWidth="1" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#DAA520" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="40" fill="none" stroke="#FF9933" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.08] pointer-events-none transform rotate-180">
          <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="80" fill="none" stroke="#8B0000" strokeWidth="1" />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#DAA520" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="40" fill="none" stroke="#FF9933" strokeWidth="0.5" />
          </svg>
        </div>

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-3">
              🏛️ हमारे बारे में
            </h2>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-8 h-[2px] bg-[#DAA520]/40 rounded" />
              <span className="text-[#B8860B] font-semibold text-sm tracking-wide">ABOUT US</span>
              <div className="w-8 h-[2px] bg-[#DAA520]/40 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "हमारा मिशन",
                  desc: "श्री अखिल भारतीय सीरवी समाज ट्रस्ट का उद्देश्य है समाज के हर वर्ग की सेवा करना। हरिद्वार भवन की भोजनशाला के माध्यम से प्रतिदिन सैकड़ों श्रद्धालुओं को निःशुल्क भोजन सेवा प्रदान की जाती है।",
                },
                {
                  icon: "🙏",
                  title: "हमारी प्रेरणा",
                  desc: "जगत जननी श्री आई माताजी की असीम कृपा और आशीर्वाद हमारी प्रेरणा है। 'परम धर्म सेवा' और 'अन्नदान महादान' के आदर्शों पर चलते हुए हम निरंतर सेवा कार्य में लगे हैं।",
                },
                {
                  icon: "🤝",
                  title: "भामाशाहों का योगदान",
                  desc: "समाज के दानी भामाशाह अपने त्याग और समर्पण से इस सेवा को संभव बनाते हैं। हर भामाशाह का योगदान समाज के लिए प्रेरणा का स्रोत है और सदैव स्मरणीय रहेगा।",
                },
              ].map((item, i) => {
                const tilt = useTilt<HTMLDivElement>();
                return (
                  <div
                    key={i}
                    {...tilt}
                    className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-8 text-center hover:shadow-2xl transition-shadow"
                    style={{ transition: "transform 0.1s ease-out, box-shadow 0.3s" }}
                  >
                    <span className="text-5xl block mb-4">{item.icon}</span>
                    <h3 className="text-xl font-extrabold text-[#8B0000] mb-3">{item.title}</h3>
                    <p className="text-[#5C3317] leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── SEVA SERVICES ── */}
      <section id="services" className="py-20 bg-gradient-to-b from-[#8B0000] via-[#6B0000] to-[#3d0000] text-white relative overflow-hidden">
        {/* Background animated particles (deterministic to avoid hydration mismatch) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => {
            const seed = i * 73.27;
            const w = 3 + ((seed * 17) % 100) / 100 * 4;
            const h = 3 + ((seed * 29) % 100) / 100 * 4;
            const l = ((seed * 11) % 100);
            const t = ((seed * 37) % 100);
            const dur = 4 + ((seed * 7) % 600) / 100;
            const delay = ((seed * 13) % 500) / 100;
            return (
              <div
                key={`sevap-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${w}px`,
                  height: `${h}px`,
                  background: i % 2 === 0 ? "#FFD700" : "#FFA500",
                  left: `${l}%`,
                  top: `${t}%`,
                  opacity: 0,
                  boxShadow: `0 0 4px ${i % 2 === 0 ? "#FFD700" : "#FFA500"}`,
                  animation: `sevaParticleRise ${dur}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Floating diya silhouettes in background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" aria-hidden="true">
          <span className="absolute top-[10%] left-[5%] text-[120px] transform -rotate-12">🪔</span>
          <span className="absolute top-[20%] right-[8%] text-[100px] transform rotate-6">🪔</span>
          <span className="absolute bottom-[15%] left-[10%] text-[80px] transform -rotate-6">🪔</span>
          <span className="absolute bottom-[25%] right-[5%] text-[110px] transform rotate-12">🪔</span>
        </div>

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            {/* Section heading with glow */}
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFD700] mb-3 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                🪔 हमारी सेवाएं 🪔
              </h2>
              <p className="text-white/60 font-semibold text-sm">परम धर्म सेवा के अंतर्गत निरंतर कार्यरत</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🍛", title: "भोजन सेवा", desc: "प्रतिदिन निःशुल्क भोजन का आयोजन", gradient: "from-[#FF9933] to-[#CC7A00]" },
                { icon: "☕", title: "नाश्ता सेवा", desc: "सुबह के नाश्ते की व्यवस्था", gradient: "from-[#DAA520] to-[#AA7C11]" },
                { icon: "📿", title: "धार्मिक आयोजन", desc: "पूजन, भजन एवं कथा", gradient: "from-[#B8860B] to-[#8B6508]" },
                { icon: "❤️", title: "सामुदायिक सेवा", desc: "जरूरतमंदों की सहायता", gradient: "from-[#CD5C5C] to-[#A52A2A]" },
              ].map((s, i) => {
                const tilt = useTilt<HTMLDivElement>();
                return (
                  <div
                    key={i}
                    {...tilt}
                    className="relative group cursor-default"
                    style={{
                      animationName: "sevaCardEnter",
                      animationDuration: "0.6s",
                      animationDelay: `${i * 0.15}s`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Animated border glow on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `conic-gradient(from 0deg, #FFD700, #FFA500, #FF8C00, #FFD700)`,
                        padding: "2px",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        animation: "borderSpin 3s linear infinite",
                      }}
                    />
                    {/* Card body */}
                    <div
                      className="relative bg-white/[0.07] backdrop-blur-md rounded-2xl p-6 text-center border border-[#FFD700]/20 group-hover:border-transparent transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,215,0,0.2)]"
                    >
                      {/* Icon container with pulse ring */}
                      <div className="relative inline-block mb-5">
                        {/* Pulse ring */}
                        <div
                          className="absolute inset-[-8px] rounded-full border-2 border-[#FFD700]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ animation: "sevaIconPulse 2s ease-in-out infinite" }}
                        />
                        {/* Icon */}
                        <span
                          className="relative text-5xl block transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1"
                          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}
                        >
                          {s.icon}
                        </span>
                      </div>

                      {/* Title with gradient text */}
                      <h3 className="text-xl font-extrabold mb-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent group-hover:from-[#FFEA00] group-hover:to-[#FFD700] transition-all duration-300">
                        {s.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/70 text-sm leading-relaxed mb-4 group-hover:text-white/90 transition-colors duration-300">
                        {s.desc}
                      </p>

                      {/* Decorative bottom line */}
                      <div className="w-0 group-hover:w-12 h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent mx-auto transition-all duration-500 rounded" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>

      </section>

      {/* ── 3D GALLERY ── */}
      <section id="gallery" className="py-20 relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E7] via-[#FFF0D0] to-[#FFE8C0]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%238B0000'/%3E%3C/svg%3E")`,
          backgroundSize: "50px 50px",
        }} />
        {/* Top-right glow */}
        <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(218,165,32,0.1)_0%,transparent_70%)] pointer-events-none" />
        <RevealSection>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-4">
              🖼️ हमारी गैलरी
            </h2>
            <p className="text-[#B8860B] text-center font-semibold mb-10">
              हमारी सेवा और आयोजनों की झलकियाँ
            </p>
            <ThreeDCarousel />
          </div>
        </RevealSection>
      </section>

      {/* ── BLOG SECTION ── */}
      <section id="blog" className="py-20 relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FEFCF5] to-[#FFF8E7]" />
        {/* Side decorative stripes */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#8B0000] via-[#DAA520] to-transparent opacity-20 pointer-events-none" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.025] bg-repeat pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%238B0000'/%3E%3C/svg%3E")`,
        }} />
        {/* Bottom-left glow */}
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.08)_0%,transparent_70%)] pointer-events-none" />
        {/* Top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DAA520]/30 to-transparent" />

        <RevealSection>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-3">
              📖 हमारा ब्लॉग
            </h2>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[#DAA520]/40 rounded" />
              <span className="text-[#B8860B] font-semibold text-sm tracking-wide">OUR BLOG</span>
              <div className="w-8 h-[2px] bg-[#DAA520]/40 rounded" />
            </div>
            <p className="text-[#B8860B] text-center font-semibold mb-10">
              समाज की गतिविधियों, सेवा कार्यों और आयोजनों की जानकारी
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(0, 6).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {blogPosts.length > 6 && (
              <div className="text-center mt-10">
                <Link
                  href="/blog"
                  className="inline-block px-8 py-3 bg-[#FF9933] text-white font-extrabold rounded-xl shadow-lg hover:bg-[#E88920] transition"
                >
                  सभी ब्लॉग पढ़ें →
                </Link>
              </div>
            )}
          </div>
        </RevealSection>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-16 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🪔</div>
          <div className="absolute bottom-10 right-10 text-8xl">🌸</div>
        </div>
        <RevealSection>
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              आप भी बनें आज के भामाशाह
            </h2>
            <p className="text-white/90 text-lg mb-8">
              आपके योगदान से यह सेवा निरंतर जारी रहेगी। अन्नदान में भाग लेकर पुण्य अर्जित करें।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin/login"
                className="px-8 py-4 bg-white text-[#8B0000] font-extrabold text-lg rounded-2xl shadow-xl hover:bg-[#FFF8E7] transition-all hover:scale-105"
              >
                📋 पोस्टर बनाएं (एडमिन)
              </Link>
              <Link
                href="/admin"
                className="px-8 py-4 bg-[#8B0000] text-[#FFD700] font-extrabold text-lg rounded-2xl shadow-xl hover:bg-[#5C0000] transition-all hover:scale-105 border-2 border-[#FFD700]"
              >
                🔐 प्रबंधन पैनल
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gradient-to-r from-[#4A0000] to-[#2A0000] text-[#FFD700]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-extrabold mb-3">श्री सीरवी समाज ट्रस्ट</h3>
              <p className="text-[#FFD700]/70 text-sm leading-relaxed">
                हरिद्वार भवन की भोजनशाला
                <br />
                परम धर्म सेवा • अन्नदान महादान
              </p>
            </div>
            <div>
              <h3 className="text-lg font-extrabold mb-3">त्वरित लिंक</h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">होम</Link>
                <Link href="/admin/login" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">पोस्टर जनरेटर</Link>
                <Link href="/contact" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">संपर्क करें</Link>
                <Link href="#blog" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">ब्लॉग</Link>
                <Link href="/admin" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">प्रबंधन पैनल</Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold mb-3">संपर्क</h3>
              <p className="text-[#FFD700]/70 text-sm leading-relaxed">
                🏛️ हरिद्वार भवन, हरिद्वार
                <br />
                📞 संपर्क के लिए प्रबंधन पैनल देखें
              </p>
            </div>
          </div>
          <div className="border-t border-[#FFD700]/20 mt-8 pt-6 text-center">
            <p className="text-sm text-[#FFD700]/50">
              © {new Date().getFullYear()} श्री अखिल भारतीय सीरवी समाज ट्रस्ट, हरिद्वार.
            </p>
            <p className="text-xs text-[#FFD700]/40 mt-1">
              ॥ जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे ॥
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
