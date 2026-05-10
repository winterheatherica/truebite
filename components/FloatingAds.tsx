"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SideAd from "@/components/Restaurant/SideAd";

export default function FloatingAds() {
  const pathname = usePathname();
  const [adPosition, setAdPosition] = useState<"fixed" | "absolute">("fixed");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  const isRestaurantPage = pathname.startsWith("/restaurant/");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1480);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isRestaurantPage || !isLargeScreen) return;

    footerRef.current = document.querySelector("footer");

    const handleScroll = () => {
      if (!footerRef.current) return;

      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const buffer = 50;

      if (footerRect.top < windowHeight - buffer) {
        setAdPosition("absolute");
      } else {
        setAdPosition("fixed");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isRestaurantPage, isLargeScreen]);

  if (!isRestaurantPage || !isLargeScreen) return null;

  return (
    <div className="pointer-events-none">
      <div
        className={`pointer-events-auto transition-all duration-300 ease-out ${
          adPosition === "fixed"
            ? "fixed left-2 top-[calc(50vh+40px)] -translate-y-1/2"
            : "fixed left-2 bottom-[var(--footer-height,400px)]"
        }`}
        style={{ zIndex: 10 }}
      >
        <SideAd />
      </div>
      <div
        className={`pointer-events-auto transition-all duration-300 ease-out ${
          adPosition === "fixed"
            ? "fixed right-2 top-[calc(50vh+40px)] -translate-y-1/2"
            : "fixed right-2 bottom-[var(--footer-height,400px)]"
        }`}
        style={{ zIndex: 10 }}
      >
        <SideAd />
      </div>
    </div>
  );
}
