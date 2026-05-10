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

export default function ImageCarousel({ images, restaurantName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1480);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const nonAdImages = images.filter((img) => img?.alt !== "Iklan");
  const adImages = images.filter((img) => img?.alt === "Iklan");

  const getAlternatingImages = () => {
    if (isLargeScreen) {
      return {
        images: [
          images[currentIndex],
          images[(currentIndex + 1) % images.length],
          images[(currentIndex + 2) % images.length],
        ],
        total: images.length,
      };
    }

    if (adImages.length === 0) {
      return {
        images: [
          images[currentIndex],
          images[(currentIndex + 1) % images.length],
          images[(currentIndex + 2) % images.length],
        ],
        total: images.length,
      };
    }

    const result: Image[] = [];
    let imageIdx = 0;
    let adIdx = 0;

    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        result.push(adImages[adIdx++ % adImages.length]);
      } else {
        result.push(nonAdImages[imageIdx++ % nonAdImages.length]);
      }
    }

    return {
      images: [
        result[currentIndex % result.length],
        result[(currentIndex + 1) % result.length],
        result[(currentIndex + 2) % result.length],
      ],
      total: result.length,
    };
  };

  const { images: displayImages, total: totalImages } = getAlternatingImages();

  function handlePrev() {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {displayImages.map((img, idx) => {
          const isAd = img?.alt === "Iklan";
          return (
            <div
              key={`${currentIndex}-${idx}`}
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

      {/* Navigation controls below images */}
      {totalImages > 3 && (
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

          {/* Indicator dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalImages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? "w-6 bg-rp-primary"
                    : "w-2 bg-rp-muted/30 hover:bg-rp-muted/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
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
