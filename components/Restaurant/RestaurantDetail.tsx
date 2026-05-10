import type { Restaurant } from "@/data/dummy";
import StarRating from "@/components/ui/StarRating";
import ImageCarousel from "./ImageCarousel";

type Props = {
  restaurant: Restaurant;
  averageRating: number;
};

export default function RestaurantDetail({
  restaurant,
  averageRating,
}: Props) {
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;

  return (
    <div>
      <div className="space-y-8">
        {/* Title and Rating */}
        <div>
          <h1 className="text-2xl font-bold text-rp-foreground lg:text-3xl">
            {restaurant.name}
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={averageRating} size="md" />
            <span className="text-sm font-medium text-rp-muted">
              {averageRating}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-rp-foreground/70">
          {restaurant.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-grad-blush-mist px-3.5 py-1.5 text-xs font-medium text-rp-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Image Carousel */}
        {restaurant.images && restaurant.images.length > 0 ? (
          <ImageCarousel
            images={restaurant.images}
            restaurantName={restaurant.name}
          />
        ) : (
          <div className="aspect-[2/1] overflow-hidden rounded-2xl lg:aspect-[3/1]">
            <img
              src={restaurant.photoUrl}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Info Box */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-rp-border bg-rp-background p-5 lg:grid-cols-2">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-rp-muted">
                Jam Buka
              </span>
              <p className="mt-0.5 text-sm font-medium text-rp-foreground">
                {restaurant.openingHours}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-rp-muted">
                Alamat
              </span>
              <p className="mt-0.5 text-sm text-rp-foreground">
                {restaurant.address}
              </p>
              <p className="text-xs text-rp-muted">
                {restaurant.district}, {restaurant.city},{" "}
                {restaurant.province}
              </p>
            </div>
          </div>
          <div className="flex items-end">
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rp-foreground px-5 py-3 text-sm font-semibold text-[#FDF8F5] transition-all duration-200 hover:opacity-90"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Lihat di Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
