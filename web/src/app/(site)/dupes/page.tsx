import Link from "next/link";
import type { Metadata } from "next";
import { getDupeGroups } from "@/lib/queries";
import { productImage } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gluten-Free Dupes — Find a Celiac-Safe Version of Any Snack",
  description:
    "Browse gluten-free dupes for popular snacks like Goldfish, Oreos, Cheez-Its and more. Pick the snack you're craving and we'll show you the celiac-safe version.",
};

export default async function DupesPage() {
  const groups = await getDupeGroups();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Shop by craving</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Pick the snack you miss and we&apos;ll show you the gluten-free dupe —
          the celiac-safe twin that tastes like the real thing.
        </p>
        <p className="mt-1 text-sm text-muted">{groups.length} dupes</p>
      </header>

      {groups.length === 0 ? (
        <p className="text-muted">No dupes yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {groups.map((g) => {
            const hero = g.products[0];
            const image = productImage(hero);
            return (
              <Link
                key={g.slug}
                href={`/dupe/${g.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg hover:shadow-black/30"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={`Gluten-free ${g.name} dupe`}
                      className="h-full w-full object-contain p-3 transition group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-2 to-surface">
                      <span className="text-4xl">{hero.category.emoji ?? "🍪"}</span>
                      <span className="text-sm font-semibold text-foreground/70">
                        {hero.brand}
                      </span>
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-magenta px-2.5 py-1 text-[11px] font-bold text-white shadow">
                    Craving {g.name}?
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3.5">
                  <div className="font-bold leading-snug group-hover:text-teal">
                    Gluten-Free {g.name}
                  </div>
                  <div className="mt-auto text-xs text-muted">
                    {g.products.length} dupe
                    {g.products.length > 1 ? "s" : ""} · top: {hero.brand}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
