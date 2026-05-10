type SentimentBadgeProps = {
  sentiment: "positive" | "neutral" | "negative";
};

const config = {
  positive: {
    label: "Positif",
    class: "bg-emerald-100 text-emerald-700",
  },
  neutral: {
    label: "Netral",
    class: "bg-rp-muted/20 text-rp-muted",
  },
  negative: {
    label: "Negatif",
    class: "bg-rp-destructive/10 text-rp-destructive",
  },
};

export default function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const c = config[sentiment];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c.class}`}
    >
      {c.label}
    </span>
  );
}
