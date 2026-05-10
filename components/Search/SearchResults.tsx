import type { Restaurant } from "@/data/dummy";
import RestaurantCard from "@/components/Restaurant/RestaurantCard";
import GoogleAdCard from "@/components/Restaurant/GoogleAdCard";

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

  return (
    <div>
      <p className="mb-6 text-sm text-rp-muted">
        {restaurants.length} hasil ditemukan
        {query && <> untuk "{query}"</>}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.slice(0, 2).map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
        {restaurants.length > 2 && <GoogleAdCard />}
        {restaurants.slice(2).map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
