"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SideAd from "@/components/Restaurant/SideAd";

const AD_HEIGHT = 600;
const FOOTER_MARGIN = 20;
const VERTICAL_OFFSET = 40;
const MIN_VIEWPORT_WIDTH = 1480;

export default function FloatingAds() {
  const pathname = usePathname();
  const [top, setTop] = useState<number | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const isRestaurantPage = pathname.startsWith("/restaurant/");

  useEffect(() => {
    const check = () => setIsLargeScreen(window.innerWidth >= MIN_VIEWPORT_WIDTH);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isRestaurantPage || !isLargeScreen) {
      setTop(null);
      return;
    }

    const footer = document.querySelector("footer");
    if (!footer) return;

    let rafId = 0;

    const compute = () => {
      const vh = window.innerHeight;
      const defaultTop = vh / 2 - AD_HEIGHT / 2 + VERTICAL_OFFSET;
      const footerTop = footer.getBoundingClientRect().top;
      const maxTop = footerTop - AD_HEIGHT - FOOTER_MARGIN;

      setTop(Math.min(defaultTop, maxTop));
    };

    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isRestaurantPage, isLargeScreen]);

  if (!isRestaurantPage || !isLargeScreen || top === null) return null;

  return (
    <div className="pointer-events-none">
      <div
        className="pointer-events-auto fixed left-2"
        style={{ top, zIndex: 10 }}
      >
        <SideAd />
      </div>
      <div
        className="pointer-events-auto fixed right-2"
        style={{ top, zIndex: 10 }}
      >
        <SideAd />
      </div>
    </div>
  );
}
