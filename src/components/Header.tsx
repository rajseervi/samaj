"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "होम", href: "/" },
  { label: "सेवाएं", href: "#services" },
  { label: "गैलरी", href: "#gallery" },
  { label: "ब्लॉग", href: "#blog" },
  { label: "संपर्क", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change (via link click)
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* ─── HEADER ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#8B0000]/95 backdrop-blur-md shadow-2xl py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* ─── Logo / Brand ─── */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Om icon */}
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-500 border-2 shadow-lg ${
                scrolled
                  ? "bg-[#FFD700] border-[#FFA500] shadow-[#FFD700]/30"
                  : "bg-white/15 border-white/30 shadow-black/20 group-hover:bg-[#FFD700] group-hover:border-[#FFA500]"
              }`}
            >
              🕉️
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p
                className={`text-sm sm:text-base font-extrabold leading-tight transition-colors duration-500 ${
                  scrolled ? "text-[#FFD700]" : "text-white"
                }`}
              >
                श्री सीरवी समाज
              </p>
              <p className="text-[10px] sm:text-xs text-white/60 leading-tight hidden sm:block">
                हरिद्वार भवन भोजनशाला
              </p>
            </div>
          </Link>

          {/* ─── Desktop Navigation ─── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={`relative px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 group/nav ${
                  scrolled
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
                {/* Animated underline */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#FFD700] rounded-full transition-all duration-300 group-hover/nav:w-[60%]" />
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/admin/login"
              className="ml-3 px-5 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-[#FFD700]/30"
            >
              📋 पोस्टर बनाएं
            </Link>
          </nav>

          {/* ─── Mobile Hamburger ─── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
            style={{
              background: scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.1)",
            }}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`block h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* ─── Scroll Progress Bar ─── */}
        <div className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#FFD700] via-[#FF9933] to-[#FFD700] transition-all duration-300"
          style={{ width: scrolled ? "100%" : "0%" }}
        />
      </header>

      {/* ─── Mobile Menu Overlay ─── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Menu panel */}
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-gradient-to-b from-[#8B0000] to-[#4A0000] shadow-2xl p-6 pt-20 transition-transform duration-400 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg hover:bg-white/20 transition"
            aria-label="Close menu"
          >
            ✕
          </button>

          {/* Links */}
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 font-bold text-base hover:bg-white/10 hover:text-[#FFD700] transition-all duration-300"
                style={{
                  animation: mobileOpen ? `slideInRight 0.4s ease-out ${i * 0.08}s both` : "none",
                }}
              >
                <span className="text-lg opacity-60">
                  {link.label === "होम" ? "🏠" : link.label === "सेवाएं" ? "🪔" : link.label === "गैलरी" ? "🖼️" : link.label === "ब्लॉग" ? "📖" : "📞"}
                </span>
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/admin/login"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FF9933] to-[#FF8C00] rounded-xl text-white font-extrabold text-sm hover:from-[#FF8C00] hover:to-[#E07800] transition-all duration-300 shadow-lg"
              >
                <span>📋</span>
                पोस्टर बनाएं
              </Link>
              <Link
                href="/contact"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-white/80 font-bold text-sm hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <span>📞</span>
                संपर्क करें
              </Link>
            </div>
          </nav>

          {/* Bottom decoration */}
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <p className="text-white/20 text-xs font-semibold">
              ॥ जय माताजी ॥
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
