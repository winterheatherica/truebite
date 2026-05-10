import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAds from "@/components/FloatingAds";

export const metadata: Metadata = {
  title: {
    default: "TrueBite",
    template: "%s | TrueBite",
  },
  description: "Platform discovery kuliner UMKM berbasis AI",
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
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
          
          <FloatingAds />
        </div>
      </body>
    </html>
  );
}
