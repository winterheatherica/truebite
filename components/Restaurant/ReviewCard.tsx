import type { Review } from "@/data/dummy";
import StarRating from "@/components/ui/StarRating";
import SentimentBadge from "@/components/ui/SentimentBadge";

type Props = { review: Review };

export default function ReviewCard({ review }: Props) {
  return (
    <div className="rounded-2xl border border-rp-border bg-rp-background p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-grad-rose-bloom text-xs font-bold text-white">
            {review.userName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-rp-foreground">
              {review.userName}
            </p>
            <p className="text-xs text-rp-muted">{review.createdAt}</p>
          </div>
        </div>
        <SentimentBadge sentiment={review.sentiment} />
      </div>

      <div className="mt-3">
        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-rp-foreground/80">
        {review.content}
      </p>
    </div>
  );
}
