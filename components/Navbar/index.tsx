"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import NavbarLogo from "./NavbarLogo";
import NavbarToggle from "./NavbarToggle";
import Portal from "./Portal";
import useScrolled from "./useScrolled";

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled(0);

  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname]);

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 ${
        scrolled
          ? "border-b border-rp-border bg-rp-background shadow-[0_1px_12px_rgba(28,20,16,0.08)]"
          : "border-b border-transparent bg-grad-dark-spice"
      }`}
      style={{
        transition: "background 0.3s ease, box-shadow 0.2s ease",
      }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
        <NavbarLogo isScrolled={scrolled} />

        <DesktopNav isScrolled={scrolled} />

        <div className="lg:hidden">
          <NavbarToggle
            open={openMobile}
            onToggle={() => setOpenMobile((s) => !s)}
            isScrolled={scrolled}
          />
        </div>
      </div>

      <Portal>
        <MobileNav
          open={openMobile}
          onRequestClose={() => setOpenMobile(false)}
        />
      </Portal>
    </header>
  );
}