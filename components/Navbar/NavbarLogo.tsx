import Link from "next/link";

type NavbarLogoProps = { isScrolled: boolean };

export default function NavbarLogo({ isScrolled }: NavbarLogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div
        className="
          flex
          size-10
          items-center
          justify-center
          rounded-2xl
          bg-grad-pepper-gold
          text-sm
          font-black
          text-white
          shadow-lg
          shadow-rose-200/40
        "
      >
        TB
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`text-lg font-black ${
            isScrolled ? "text-rp-foreground" : "text-[#FDF8F5]"
          }`}
        >
          TrueBite
        </span>

        <span
          className={`text-xs ${
            isScrolled ? "text-rp-muted" : "text-[#FDF8F5]/70"
          }`}
        >
          Find your next bite
        </span>
      </div>
    </Link>
  );
}