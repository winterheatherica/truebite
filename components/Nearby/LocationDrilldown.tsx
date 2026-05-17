"use client";

import { useMemo } from "react";

export type LocationTree = Map<string, Map<string, Map<string, number>>>;

type NavigateArgs = {
  province?: string;
  city?: string;
  district?: string;
};

type Props = {
  tree: LocationTree;
  province: string;
  city: string;
  district: string;
  onNavigate: (next: NavigateArgs) => void;
};

function pillClass(active: boolean) {
  return `rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
    active
      ? "bg-rp-primary text-white shadow-sm"
      : "bg-grad-blush-mist text-rp-primary hover:bg-rp-primary-pale"
  }`;
}

export default function LocationDrilldown({
  tree,
  province,
  city,
  district,
  onNavigate,
}: Props) {
  const level: "province" | "city" | "district" = useMemo(() => {
    if (province && city) return "district";
    if (province) return "city";
    return "province";
  }, [province, city]);

  const provinces = useMemo(
    () => Array.from(tree.keys()).sort((a, b) => a.localeCompare(b, "id")),
    [tree],
  );

  const cities = useMemo(() => {
    if (!province) return [];
    const m = tree.get(province);
    if (!m) return [];
    return Array.from(m.keys()).sort((a, b) => a.localeCompare(b, "id"));
  }, [tree, province]);

  const districts = useMemo(() => {
    if (!province || !city) return [];
    const m = tree.get(province)?.get(city);
    if (!m) return [];
    return Array.from(m.entries())
      .sort(([a], [b]) => a.localeCompare(b, "id"))
      .map(([name, count]) => ({ name, count }));
  }, [tree, province, city]);

  const heading =
    level === "province"
      ? "Pilih Provinsi"
      : level === "city"
        ? `Kota / Kabupaten di ${province}`
        : `Kecamatan di ${city}`;

  const emptyMessage =
    level === "city"
      ? "Belum ada data kota/kabupaten di provinsi ini."
      : level === "district"
        ? "Belum ada data kecamatan di kota/kabupaten ini."
        : "Belum ada data lokasi.";

  return (
    <div className="space-y-5">
      <nav
        aria-label="Breadcrumb lokasi"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
      >
        <button
          type="button"
          onClick={() => onNavigate({})}
          className={`font-medium transition-colors ${
            !province
              ? "text-rp-primary"
              : "text-rp-muted hover:text-rp-primary"
          }`}
        >
          Indonesia
        </button>

        {province && (
          <>
            <span className="text-rp-muted/60">›</span>
            <button
              type="button"
              onClick={() => onNavigate({ province })}
              className={`font-medium transition-colors ${
                !city
                  ? "text-rp-primary"
                  : "text-rp-muted hover:text-rp-primary"
              }`}
            >
              {province}
            </button>
          </>
        )}

        {city && (
          <>
            <span className="text-rp-muted/60">›</span>
            <button
              type="button"
              onClick={() => onNavigate({ province, city })}
              className={`font-medium transition-colors ${
                !district
                  ? "text-rp-primary"
                  : "text-rp-muted hover:text-rp-primary"
              }`}
            >
              {city}
            </button>
          </>
        )}

        {district && (
          <>
            <span className="text-rp-muted/60">›</span>
            <span className="font-medium text-rp-primary">{district}</span>
          </>
        )}
      </nav>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-rp-foreground">
            {heading}
          </h2>
          {(province || city || district) && (
            <button
              type="button"
              onClick={() => onNavigate({})}
              className="text-xs font-medium text-rp-muted underline-offset-2 hover:text-rp-primary hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {level === "province" && (
          <PillGroup
            items={provinces.map((name) => ({ name }))}
            onClick={(name) => onNavigate({ province: name })}
            activeName={province}
            emptyMessage={emptyMessage}
          />
        )}

        {level === "city" && (
          <PillGroup
            items={cities.map((name) => ({ name }))}
            onClick={(name) => onNavigate({ province, city: name })}
            activeName={city}
            emptyMessage={emptyMessage}
          />
        )}

        {level === "district" && (
          <PillGroup
            items={districts}
            onClick={(name) => onNavigate({ province, city, district: name })}
            activeName={district}
            emptyMessage={emptyMessage}
          />
        )}
      </div>
    </div>
  );
}

function PillGroup({
  items,
  onClick,
  activeName,
  emptyMessage,
}: {
  items: { name: string; count?: number }[];
  onClick: (name: string) => void;
  activeName: string;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-rp-muted">{emptyMessage}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={() => onClick(item.name)}
          className={pillClass(activeName === item.name)}
        >
          {item.name}
          {typeof item.count === "number" && (
            <span className="ml-1.5 opacity-70">({item.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
