import type { PosterFormData } from "@/types";

/**
 * Captures the poster DOM element as a PNG Blob using html2canvas.
 * Returns the image Blob for sharing/downloading.
 */
export async function capturePosterAsBlob(
  element: HTMLElement
): Promise<{ blob: Blob; filename: string } | null> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFA500",
      logging: false,
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1.0)
    );

    if (!blob) return null;

    const today = new Date().toISOString().slice(0, 10);
    return { blob, filename: `bhamashah-poster-${today}.png` };
  } catch {
    return null;
  }
}

/**
 * Generates a Hindi caption for the poster image.
 */
export function generateCaption(data: PosterFormData): string {
  const lines: string[] = [
    "🪔 *श्री अखिल भारतीय सीरवी समाज ट्रस्ट*",
    "*हरिद्वार भवन की भोजनशाला*",
    "",
    `✦ *आज के भामाशाह* ✦`,
    `👤 श्री ${data.sponsorName || "................."} जी`,
    `📍 ${data.village || "................."}`,
    `📅 ${data.date || ""}${data.day ? ` (${data.day})` : ""}`,
    "",
    "🙏 *परम धर्म सेवा | अन्नदान महादान* 🙏",
    "॥ जगत जननी श्री आई माताजी की असीम कृपा सदैव बनी रहे ॥",
  ];
  return lines.join("\n");
}

/**
 * Shares the poster image using the Web Share API (works with WhatsApp on mobile).
 * On desktop/unsupported browsers, falls back to direct image download.
 */
export async function sharePosterImage(
  element: HTMLElement,
  data: PosterFormData
): Promise<void> {
  const result = await capturePosterAsBlob(element);
  if (!result) {
    alert("पोस्टर शेयर करने में त्रुटि। कृपया पुनः प्रयास करें।");
    return;
  }

  const file = new File([result.blob], result.filename, { type: "image/png" });
  const caption = generateCaption(data);

  // Try Web Share API first (works with WhatsApp on mobile)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "आज के भामाशाह",
        text: caption,
      });
      return;
    } catch (err) {
      // User cancelled or share failed — fall through to download
      if (err instanceof DOMException && err.name === "AbortError") {
        return; // User cancelled
      }
    }
  }

  // Fallback: download the image
  const url = URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.download = result.filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
