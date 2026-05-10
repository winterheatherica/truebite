import Link from "next/link";
import type { Restaurant } from "@/data/dummy";
import { getAverageRating } from "@/data/dummy";
import StarRating from "@/components/ui/StarRating";

type Props = { restaurant: Restaurant };

export default function RestaurantCard({ restaurant }: Props) {
  const avg = getAverageRating(restaurant.id);

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group block overflow-hidden rounded-2xl border border-rp-border bg-rp-background transition-all duration-200 hover:shadow-lg hover:shadow-rp-primary/5"
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={restaurant.photoUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-rp-foreground leading-tight">
            {restaurant.name}
          </h3>
          <span className="shrink-0 text-xs text-rp-muted">
            {restaurant.district}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={avg} size="sm" />
          <span className="text-xs font-medium text-rp-muted">{avg}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-grad-blush-mist px-2.5 py-0.5 text-[11px] font-medium text-rp-primary"
            >
              {tag}
            </span>
          ))}
          {restaurant.tags.length > 3 && (
            <span className="text-[11px] text-rp-muted">
              +{restaurant.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
