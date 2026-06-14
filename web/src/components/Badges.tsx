import { allergenLabels } from "@/lib/catalog";

export function CertifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
      ✓ Gluten-Free Certified
    </span>
  );
}

export function AllergenBadges({ allergens }: { allergens: string }) {
  const labels = allergenLabels(allergens);
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full bg-danger/15 px-2.5 py-1 text-xs font-medium text-danger"
        >
          Contains {label}
        </span>
      ))}
    </div>
  );
}

export function DupeBadge({ dupeOf }: { dupeOf: string | null }) {
  if (!dupeOf) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal/15 px-2.5 py-1 text-xs font-semibold text-teal">
      Dupe for {dupeOf}
    </span>
  );
}
