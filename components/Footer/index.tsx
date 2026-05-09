import GridContent from "./GridContent";
import BottomBar from "./BottomBar";

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(135deg,#0D0808_0%,#1C1410_100%)] text-rp-muted">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 lg:px-8">
        <GridContent />
        <BottomBar />
      </div>
    </footer>
  );
}
