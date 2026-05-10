"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center bg-grad-dark-spice px-4">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-3xl font-black leading-tight text-[#FDF8F5] lg:text-5xl">
          Temukan Kuliner UMKM
          <br />
          Terbaik di Sekitarmu
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#FDF8F5]/70 lg:text-base">
          Review jujur dari sesama pencari makan. Dukung UMKM lokal dengan
          menemukan hidden gems di kotamu.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-rp-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari makanan atau warung..."
              className="w-full rounded-2xl border border-[#FDF8F5]/20 bg-[#FDF8F5]/10 py-3.5 pl-12 pr-4 text-sm text-[#FDF8F5] placeholder-[#FDF8F5]/50 backdrop-blur-sm transition-all duration-200 focus:border-[#FDF8F5]/40 focus:bg-[#FDF8F5]/15 focus:outline-none"
            />
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[#FDF8F5]/60">
          <span>Populer:</span>
          {["Pedas", "Murah", "Bakso", "Kopi", "Nasi Goreng"].map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/search?tags=${tag.toLowerCase()}`)}
              className="rounded-full border border-[#FDF8F5]/20 px-3 py-1 text-[#FDF8F5]/80 transition-colors duration-200 hover:border-[#FDF8F5]/40 hover:text-[#FDF8F5]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
