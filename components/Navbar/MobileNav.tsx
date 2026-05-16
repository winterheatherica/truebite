"use client";

import Link from "next/link";

import Portal from "./Portal";
import useLockBody from "./useLockBody";
import { navItems } from "./nav";
import { signOutAction } from "./actions";
import type { NavUser } from "./index";

type MobileNavProps = {
  open: boolean;
  onRequestClose: () => void;
  user: NavUser;
};

export default function MobileNav({
  open,
  onRequestClose,
  user,
}: MobileNavProps) {
  useLockBody(open);

  if (!open) return null;

  const initial = user?.name.charAt(0).toUpperCase() ?? "";

  return (
    <Portal>
      <div className="fixed inset-0 z-40 bg-rp-dark-3/40 backdrop-blur-sm lg:hidden">
        <div className="absolute inset-x-0 top-20 border-t border-rp-border bg-rp-background">
          <nav className="flex flex-col p-4">
            {user && (
              <div className="mb-2 flex items-center gap-3 rounded-2xl bg-rp-secondary-pale px-4 py-3">
                <span className="bg-grad-rose-bloom flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white shadow">
                  {initial}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-rp-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-rp-muted">@{user.username}</p>
                </div>
                {user.role === "admin" && (
                  <span className="bg-grad-pepper-gold rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                    Admin
                  </span>
                )}
              </div>
            )}

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

            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={onRequestClose}
                className="
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-rp-primary
                  hover:bg-rp-primary-pale
                "
              >
                Dashboard Admin
              </Link>
            )}

            {user ? (
              <form action={signOutAction} className="mt-3">
                <button
                  type="submit"
                  className="
                    w-full
                    rounded-2xl
                    border-2 border-rp-destructive/40
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-semibold
                    text-rp-destructive
                    transition-all
                    duration-200
                    hover:bg-rp-destructive/10
                  "
                >
                  Keluar
                </button>
              </form>
            ) : (
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
            )}
          </nav>
        </div>
      </div>
    </Portal>
  );
}
