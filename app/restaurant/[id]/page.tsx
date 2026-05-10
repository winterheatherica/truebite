"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  getRestaurantById,
  getReviewsByRestaurantId,
  getAverageRating,
} from "@/data/dummy";
import type { Review } from "@/data/dummy";
import RestaurantDetail from "@/components/Restaurant/RestaurantDetail";
import ReviewList from "@/components/Restaurant/ReviewList";
import ReviewForm from "@/components/Restaurant/ReviewForm";

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const restaurant = getRestaurantById(id);
  const [reviews, setReviews] = useState<Review[]>(() =>
    getReviewsByRestaurantId(id),
  );

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-rp-foreground">
          Warung tidak ditemukan
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-xl bg-rp-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rp-primary-dark"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const restaurantId = restaurant.id;
  const avg = getAverageRating(restaurantId);

  function handleNewReview(data: { rating: number; content: string }) {
    const sentiments = [
      "positive",
      "positive",
      "positive",
      "neutral",
      "negative",
      "positive",
    ] as const;
    const randomSentiment =
      sentiments[Math.floor(Math.random() * sentiments.length)];

    const newReview: Review = {
      id: `rev${Date.now()}`,
      restaurantId,
      userName: "Kamu",
      rating: data.rating,
      content: data.content,
      sentiment: randomSentiment,
      sentimentScore:
        randomSentiment === "positive"
          ? 0.85 + Math.random() * 0.15
          : randomSentiment === "neutral"
            ? 0.45 + Math.random() * 0.15
            : 0.1 + Math.random() * 0.2,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setReviews((prev) => [newReview, ...prev]);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 lg:px-3 py-8 lg:py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-rp-muted transition-colors hover:text-rp-foreground"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <RestaurantDetail restaurant={restaurant} averageRating={avg} />

      <hr className="my-12 border-rp-border" />

      <section className="space-y-8">
        <h2 className="text-lg font-bold text-rp-foreground lg:text-xl">
          Review & Rating
        </h2>
        <ReviewForm
          restaurantName={restaurant.name}
          onSubmit={handleNewReview}
        />
        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}
