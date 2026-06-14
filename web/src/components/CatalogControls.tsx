import { ALLERGENS, SORT_OPTIONS } from "@/lib/catalog";

/**
 * Server-rendered GET form for sorting/filtering. Submitting reloads the
 * page with new query params — works without client JS and is SEO-friendly.
 * `action` is the page the form posts back to (e.g. "/search").
 * Hidden fields preserve context like the search query or category.
 */
export function CatalogControls({
  action,
  current,
  hidden = {},
}: {
  action: string;
  current: {
    sort?: string;
    allergenFree?: string[];
    certifiedOnly?: boolean;
    maxPrice?: string;
  };
  hidden?: Record<string, string>;
}) {
  const selectedAllergens = new Set(current.allergenFree ?? []);
  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4"
    >
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <select
            name="sort"
            defaultValue={current.sort ?? "popular"}
            className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-foreground outline-none focus:border-teal"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Max price</span>
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="1"
            defaultValue={current.maxPrice ?? ""}
            placeholder="Any"
            className="w-24 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-foreground outline-none focus:border-teal"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="certifiedOnly"
            value="1"
            defaultChecked={current.certifiedOnly}
            className="h-4 w-4 accent-teal"
          />
          <span>Certified GF only</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">Free from:</span>
        {ALLERGENS.map((a) => (
          <label key={a.id} className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              name="allergenFree"
              value={a.id}
              defaultChecked={selectedAllergens.has(a.id)}
              className="h-4 w-4 accent-magenta"
            />
            <span>{a.label}</span>
          </label>
        ))}
        <button
          type="submit"
          className="ml-auto rounded-lg bg-teal px-4 py-1.5 text-sm font-semibold text-background hover:brightness-110"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
