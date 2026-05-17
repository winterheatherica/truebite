import { Suspense } from "react";
import { getAllRestaurants } from "@/services/restaurant-service";
import NearbyPageContent from "./content";

export default async function NearbyPage() {
  const restaurants = await getAllRestaurants();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-rp-muted">
          Memuat...
        </div>
      }
    >
      <NearbyPageContent restaurants={restaurants} />
    </Suspense>
  );
}
