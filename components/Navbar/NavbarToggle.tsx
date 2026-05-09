"use client";

import { Menu, X } from "lucide-react";

type NavbarToggleProps = {
  open: boolean;
  onToggle: () => void;
  isScrolled: boolean;
};

export default function NavbarToggle({
  open,
  onToggle,
  isScrolled,
}: NavbarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex
        size-11
        items-center
        justify-center
        rounded-2xl
        border
        transition-all
        duration-200
        ${
          isScrolled
            ? "border-rp-border bg-rp-background text-rp-foreground hover:bg-rp-primary-pale hover:text-rp-primary-dark"
            : "border-[#FDF8F5]/30 bg-transparent text-[#FDF8F5] hover:bg-white/10 hover:text-white"
        }
      `}
      aria-label="Toggle Menu"
    >
      {open ? (
        <X size={20} />
      ) : (
        <Menu size={20} />
      )}
    </button>
  );
}