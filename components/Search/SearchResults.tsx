import type { Restaurant } from "@/lib/types/restaurant";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import GoogleAdCard from "@/components/Restaurant/GoogleAdCard";
import { withAds } from "@/lib/utils/withAds";

type Props = {
  restaurants: Restaurant[];
  query: string;
};

export default function SearchResults({ restaurants, query }: Props) {
  if (restaurants.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-rp-foreground">
          Tidak ada hasil untuk "{query}"
        </p>
        <p className="mt-2 text-sm text-rp-muted">
          Coba kata kunci atau filter lain
        </p>
      </div>
    );
  }

  const sorted = [...restaurants].sort((a, b) => Number(b.featured) - Number(a.featured));
  const feed = withAds(sorted);

  return (
    <div>
      <p className="mb-6 text-sm text-rp-muted">
        {restaurants.length} hasil ditemukan
        {query && <> untuk "{query}"</>}
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
