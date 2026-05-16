"use client";

import type { Tag } from "@/lib/types/restaurant";

type Props = {
  tags: Tag[];
  selected: string[];
  onToggle: (slug: string) => void;
};

export default function TagFilter({ tags, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      {tags.map((tag) => {
        const active = selected.includes(tag.slug);
        return (
          <button
            key={String(tag.id)}
            onClick={() => onToggle(tag.slug)}
            className={`rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
              active
                ? "bg-rp-primary text-white shadow-sm shadow-rp-primary/30"
                : "bg-grad-blush-mist text-rp-primary hover:bg-rp-primary-pale"
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
