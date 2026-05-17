"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import type { Restaurant } from "@/lib/types/restaurant";
import LocationDrilldown, { type LocationTree } from "@/components/Nearby/LocationDrilldown";
import NearbyList from "@/components/Nearby/NearbyList";

type Props = {
  restaurants: Restaurant[];
};

export default function NearbyPageContent({ restaurants }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const province = searchParams.get("province") || "";
  const city = searchParams.get("city") || "";
  const district = searchParams.get("district") || "";

  const tree: LocationTree = useMemo(() => {
    const t: LocationTree = new Map();
    for (const r of restaurants) {
      if (!r.province) continue;
      if (!t.has(r.province)) t.set(r.province, new Map());
      const cityMap = t.get(r.province)!;
      if (!r.city) continue;
      if (!cityMap.has(r.city)) cityMap.set(r.city, new Map());
      const distMap = cityMap.get(r.city)!;
      if (!r.district) continue;
      distMap.set(r.district, (distMap.get(r.district) ?? 0) + 1);
    }
    return t;
  }, [restaurants]);

  function navigate(next: {
    province?: string;
    city?: string;
    district?: string;
  }) {
    const params = new URLSearchParams();
    if (next.province) {
      params.set("province", next.province);
      if (next.city) {
        params.set("city", next.city);
        if (next.district) params.set("district", next.district);
      }
    }
    const qs = params.toString();
    router.push(qs ? `/nearby?${qs}` : "/nearby");
  }

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (province && r.province !== province) return false;
      if (city && r.city !== city) return false;
      if (district && r.district !== district) return false;
      return true;
    });
  }, [restaurants, province, city, district]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-rp-foreground lg:text-3xl">
          Warung di Sekitar
        </h1>
        <p className="mt-2 text-sm text-rp-muted">
          Telusuri kuliner berdasarkan provinsi, kota/kabupaten, lalu kecamatan
        </p>
      </div>

      <div className="mb-10 mt-8">
        <LocationDrilldown
          tree={tree}
          province={province}
          city={city}
          district={district}
          onNavigate={navigate}
        />
      </div>

      <NearbyList
        restaurants={filtered}
        province={province}
        city={city}
        district={district}
      />
    </div>
  );
}
