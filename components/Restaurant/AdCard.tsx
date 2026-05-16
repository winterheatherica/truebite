import Link from "next/link";
import type { Restaurant } from "@/lib/types/restaurant";

type Props = { ad: Restaurant };

export default function AdCard({ ad }: Props) {
  return (
    <Link
      href={`/restaurant/${ad.slug}`}
      className="group relative block overflow-hidden rounded-2xl border-2 border-rp-accent bg-gradient-to-br from-rp-accent/5 to-rp-secondary/5 transition-all duration-200 hover:shadow-xl hover:shadow-rp-accent/20"
    >
      <div className="absolute right-3 top-3 z-10 rounded-full bg-rp-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
        Iklan
      </div>

      <div className="aspect-[3/2] overflow-hidden">
        <img
          src={ad.photoUrl}
          alt={ad.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-rp-foreground leading-tight">
            {ad.name}
          </h3>
          <span className="shrink-0 text-xs text-rp-muted">
            {ad.district}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-rp-foreground/70">
          {ad.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {ad.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.slug}
              className="rounded-full bg-rp-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-rp-accent"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
