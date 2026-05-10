"use client";

import { useState } from "react";
import StarRating from "@/components/ui/StarRating";

type Props = {
  restaurantName: string;
  onSubmit: (review: { rating: number; content: string }) => void;
};

export default function ReviewForm({ restaurantName, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !content.trim()) return;
    onSubmit({ rating, content: content.trim() });
    setRating(0);
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-rp-border bg-rp-background p-5">
      <h3 className="text-base font-semibold text-rp-foreground">
        Tulis Review untuk {restaurantName}
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-rp-muted">Rating</label>
          <div className="mt-1">
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-rp-muted">Ulasan</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ceritakan pengalaman kamu..."
            rows={4}
            className="mt-1 w-full resize-none rounded-xl border border-rp-border bg-white px-4 py-3 text-sm text-rp-foreground placeholder-rp-muted transition-all duration-200 focus:border-rp-primary/30 focus:outline-none focus:ring-2 focus:ring-rp-primary/10"
          />
        </div>

        <button
          type="submit"
          disabled={rating === 0 || !content.trim()}
          className="w-full rounded-xl bg-grad-rose-bloom py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          Kirim Review
        </button>
      </div>
    </form>
  );
}
