import type { Review } from "@/lib/types/restaurant";
import StarRating from "@/components/ui/StarRating";

type Props = { review: Review };

export default function ReviewCard({ review }: Props) {
  return (
    <div className="rounded-2xl border border-rp-border bg-rp-background p-5">
      <div className="flex items-center gap-3">
        <div className="bg-grad-rose-bloom flex size-9 items-center justify-center rounded-full text-xs font-bold text-white">
          {review.userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-rp-foreground">
            {review.userName}
          </p>
          <p className="text-xs text-rp-muted">{review.createdAt}</p>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-rp-foreground/80">
        {review.content}
      </p>
    </div>
  );
}
