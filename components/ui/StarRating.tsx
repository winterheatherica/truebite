type StarRatingProps = {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
};

const sizeMap = { sm: "size-3.5", md: "size-5", lg: "size-6" };

export default function StarRating({
  rating,
  size = "md",
  interactive,
  onChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;

        return (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={interactive ? () => onChange?.(star) : undefined}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} ${
              interactive ? "hover:scale-110" : ""
            } transition-transform`}
          >
            <svg
              className={`${sizeMap[size]} ${
                filled
                  ? "text-rp-accent"
                  : half
                    ? "text-rp-accent/50"
                    : "text-rp-muted/30"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {half ? (
                <defs>
                  <linearGradient id="halfStar">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              ) : null}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
