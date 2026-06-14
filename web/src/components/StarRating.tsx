export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number | null;
  reviewCount?: number | null;
  size?: "sm" | "lg";
}) {
  if (rating == null) return null;
  const full = Math.round(rating);
  const text = size === "lg" ? "text-base" : "text-sm";
  return (
    <div className={`flex items-center gap-1 ${text}`}>
      <span className="text-gold tracking-tight" aria-hidden>
        {"★".repeat(full)}
        <span className="text-border">{"★".repeat(5 - full)}</span>
      </span>
      <span className="text-muted">
        {rating.toFixed(1)}
        {reviewCount != null && reviewCount > 0 ? (
          <span className="ml-1">({reviewCount.toLocaleString()})</span>
        ) : null}
      </span>
    </div>
  );
}
