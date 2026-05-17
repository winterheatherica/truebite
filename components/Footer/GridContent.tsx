import AboutBlock from "./AboutBlock";
import QuickLinks from "./QuickLinks";
import SocialBlock from "./SocialBlock";
import type { FooterPicks } from "@/services/footer-service";

export default function GridContent({ picks }: { picks: FooterPicks }) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-3">
        <AboutBlock />
      </div>
      <div className="lg:col-span-7">
        <QuickLinks picks={picks} />
      </div>
      <div className="lg:col-span-2">
        <SocialBlock />
      </div>
    </div>
  );
}
