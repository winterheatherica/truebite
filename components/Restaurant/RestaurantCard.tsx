import Link from "next/link";
import type { Restaurant } from "@/lib/types/restaurant";
import StarRating from "@/components/ui/StarRating";

type Props = { restaurant: Restaurant };

export default function RestaurantCard({ restaurant }: Props) {
  const avg = restaurant.averageRating;
  const isFeatured = restaurant.featured;

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className={`group relative block overflow-hidden rounded-2xl bg-rp-background transition-all duration-200 hover:-translate-y-0.5 ${
        isFeatured
          ? "border-2 border-rp-accent shadow-[0_4px_20px_rgba(245,197,24,0.18)] hover:shadow-[0_8px_30px_rgba(245,197,24,0.28)]"
          : "border border-rp-border hover:shadow-lg hover:shadow-rp-primary/5"
      }`}
    >
      {isFeatured && (
        <div className="bg-grad-pepper-gold absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
            <path d="M5 0l1.55 3.14 3.45.5-2.5 2.44.6 3.42L5 7.9 1.9 9.5l.6-3.42L0 3.64l3.45-.5L5 0z" />
          </svg>
          Featured
        </div>
      )}

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
              key={tag.slug}
              className="bg-grad-blush-mist rounded-full px-2.5 py-0.5 text-[11px] font-medium text-rp-primary"
            >
              {tag.name}
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
