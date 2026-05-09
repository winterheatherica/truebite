"use client";

import Link from "next/link";

import Portal from "./Portal";
import useLockBody from "./useLockBody";
import { navItems } from "./nav";

type MobileNavProps = {
  open: boolean;
  onRequestClose: () => void;
};

export default function MobileNav({
  open,
  onRequestClose,
}: MobileNavProps) {
  useLockBody(open);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-40 bg-rp-dark-3/40 backdrop-blur-sm lg:hidden">
        <div className="absolute inset-x-0 top-20 border-t border-rp-border bg-rp-background">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onRequestClose}
                className="
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-rp-foreground
                  transition-all
                  duration-200
                  hover:bg-rp-primary-pale
                  hover:text-rp-primary-dark
                "
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={onRequestClose}
              className="
                mt-3
                rounded-2xl
                bg-grad-pepper-gold
                px-4
                py-3
                text-center
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-rose-200/40
                transition-all
                duration-200
              "
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </Portal>
  );
}