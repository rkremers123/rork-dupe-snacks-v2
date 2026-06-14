import { amazonAffiliateUrl } from "@/lib/affiliate";

export function BuyButton({
  asin,
  amazonUrl,
  className = "",
  size = "md",
  children,
}: {
  asin?: string | null;
  amazonUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}) {
  const href = amazonAffiliateUrl({ asin, amazonUrl });
  const pad =
    size === "lg"
      ? "px-6 py-3.5 text-base"
      : size === "sm"
        ? "px-3 py-1.5 text-xs"
        : "px-4 py-2.5 text-sm";
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-magenta font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] ${pad} ${className}`}
    >
      {children ?? "Buy on Amazon"}
    </a>
  );
}
