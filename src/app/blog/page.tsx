"use client";

import Link from "next/link";
import { getBlogPosts, type BlogPost } from "@/data/blog-posts";
import { useRef } from "react";

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
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
  };
  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };
  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
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
    <Link href={`/blog/${post.slug}`} className="block">
      <div
        {...tilt}
        className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
        style={{ transition: "transform 0.1s ease-out, box-shadow 0.3s" }}
      >
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5] flex items-center justify-center">
          <img src={post.imageUrl} alt="" className="w-24 h-24 object-contain opacity-60" />
          <span className={`absolute top-3 right-3 text-xs font-bold text-white px-3 py-1 rounded-full ${catColors[post.category]}`}>
            {catLabels[post.category]}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs text-[#B8860B] font-semibold mb-2">
            {new Date(post.date).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h3 className="text-lg font-extrabold text-[#8B0000] leading-tight mb-2 group-hover:text-[#FF9933] transition-colors">
            {post.titleHi}
          </h3>
          <p className="text-sm text-[#5C3317] leading-relaxed line-clamp-3">
            {post.excerptHi}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#B8860B]">
            <span>✍️ {post.author}</span>
            <span className="text-[#DAA520]">|</span>
            <span className="text-[#FF9933] font-bold group-hover:underline">पूरा पढ़ें →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── MAIN PAGE ─── */
export default function BlogPage() {
  const posts = getBlogPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const catLabels: Record<string, string> = {
    seva: "सेवा",
    event: "आयोजन",
    announcement: "घोषणा",
    story: "कहानी",
  };
  const catIcons: Record<string, string> = {
    seva: "🫶",
    event: "🎉",
    announcement: "📢",
    story: "📖",
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* ── Header ── */}
      <header className="relative bg-gradient-to-r from-[#8B0000] to-[#5C0000]">
        <div className="h-1.5 bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700]" />
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#FFD700] font-bold hover:text-white transition"
          >
            <span className="text-lg">←</span> होम पेज
          </Link>
          <h1 className="text-lg font-extrabold text-[#FFD700]">📖 ब्लॉग</h1>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #FFCC66, #FFA500, #FF8C00, #FFB347)" }}>
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 8 + Math.random() * 10 + "px",
                height: 8 + Math.random() * 10 + "px",
                background: i % 2 === 0 ? "#FFD700" : "#FFF",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.3,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: Math.random() * 3 + "s",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <span className="text-5xl block mb-4">📖</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            हमारा ब्लॉग
          </h1>
          <p className="text-white/90 text-lg font-semibold">
            समाज की सेवा, आयोजन और गतिविधियों की हर खबर
          </p>
        </div>
      </section>

      {/* ── Categories Filter ── */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 bg-[#FFF8E7] border-2 border-[#DAA520] rounded-full text-sm font-bold text-[#8B0000] hover:bg-[#FFD700]/20 transition cursor-pointer"
              >
                {catIcons[cat] || "📌"} {catLabels[cat] || cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-[#8B0000] mb-2 text-center">
            सभी लेख
          </h2>
          <p className="text-[#B8860B] text-center font-semibold mb-10">
            कुल {posts.length} लेख
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gradient-to-r from-[#4A0000] to-[#2A0000] text-[#FFD700]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-lg">श्री सीरवी समाज ट्रस्ट</p>
              <p className="text-[#FFD700]/60 text-sm">हरिद्वार भवन की भोजनशाला</p>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">होम</Link>
              <Link href="/admin/login" className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition">पोस्टर</Link>
              <Link href="/blog" className="text-[#FFD700] text-sm font-bold">ब्लॉग</Link>
            </div>
          </div>
          <div className="border-t border-[#FFD700]/20 mt-6 pt-6 text-center">
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
