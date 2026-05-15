import { Suspense } from "react";
import NearbyPageContent from "./content";

export default function NearbyPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-rp-muted">
          Memuat...
        </div>
      }
    >
      <NearbyPageContent />
    </Suspense>
  );
}
