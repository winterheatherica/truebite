import type { Restaurant } from "@/lib/types/restaurant";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import GoogleAdCard from "@/components/Restaurant/GoogleAdCard";
import { withAds } from "@/lib/utils/withAds";

type Props = {
  restaurants: Restaurant[];
  district: string;
};

export default function NearbyList({ restaurants, district }: Props) {
  if (restaurants.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-rp-foreground">
          Tidak ada warung di kecamatan ini
        </p>
        <p className="mt-2 text-sm text-rp-muted">
          Coba pilih kecamatan lain
        </p>
      </div>
    );
  }

  const feed = withAds(restaurants);

  return (
    <div>
      <p className="mb-6 text-sm text-rp-muted">
        {district
          ? `${restaurants.length} warung di Kecamatan ${district}`
          : `${restaurants.length} warung di sekitarmu`}
      </p>
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
  );
}
