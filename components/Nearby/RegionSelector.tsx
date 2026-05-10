"use client";

type Props = {
  districts: string[];
  selectedDistrict: string;
  onChange: (district: string) => void;
};

export default function RegionSelector({
  districts,
  selectedDistrict,
  onChange,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-rp-foreground">
        Kecamatan
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange("")}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
            !selectedDistrict
              ? "bg-rp-primary text-white"
              : "bg-grad-blush-mist text-rp-primary hover:bg-rp-primary-pale"
          }`}
        >
          Semua
        </button>
        {districts.map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
              selectedDistrict === d
                ? "bg-rp-primary text-white"
                : "bg-grad-blush-mist text-rp-primary hover:bg-rp-primary-pale"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
