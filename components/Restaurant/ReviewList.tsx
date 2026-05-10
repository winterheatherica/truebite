import type { Review } from "@/data/dummy";
import ReviewCard from "./ReviewCard";

type Props = {
  reviews: Review[];
};

export default function ReviewList({ reviews }: Props) {
  const positive = reviews.filter((r) => r.sentiment === "positive").length;
  const neutral = reviews.filter((r) => r.sentiment === "neutral").length;
  const negative = reviews.filter((r) => r.sentiment === "negative").length;
  const total = reviews.length;

  return (
    <div className="space-y-5">
      {total > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Positif {total > 0 ? Math.round((positive / total) * 100) : 0}%
          </span>
          <span className="rounded-full bg-rp-muted/20 px-3 py-1 text-xs font-semibold text-rp-muted">
            Netral {total > 0 ? Math.round((neutral / total) * 100) : 0}%
          </span>
          <span className="rounded-full bg-rp-destructive/10 px-3 py-1 text-xs font-semibold text-rp-destructive">
            Negatif {total > 0 ? Math.round((negative / total) * 100) : 0}%
          </span>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {total === 0 && (
        <p className="py-8 text-center text-sm text-rp-muted">
          Belum ada review. Jadilah yang pertama!
        </p>
      )}
    </div>
  );
}
