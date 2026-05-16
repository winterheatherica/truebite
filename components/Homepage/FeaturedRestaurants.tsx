import type { Restaurant } from "@/lib/types/restaurant";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import GoogleAdCard from "@/components/Restaurant/GoogleAdCard";
import { withAds } from "@/lib/utils/withAds";

type Props = { restaurants: Restaurant[] };

export default function FeaturedRestaurants({ restaurants }: Props) {
  const feed = withAds(restaurants);

  return (
    <section className="px-4 pb-16 pt-16 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-rp-foreground lg:text-2xl">
              Pilihan Terbaik
            </h2>
            <p className="mt-2 text-sm text-rp-muted">
              Warung favorit yang wajib kamu coba
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feed.map((cell) =>
            cell.kind === "item" ? (
              <RestaurantCard key={cell.value.id} restaurant={cell.value} />
            ) : (
              <GoogleAdCard key={cell.key} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
