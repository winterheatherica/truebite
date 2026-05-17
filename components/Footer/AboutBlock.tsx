import Link from "next/link";

export default function AboutBlock() {
  return (
    <div className="space-y-4">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-grad-rose-bloom text-sm font-black text-white">
          TB
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black text-rp-background">TrueBite</span>
          <span className="text-xs text-rp-muted">Find your next bite</span>
        </div>
      </Link>
      <p className="text-sm leading-relaxed text-rp-muted">
        TrueBite membantu kamu menemukan tempat makan terbaik di sekitarmu.
        Rekomendasi pilihan, ulasan jujur, dan menu favorit berikutnya &mdash;
        semua dalam satu tempat.
      </p>
    </div>
  );
}
