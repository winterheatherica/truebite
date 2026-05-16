"use client";

import { useState, useEffect } from "react";

type Image = {
  url: string;
  alt: string;
  title: string;
};

type Props = {
  images: Image[];
  restaurantName: string;
};

type ScreenSize = "tiny" | "narrow" | "wide";

export default function ImageCarousel({ images, restaurantName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState<ScreenSize>("narrow");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 400) setScreenSize("tiny");
      else if (w >= 1480) setScreenSize("wide");
      else setScreenSize("narrow");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nonAdImages = images.filter((img) => img?.alt !== "Iklan");
  const adImages = images.filter((img) => img?.alt === "Iklan");

  const sequence: Image[] = (() => {
    if (adImages.length === 0) return images;

    if (screenSize === "wide") {
      return [...nonAdImages.slice(0, 1), ...adImages, ...nonAdImages.slice(1)];
    }

    if (screenSize === "tiny") {
      const out: Image[] = [];
      for (let i = 0; i < nonAdImages.length; i += 2) {
        out.push(nonAdImages[i]);
        if (i + 1 < nonAdImages.length) out.push(nonAdImages[i + 1]);
        out.push(adImages[Math.floor(i / 2) % adImages.length]);
      }
      return out;
    }

    const out: Image[] = [];
    for (let i = 0; i < nonAdImages.length; i++) {
      out.push(nonAdImages[i]);
      out.push(adImages[i % adImages.length]);
    }
    return out;
  })();

  const windowSize = screenSize === "tiny" ? 1 : 3;
  const totalSlots = sequence.length;
  const maxIndex = Math.max(0, totalSlots - windowSize);
  const safeIndex = Math.min(currentIndex, maxIndex);
  const displayImages = sequence.slice(safeIndex, safeIndex + windowSize);

  function handlePrev() {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }

  const gridColsClass = screenSize === "tiny" ? "grid-cols-1" : "grid-cols-3";

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 lg:gap-4 ${gridColsClass}`}>
        {displayImages.map((img, idx) => {
          const isAd = img?.alt === "Iklan";
          return (
            <div
              key={`${safeIndex}-${idx}`}
              className="relative aspect-square overflow-hidden rounded-2xl"
            >
              {isAd && (
                <div className="absolute right-2 top-2 z-10 rounded-full bg-rp-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Iklan
                </div>
              )}
              <img
                src={img?.url}
                alt={img?.alt || `${restaurantName} foto ${idx + 1}`}
                title={img?.title || restaurantName}
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>

      {totalSlots > windowSize && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            className="flex size-9 items-center justify-center rounded-full bg-rp-foreground text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
            aria-label="Previous images"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === safeIndex
                    ? "w-6 bg-rp-primary"
                    : "w-2 bg-rp-muted/30 hover:bg-rp-muted/50"
                }`}
                aria-label={`Go to position ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex size-9 items-center justify-center rounded-full bg-rp-foreground text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
            aria-label="Next images"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
