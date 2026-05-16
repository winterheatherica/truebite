"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { signOutAction } from "./actions";

type UserMenuProps = {
  user: { name: string; username: string; role: "admin" | "user" };
  isScrolled: boolean;
};

export default function UserMenu({ user, isScrolled }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`
          flex items-center gap-2 rounded-full p-1 pr-3
          transition-all duration-200
          hover:bg-rp-primary-pale
          ${isScrolled ? "text-rp-foreground" : "text-rp-background"}
        `}
      >
        <span className="bg-grad-rose-bloom flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow">
          {initial}
        </span>
        <span className="hidden text-sm font-medium md:inline">{user.name}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className={`hidden transition-transform md:inline ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-rp-border bg-rp-background shadow-xl"
        >
          <div className="border-b border-rp-border px-4 py-3">
            <p className="text-sm font-semibold text-rp-foreground leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-rp-muted">@{user.username}</p>
            {user.role === "admin" && (
              <span className="bg-grad-pepper-gold mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                Admin
              </span>
            )}
          </div>

          <div className="p-1.5">
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-rp-foreground hover:bg-rp-primary-pale hover:text-rp-primary-dark"
              >
                Dashboard Admin
              </Link>
            )}
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rp-destructive hover:bg-rp-destructive/10"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
