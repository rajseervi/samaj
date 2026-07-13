"use client";

import { PosterFormData } from "@/types";
import { useRef, ChangeEvent } from "react";

interface PosterFormProps {
  data: PosterFormData;
  onChange: (data: PosterFormData) => void;
}

export default function PosterForm({ data, onChange }: PosterFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTextChange =
    (field: keyof PosterFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...data, [field]: e.target.value });
    };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...data, photoDataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange({ ...data, photoDataUrl: null });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-[#8B0000] mb-6">
        📝 पोस्टर विवरण भरें
      </h2>

      <div className="space-y-5">
        {/* ── Two-Column Row: Date + Day ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#5C3317] mb-1">
              दिनांक (Date)
            </label>
            <input
              type="date"
              value={data.date}
              onChange={handleTextChange("date")}
              className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5C3317] mb-1">
              वार (Day)
            </label>
            <input
              type="text"
              value={data.day}
              onChange={handleTextChange("day")}
              placeholder="रविवार, सोमवार..."
              className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] text-sm font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
            />
          </div>
        </div>

        {/* ── Two-Column Row: Sponsor Name + Village ── */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#5C3317] mb-1">
              भामाशाह का नाम
            </label>
            <input
              type="text"
              value={data.sponsorName}
              onChange={handleTextChange("sponsorName")}
              placeholder="श्री ... जी"
              className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] text-sm font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5C3317] mb-1">
              गाँव / शहर
            </label>
            <input
              type="text"
              value={data.village}
              onChange={handleTextChange("village")}
              placeholder="गाँव या शहर का नाम"
              className="w-full px-3 py-2.5 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] text-sm font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
            />
          </div>
        </div>

        {/* ── Photo Upload ── */}
        <div>
          <label className="block text-sm font-semibold text-[#5C3317] mb-1">
            फोटो अपलोड करें (Photo Upload)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full text-sm text-[#4A2800] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-[#FF9933] file:text-white file:font-bold hover:file:bg-[#E88920] transition cursor-pointer"
          />
          {data.photoDataUrl && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={data.photoDataUrl}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#DAA520]"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-sm text-red-600 font-semibold hover:text-red-800 transition"
              >
                ✕ हटाएं
              </button>
            </div>
          )}
        </div>

        {/* ── Custom Message (full width) ── */}
        <div>
          <label className="block text-sm font-semibold text-[#5C3317] mb-1">
            पोस्टर संदेश (Poster Message)
          </label>
          <textarea
            value={data.message}
            onChange={handleTextChange("message")}
            rows={5}
            placeholder="पोस्टर का मुख्य संदेश यहाँ लिखें..."
            className="w-full px-4 py-3 border-2 border-[#DAA520] rounded-xl bg-[#FFF8E7] text-[#4A2800] font-medium placeholder:text-[#C4A35A] focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition resize-y"
          />
        </div>
      </div>
    </div>
  );
}
