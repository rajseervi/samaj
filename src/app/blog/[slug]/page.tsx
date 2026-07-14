"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getRelatedPosts, getBlogPosts, type BlogPost } from "@/data/blog-posts";
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

/* ─── Small Blog Card ─── */
function SmallBlogCard({ post }: { post: BlogPost }) {
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
        className="bg-white rounded-xl shadow-md border-2 border-[#DAA520] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        style={{ transition: "transform 0.1s ease-out, box-shadow 0.3s" }}
      >
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#FFF8E7] to-[#FFE4B5] flex items-center justify-center">
          <img src={post.imageUrl} alt="" className="w-16 h-16 object-contain opacity-50" />
          <span className={`absolute top-2 right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${catColors[post.category]}`}>
            {catLabels[post.category]}
          </span>
        </div>
        <div className="p-3">
          <p className="text-[10px] text-[#B8860B] font-semibold mb-1">
            {new Date(post.date).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <h4 className="text-sm font-extrabold text-[#8B0000] leading-tight mb-1 group-hover:text-[#FF9933] transition-colors line-clamp-2">
            {post.titleHi}
          </h4>
          <p className="text-xs text-[#5C3317] line-clamp-2">{post.excerptHi}</p>
        </div>
      </div>
    </Link>
  );
}

/* ─── Share Buttons ─── */
function ShareButtons({ post }: { post: BlogPost }) {
  if (typeof window === "undefined") return null;
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(post.titleHi);

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <a
        href={`https://wa.me/?text=${title}%0A${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition flex items-center gap-2"
      >
        <span>💬</span> WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>📘</span> Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${title}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded-xl hover:bg-sky-600 transition flex items-center gap-2"
      >
        <span>🐦</span> Twitter
      </a>
    </div>
  );
}

/* ─── NotFound ─── */
function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FFF8E7] px-4">
      <span className="text-7xl mb-6">😕</span>
      <h1 className="text-2xl font-extrabold text-[#8B0000] mb-2">लेख नहीं मिला</h1>
      <p className="text-[#5C3317] mb-6 text-center">
        यह ब्लॉग पोस्ट उपलब्ध नहीं है या हटा दी गई है।
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 border-2 border-[#DAA520] text-[#8B0000] font-bold rounded-xl hover:bg-[#FFF3D6] transition"
        >
          ← वापस जाएं
        </button>
        <Link
          href="/blog"
          className="px-6 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl hover:bg-[#E88920] transition"
        >
          सभी लेख देखें
        </Link>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = getBlogPostBySlug(slug);
  const allPosts = getBlogPosts();
  const relatedPosts = getRelatedPosts(slug, 3);

  const catLabels: Record<string, string> = {
    seva: "सेवा",
    event: "आयोजन",
    announcement: "घोषणा",
    story: "कहानी",
  };
  const catColors: Record<string, string> = {
    seva: "bg-green-600",
    event: "bg-[#FF9933]",
    announcement: "bg-blue-600",
    story: "bg-purple-600",
  };
  const catBgColors: Record<string, string> = {
    seva: "bg-green-50 text-green-800 border-green-300",
    event: "bg-orange-50 text-orange-800 border-orange-300",
    announcement: "bg-blue-50 text-blue-800 border-blue-300",
    story: "bg-purple-50 text-purple-800 border-purple-300",
  };

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* ── Header ── */}
      <header className="relative bg-gradient-to-r from-[#8B0000] to-[#5C0000]">
        <div className="h-1.5 bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700]" />
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[#FFD700] font-bold hover:text-white transition"
          >
            <span className="text-lg">←</span> सभी लेख
          </Link>
          <Link href="/" className="text-[#FFD700]/70 hover:text-white text-sm transition">🏠 होम</Link>
        </div>
      </header>

      {/* ── Article Header ── */}
      <section className="relative py-16 overflow-hidden animate-fade-slide-up" style={{ background: "linear-gradient(135deg, #FFCC66, #FFA500, #FF8C00, #FFB347)" }}>
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6 + Math.random() * 8 + "px",
                height: 6 + Math.random() * 8 + "px",
                background: "#FFD700",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.25,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: Math.random() * 3 + "s",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4 ${catColors[post.category]}`}>
            {catLabels[post.category]}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] leading-tight">
            {post.titleHi}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
            <span>✍️ {post.author}</span>
            <span>•</span>
            <span>
              📅 {new Date(post.date).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Article Content ── */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Featured Image */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#DAA520] p-8 mb-10 flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt={post.titleHi}
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-extrabold text-[#8B0000] mb-4 border-b-2 border-[#FFD700] pb-2 inline-block">
            📝 {post.title}
          </h2>

          <p className="text-lg text-[#5C3317] leading-relaxed mb-6 whitespace-pre-line">
            {post.excerptHi}
          </p>

          {/* Simulated full content */}
          <div className="bg-[#FFF3D6] border-2 border-[#FFD700] rounded-2xl p-6 my-8">
            <h3 className="text-lg font-extrabold text-[#8B0000] mb-3">📌 मुख्य बातें</h3>
            <ul className="space-y-2 text-[#5C3317]">
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] mt-1">🪔</span>
                <span>यह आयोजन श्री अखिल भारतीय सीरवी समाज ट्रस्ट, हरिद्वार द्वारा किया गया।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] mt-1">🙏</span>
                <span>सभी भामाशाहों और समाज बंधुओं का विशेष सहयोग रहा।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] mt-1">🍛</span>
                <span>हरिद्वार भवन की भोजनशाला में भोजन सेवा का आयोजन।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9933] mt-1">✨</span>
                <span>जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे।</span>
              </li>
            </ul>
          </div>

          <p className="text-[#5C3317] leading-relaxed mb-4">
            श्री अखिल भारतीय सीरवी समाज ट्रस्ट द्वारा संचालित हरिद्वार भवन की भोजनशाला निरंतर समाज सेवा के कार्यों में अग्रणी रही है।
            प्रतिदिन सैकड़ों श्रद्धालुओं को निःशुल्क भोजन कराया जाता है। यह सेवा समाज के दानी भामाशाहों के सहयोग से ही संभव हो पाती है।
          </p>

          <p className="text-[#5C3317] leading-relaxed mb-4">
            "परम धर्म सेवा" और "अन्नदान महादान" के आदर्शों पर चलते हुए यह ट्रस्ट समाज के हर वर्ग की सेवा के लिए
            प्रतिबद्ध है। जगत जननी श्री आई माताजी की कृपा से यह सेवा कार्य निरंतर आगे बढ़ रहा है।
          </p>

          <div className="bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white p-6 rounded-2xl my-8 text-center">
            <p className="text-xl font-extrabold text-[#FFD700] mb-2">🪔 परम धर्म सेवा • अन्नदान महादान 🪔</p>
            <p className="text-white/80">जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे</p>
          </div>
        </div>

        {/* Share Section */}
        <div className="border-t-2 border-[#FFD700]/40 pt-8 mt-8">
          <h3 className="text-lg font-extrabold text-[#8B0000] text-center mb-4">📤 इस लेख को शेयर करें</h3>
          <ShareButtons post={post} />
        </div>
      </article>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="h-1 bg-gradient-to-r from-[#FFD700] via-[#8B0000] to-[#FFD700] mb-12" />
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-extrabold text-[#8B0000] text-center mb-2">
              🔗 संबंधित लेख
            </h2>
            <p className="text-[#B8860B] text-center font-semibold mb-10">
              ऐसे ही और लेख पढ़ें
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <SmallBlogCard key={p.slug} post={p} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-block px-8 py-3 bg-[#FF9933] text-white font-extrabold rounded-xl shadow-lg hover:bg-[#E88920] transition"
              >
                सभी लेख पढ़ें →
              </Link>
            </div>
          </div>
        </section>
      )}

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
