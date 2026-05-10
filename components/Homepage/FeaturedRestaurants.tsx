import type { Restaurant } from "@/data/dummy";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import GoogleAdCard from "@/components/Restaurant/GoogleAdCard";

type Props = { restaurants: Restaurant[] };

export default function FeaturedRestaurants({ restaurants }: Props) {
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
          {restaurants.slice(0, 2).map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
          <GoogleAdCard />
          {restaurants.slice(2).map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
