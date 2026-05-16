import type { Review } from "@/lib/types/restaurant";
import ReviewCard from "./ReviewCard";

type Props = {
  reviews: Review[];
};

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-rp-muted">
        Belum ada review. Jadilah yang pertama!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
