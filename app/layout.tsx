import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TrueBite — Discovery Kuliner UMKM Indonesia",
    template: "%s | TrueBite",
  },
  description:
    "TrueBite membantu kamu menemukan warung dan UMKM kuliner terbaik di sekitarmu. Rekomendasi pilihan, ulasan jujur yang dianalisis AI, dan menu favorit berikutnya — semua dalam satu tempat.",
  applicationName: "TrueBite",
  generator: "Next.js",
  keywords: [
    "kuliner Indonesia",
    "UMKM",
    "warung",
    "restoran lokal",
    "review makanan",
    "rekomendasi kuliner",
    "AI sentiment",
    "TrueBite",
  ],
  authors: [{ name: "TrueBite" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "TrueBite",
    title: "TrueBite — Discovery Kuliner UMKM Indonesia",
    description:
      "Temukan warung dan UMKM kuliner terbaik dengan ulasan jujur yang dianalisis AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueBite — Discovery Kuliner UMKM Indonesia",
    description:
      "Temukan warung dan UMKM kuliner terbaik dengan ulasan jujur yang dianalisis AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-rp-background text-rp-foreground">
        <div className="flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
