"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { restaurants } from "@/data/dummy";
import RegionSelector from "@/components/Nearby/RegionSelector";
import NearbyList from "@/components/Nearby/NearbyList";

export default function NearbyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDistrict = searchParams.get("district") || "";

  const allDistricts = [...new Set(restaurants.map((r) => r.district))].sort();

  function handleDistrictChange(district: string) {
    const sp = new URLSearchParams();
    if (district) sp.set("district", district);
    router.push(`/nearby?${sp.toString()}`);
  }

  const filtered = useMemo(() => {
    if (!selectedDistrict) return restaurants;
    return restaurants.filter((r) => r.district === selectedDistrict);
  }, [selectedDistrict]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-rp-foreground lg:text-3xl">
          Warung di Sekitar
        </h1>
        <p className="mt-2 text-sm text-rp-muted">
          Temukan kuliner terdekat berdasarkan kecamatan
        </p>
      </div>

      <div className="mb-10 mt-8">
        <RegionSelector
          districts={allDistricts}
          selectedDistrict={selectedDistrict}
          onChange={handleDistrictChange}
        />
      </div>

      <NearbyList restaurants={filtered} district={selectedDistrict} />
    </div>
  );
}
