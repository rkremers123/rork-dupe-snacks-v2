import Link from "next/link";
import {
  getCategoriesWithProducts,
  getFeaturedProducts,
  getActiveCollections,
  getDupeGroups,
} from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { productImage } from "@/lib/affiliate";

// Catalog is DB-backed and admin-editable; render per request so changes
// appear immediately and builds don't require a database connection.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categories, collections, dupeGroups] = await Promise.all([
    getFeaturedProducts(8),
    getCategoriesWithProducts(8),
    getActiveCollections(),
    getDupeGroups(),
  ]);
  const cravings = dupeGroups.slice(0, 12);

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2 px-6 py-12 text-center md:px-12 md:py-16">
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
          Love a snack but can&apos;t eat gluten?{" "}
          <span className="text-teal">We found the dupe.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted md:text-lg">
          DupeSnacks matches the snacks you crave with their gluten-free
          twins — Goldfish, Oreos, Cheez-Its and more — all celiac-safe and
          one tap from your Amazon cart.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dupes"
            className="rounded-xl bg-magenta px-5 py-3 font-semibold text-white hover:brightness-110"
          >
            Browse the dupes
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-teal px-5 py-3 font-semibold text-teal hover:bg-teal/10"
          >
            Shop all gluten-free
          </Link>
        </div>
      </section>

      {/* Trust band */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: "🔍", title: "Vetted dupes", text: "Real gluten-free swaps for the snacks you miss." },
          { icon: "🎯", title: "Exact links", text: "Every Buy button goes to the precise product — no wrong items." },
          { icon: "🛒", title: "One-tap buy", text: "Straight to your Amazon cart in a click." },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <div className="font-semibold">{f.title}</div>
              <div className="text-sm text-muted">{f.text}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Shop by craving */}
      {cravings.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-xl font-bold">🍿 Shop by craving</h2>
            <Link href="/dupes" className="text-sm font-semibold text-teal hover:underline">
              See all →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {cravings.map((g) => {
              const image = productImage(g.products[0]);
              return (
                <Link
                  key={g.slug}
                  href={`/dupe/${g.slug}`}
                  className="group flex w-[150px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-1 hover:border-teal/50"
                >
                  <div className="aspect-square overflow-hidden bg-white">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={`Gluten-free ${g.name}`}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-2 to-surface text-4xl">
                        {g.products[0].category.emoji ?? "🍪"}
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 text-center text-sm font-semibold leading-tight group-hover:text-teal">
                    {g.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <Section title="⭐ Featured dupes" href="/dupes">
          {featured.map((p) => (
            <div key={p.id} className="w-[220px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </Section>
      )}

      {collections.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">Collections</h2>
          <div className="flex flex-wrap gap-3">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="rounded-2xl border border-border bg-surface px-5 py-4 font-semibold transition hover:border-magenta/60"
              >
                {c.emoji ? `${c.emoji} ` : ""}
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.map((category) => (
        <Section
          key={category.id}
          title={`${category.emoji ? category.emoji + " " : ""}${category.name}`}
          href={`/category/${category.slug}`}
        >
          {category.products.map((p) => (
            <div key={p.id} className="w-[220px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </Section>
      ))}
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-teal hover:underline">
          See all →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  );
}
