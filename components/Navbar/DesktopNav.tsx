import Link from "next/link";

import { navItems } from "./nav";
import UserMenu from "./UserMenu";
import type { NavUser } from "./index";

type DesktopNavProps = { isScrolled: boolean; user: NavUser };

export default function DesktopNav({ isScrolled, user }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            rounded-full
            px-4
            py-2
            text-sm
            font-medium
            transition-all
            duration-200
            hover:bg-rp-primary-pale
            hover:text-rp-primary-dark
            ${isScrolled ? "text-rp-foreground" : "text-rp-background"}
          `}
        >
          {item.label}
        </Link>
      ))}

      {user ? (
        <UserMenu user={user} isScrolled={isScrolled} />
      ) : (
        <Link
          href="/login"
          className="
            rounded-full
            bg-grad-pepper-gold
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-rose-200/40
            transition-all
            duration-200
            hover:scale-[1.03]
            hover:shadow-xl
          "
        >
          Login
        </Link>
      )}
    </nav>
  );
}
