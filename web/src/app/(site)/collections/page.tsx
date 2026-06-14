import Link from "next/link";
import type { Metadata } from "next";
import { getActiveCollections } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated gluten-free collections — holiday treats, game-day snacks, lunchbox favorites and more.",
};

export default async function CollectionsPage() {
  const collections = await getActiveCollections();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold">Collections</h1>
        <p className="mt-1 text-muted">
          Hand-picked gluten-free roundups for every occasion.
        </p>
      </header>

      {collections.length === 0 ? (
        <p className="text-muted">No collections yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="rounded-2xl border border-border bg-surface p-6 transition hover:border-magenta/60"
            >
              <div className="text-3xl">{c.emoji ?? "🧺"}</div>
              <div className="mt-2 text-lg font-bold">{c.name}</div>
              {c.description && (
                <p className="mt-1 text-sm text-muted">{c.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
