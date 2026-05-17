import type { Restaurant } from "@/lib/types/restaurant";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import GoogleAdCard from "@/components/Restaurant/GoogleAdCard";
import { withAds } from "@/lib/utils/withAds";

type Props = {
  restaurants: Restaurant[];
  province: string;
  city: string;
  district: string;
};

function describeScope({ province, city, district }: Omit<Props, "restaurants">) {
  if (district) return `Kecamatan ${district}, ${city}`;
  if (city) return `${city}, ${province}`;
  if (province) return province;
  return "seluruh Indonesia";
}

export default function NearbyList({ restaurants, province, city, district }: Props) {
  const scope = describeScope({ province, city, district });

  if (restaurants.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-rp-foreground">
          Tidak ada warung di {scope}
        </p>
        <p className="mt-2 text-sm text-rp-muted">
          Coba pilih lokasi lain atau naik satu level di breadcrumb.
        </p>
      </div>
    );
  }

  const feed = withAds(restaurants);

  return (
    <div>
      <p className="mb-6 text-sm text-rp-muted">
        {restaurants.length} warung di {scope}
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
