"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getBlogPosts, type BlogPost } from "@/data/blog-posts";

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
        <span className="absolute top-2 right-2 text-xs font-bold text-white px-2 py-1 rounded-full ${catColors[post.category]}">
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

/* ─── Particle Field ─── */
function ParticleField() {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => { setHasMounted(true); }, []);

  if (!hasMounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => {
        const width = 6 + Math.random() * 8;
        const height = 6 + Math.random() * 8;
        const color = i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF9933" : "#8B0000";
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = 0.2 + Math.random() * 0.3;
        const duration = 4 + Math.random() * 6;
        const delay = Math.random() * 5;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: width + "px",
              height: height + "px",
              background: color,
              left: left + "%",
              top: top + "%",
              opacity,
              animation: `float ${duration}s ease-in-out infinite`,
              animationDelay: delay + "s",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── 3D Rotating Om ─── */
function RotatingOm() {
  return (
    <div className="relative w-40 h-40 mx-auto" style={{ perspective: "400px" }}>
      <div
        className="w-full h-full rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-2xl border-4 border-[#FFD700]"
        style={{ animation: "rotateOm 8s linear infinite", transformStyle: "preserve-3d" }}
      >
        <span className="text-6xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" style={{ animation: "counterRotate 8s linear infinite" }}>
          🕉️
        </span>
      </div>
      {/* Rotating ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFD700] opacity-40"
        style={{ animation: "rotateOm 5s linear infinite reverse" }}
      />
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
      {/* Controls */}
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

      {/* 3D Stage */}
      <div
        className="relative mx-auto"
        style={{ width: "100%", height: "420px", perspective: "1000px" }}
      >
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
            const scale = isFront ? 1.1 : 0.8;
            const opacity = isFront ? 1 : 0.55;
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
                  filter: isFront ? "none" : "blur(1px)",
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
                  <h4
                    className="text-base font-extrabold text-center leading-tight"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold mt-1 text-[#5C3317] opacity-80">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* Dot indicators */}
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

      {/* Selected Item Modal */}
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
            <h3
              className="text-2xl font-extrabold mb-2"
              style={{ color: GALLERY_ITEMS[selectedIndex].color }}
            >
              {GALLERY_ITEMS[selectedIndex].title}
            </h3>
            <p className="text-lg text-[#5C3317] font-semibold mb-6">
              {GALLERY_ITEMS[selectedIndex].subtitle}
            </p>
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

      {/* Animation keyframes */}
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

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  const blogPosts = getBlogPosts();

  return (
    <div className="min-h-screen bg-[#FFF8E7] overflow-x-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          33% { transform: translateY(-18px) scale(1.05); }
          66% { transform: translateY(8px) scale(0.95); }
        }
        @keyframes rotateOm {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes counterRotate {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(-360deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.6), 0 0 60px rgba(255,153,51,0.3); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background: "linear-gradient(135deg, #FFCC66, #FFA500, #FF8C00, #FFB347, #FFCC66, #FFA500)",
            backgroundSize: "300% 300%",
          }}
        />
        {/* Overlay pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' fill='%238B0000'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <ParticleField />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* 3D Rotating Om */}
          <div className="mb-8">
            <RotatingOm />
          </div>

          {/* Main Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-wide"
            style={{ textShadow: "2px 2px 0 #8B0000, 4px 4px 0 rgba(0,0,0,0.2)" }}
          >
            श्री अखिल भारतीय
            <br />
            सीरवी समाज ट्रस्ट
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-[#8B0000] mt-3 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
            हरिद्वार भवन की भोजनशाला
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded" />
            <span className="text-[#FFD700] text-2xl drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">✦</span>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent rounded" />
          </div>

          <p className="text-lg sm:text-xl text-white font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            परम धर्म सेवा • अन्नदान महादान
            <br />
            <span className="text-base opacity-90">
              जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/poster"
              className="px-8 py-4 bg-[#FF9933] hover:bg-[#E88920] text-white font-extrabold text-lg rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
            >
              📋 पोस्टर बनाएं
            </Link>
            <Link
              href="#blog"
              className="px-8 py-4 bg-white/90 backdrop-blur hover:bg-white text-[#8B0000] font-extrabold text-lg rounded-2xl shadow-xl border-2 border-[#FFD700] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              📖 ब्लॉग पढ़ें
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-16 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B0000] via-[#FFD700] to-[#8B0000]" />
        <RevealSection>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-12">
              ✨ हमारी सेवा का प्रभाव ✨
            </h2>
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
      <section className="py-16 bg-[#FFF8E7]">
        <RevealSection>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-6">
              🏛️ हमारे बारे में
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
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
      <section className="py-16 bg-gradient-to-b from-[#8B0000] to-[#5C0000] text-white">
        <RevealSection>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-[#FFD700] text-center mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              🪔 हमारी सेवाएं 🪔
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🍛", title: "भोजन सेवा", desc: "प्रतिदिन निःशुल्क भोजन का आयोजन" },
                { icon: "☕", title: "नाश्ता सेवा", desc: "सुबह के नाश्ते की व्यवस्था" },
                { icon: "📿", title: "धार्मिक आयोजन", desc: "पूजन, भजन एवं कथा" },
                { icon: "❤️", title: "सामुदायिक सेवा", desc: "जरूरतमंदों की सहायता" },
              ].map((s, i) => {
                const tilt = useTilt<HTMLDivElement>();
                return (
                  <div
                    key={i}
                    {...tilt}
                    className="bg-white/10 backdrop-blur rounded-2xl border border-[#FFD700]/40 p-6 text-center hover:bg-white/20 transition-all"
                    style={{ transition: "transform 0.1s ease-out, background 0.3s" }}
                  >
                    <span className="text-4xl block mb-3">{s.icon}</span>
                    <h3 className="text-lg font-extrabold text-[#FFD700] mb-2">{s.title}</h3>
                    <p className="text-white/80 text-sm">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── 3D GALLERY ── */}
      <section className="py-16 bg-[#FFF8E7] overflow-hidden">
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
      <section id="blog" className="py-16 bg-white">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-[#FFD700]" />
        <RevealSection>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-[#8B0000] text-center mb-4">
              📖 हमारा ब्लॉग
            </h2>
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
                href="/poster"
                className="px-8 py-4 bg-white text-[#8B0000] font-extrabold text-lg rounded-2xl shadow-xl hover:bg-[#FFF8E7] transition-all hover:scale-105"
              >
                📋 आज का पोस्टर बनाएं
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
                <Link href="/poster" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">पोस्टर जनरेटर</Link>
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
