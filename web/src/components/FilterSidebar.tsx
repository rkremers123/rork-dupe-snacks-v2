import Link from "next/link";
import { ALLERGENS, SORT_OPTIONS } from "@/lib/catalog";

/**
 * Sidebar filter/sort panel. Uses a GET <form> (no client JS, SEO-friendly).
 * On mobile it collapses into a <details> toggle; on md+ it is always shown
 * (the summary is hidden and the body forced visible via CSS).
 */
export function FilterSidebar({
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
  const selected = new Set(current.allergenFree ?? []);
  const field =
    "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground outline-none focus:border-teal";

  return (
    <details
      open
      className="rounded-2xl border border-border bg-surface md:sticky md:top-28"
    >
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold md:hidden">
        Filters &amp; sort
      </summary>

      <form action={action} className="flex flex-col gap-5 p-4">
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            Sort by
          </span>
          <select name="sort" defaultValue={current.sort ?? "popular"} className={field}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            Max price
          </span>
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="1"
            defaultValue={current.maxPrice ?? ""}
            placeholder="Any"
            className={field}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            Dietary
          </span>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="certifiedOnly"
              value="1"
              defaultChecked={current.certifiedOnly}
              className="h-4 w-4 accent-teal"
            />
            Certified gluten-free only
          </label>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            Free from
          </span>
          {ALLERGENS.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="allergenFree"
                value={a.id}
                defaultChecked={selected.has(a.id)}
                className="h-4 w-4 accent-magenta"
              />
              {a.label}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button className="flex-1 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-background hover:brightness-110">
            Apply
          </button>
          <Link
            href={action}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground"
          >
            Clear
          </Link>
        </div>
      </form>
    </details>
  );
}
