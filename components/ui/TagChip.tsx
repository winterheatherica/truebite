type TagChipProps = {
  tag: { name: string; slug: string };
  active?: boolean;
  onClick?: () => void;
};

export default function TagChip({ tag, active, onClick }: TagChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-rp-primary text-white shadow-sm shadow-rp-primary/30"
          : "bg-grad-blush-mist text-rp-primary hover:bg-rp-primary-pale"
      }`}
    >
      {tag.name}
    </button>
  );
}
