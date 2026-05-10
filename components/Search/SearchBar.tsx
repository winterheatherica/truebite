"use client";

import { useState, type FormEvent } from "react";

type Props = {
  initialQuery?: string;
  onSearch: (query: string) => void;
};

export default function SearchBar({ initialQuery = "", onSearch }: Props) {
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
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
        className="w-full rounded-2xl border border-rp-border bg-rp-background py-3.5 pl-12 pr-4 text-sm text-rp-foreground placeholder-rp-muted transition-all duration-200 focus:border-rp-primary/30 focus:outline-none focus:ring-2 focus:ring-rp-primary/10"
      />
    </form>
  );
}
