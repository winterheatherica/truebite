import { Suspense } from "react";
import SearchPageContent from "./content";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-rp-muted">
          Memuat...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
