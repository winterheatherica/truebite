export default function SideAd() {
  return (
    <div className="sticky top-24 h-[600px] w-[300px] overflow-hidden rounded-2xl border-2 border-dashed border-rp-accent/40 bg-gradient-to-br from-rp-accent/5 to-rp-secondary/5">
      <div className="absolute right-2 top-2 z-10 rounded-full bg-rp-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
        Iklan
      </div>
      
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-black text-rp-accent/30">
            Google Ads
          </div>
          <div className="mt-2 text-xs text-rp-muted">
            300 × 600
          </div>
        </div>
      </div>
    </div>
  );
}
