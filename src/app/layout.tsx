import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "बैनर/पोस्टर जनरेटर - श्री अखिल भारतीय सीरवी समाज ट्रस्ट हरिद्वार भवन की भोजनशाला हरिद्वार",
  description:
    "श्री अखिल भारतीय सीरवी समाज ट्रस्ट हरिद्वार भवन की भोजनशाला, भोजन शाला हरिद्वार के लिए भामाशाह बैनर और पोस्टर जनरेट करें। आसानी से फोटो और विवरण भरकर सुंदर पोस्टर डाउनलोड करें।",
  keywords: ["सीरवी समाज", "हरिद्वार", "भामाशाह", "पोस्टर जनरेटर", "बैनर", "ट्रस्ट", "भोजन शाला"],
  openGraph: {
    title: "बैनर/पोस्टर जनरेटर - सीरवी समाज ट्रस्ट हरिद्वार",
    description: "भामाशाह बैनर और पोस्टर जनरेट करें",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
