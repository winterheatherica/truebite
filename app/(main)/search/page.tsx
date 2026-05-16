import { Suspense } from "react";
import { getAllRestaurants } from "@/services/restaurant-service";
import { getAllTags } from "@/services/tag-service";
import SearchPageContent from "./content";

export default async function SearchPage() {
  const [restaurants, tags] = await Promise.all([
    getAllRestaurants(),
    getAllTags(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-rp-muted">
          Memuat...
        </div>
      }
    >
      <SearchPageContent restaurants={restaurants} tags={tags} />
    </Suspense>
  );
}
