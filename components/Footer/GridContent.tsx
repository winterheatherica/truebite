import AboutBlock from "./AboutBlock";
import QuickLinks from "./QuickLinks";
import SocialBlock from "./SocialBlock";

export default function GridContent() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
      <AboutBlock />
      <QuickLinks />
      <SocialBlock />
    </div>
  );
}
