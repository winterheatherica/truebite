export default function GoogleAdCard() {
  return (
    <div className="group relative flex aspect-square flex-col overflow-hidden rounded-2xl border-2 border-dashed border-rp-accent/40 bg-gradient-to-br from-rp-accent/5 to-rp-secondary/5 transition-all duration-200 hover:border-rp-accent/60">
      <div className="absolute right-3 top-3 z-10 rounded-full bg-rp-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
        Iklan
      </div>

      <div className="flex aspect-[10/7] shrink-0 items-center justify-center bg-gradient-to-br from-rp-accent/10 to-rp-secondary/10">
        <div className="text-center">
          <div className="text-3xl font-black text-rp-accent/30">
            Google Ads
          </div>
          <div className="mt-2 text-xs text-rp-muted">
            Slot iklan
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-rp-muted/20"></div>
          <div className="h-3 w-3/4 animate-pulse rounded bg-rp-muted/20"></div>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-3 max-[399px]:hidden min-[640px]:max-[832px]:hidden min-[1024px]:max-[1279px]:hidden">
          <div className="h-5 w-16 animate-pulse rounded-full bg-rp-accent/20"></div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-rp-accent/20"></div>
        </div>
      </div>
    </div>
  );
}
