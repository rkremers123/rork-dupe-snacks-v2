import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDupeGroupBySlug, getDupeGroups } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductCard } from "@/components/ProductCard";
import { BuyButton } from "@/components/BuyButton";
import { productImage } from "@/lib/affiliate";
import { formatPrice } from "@/lib/catalog";
import { StarRating } from "@/components/StarRating";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = await getDupeGroupBySlug(slug);
  if (!group) return { title: "Dupe not found" };
  return {
    title: `Gluten-Free ${group.name} Dupe — The Best Celiac-Safe Alternative`,
    description: `Craving ${group.name}? Here are the best gluten-free ${group.name} dupes — celiac-safe alternatives that taste like the real thing, with direct Amazon links.`,
  };
}

export default async function DupePage({ params }: { params: Params }) {
  const { slug } = await params;
  const group = await getDupeGroupBySlug(slug);
  if (!group) notFound();

  const hero = group.products[0];
  const others = group.products.slice(1);
  const heroImage = productImage(hero);

  const faq = [
    {
      q: `Is ${group.name} gluten-free?`,
      a: `Traditional ${group.name}${group.brand ? ` from ${group.brand}` : ""} is not gluten-free. The alternatives below are made without gluten and are safe for people with celiac disease or gluten sensitivity.`,
    },
    {
      q: `What is the best gluten-free dupe for ${group.name}?`,
      a: `${hero.brand} ${hero.name} is our top gluten-free ${group.name} dupe — it closely matches the taste and texture of the original. You can buy it directly on Amazon using the link above.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-teal">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/dupes" className="hover:text-teal">
          Dupes
        </Link>{" "}
        / <span className="text-foreground">{group.name}</span>
      </nav>

      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">
          Gluten-Free Dupe
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
          The Best Gluten-Free {group.name} Dupe
        </h1>
        <p className="mt-3 text-muted">
          Love {group.name}
          {group.brand ? ` by ${group.brand}` : ""} but need to avoid gluten?
          These celiac-safe alternatives capture the same taste and crunch —
          without the wheat. Here&apos;s our top pick.
        </p>
      </header>

      {/* Top pick */}
      <section className="grid gap-6 rounded-3xl border border-border bg-surface p-5 md:grid-cols-[260px_1fr] md:p-7">
        <Link
          href={`/products/${hero.slug}`}
          className="block overflow-hidden rounded-2xl border border-border bg-white"
        >
          {heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={hero.name}
              className="aspect-square w-full object-contain p-4"
            />
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-2 to-surface">
              <span className="text-6xl">{hero.category.emoji ?? "🍪"}</span>
              <span className="font-semibold text-foreground/70">{hero.brand}</span>
            </div>
          )}
        </Link>

        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
            ⭐ Top gluten-free pick
          </span>
          <div className="text-sm font-bold uppercase tracking-wide text-teal">
            {hero.brand}
          </div>
          <Link
            href={`/products/${hero.slug}`}
            className="text-2xl font-extrabold hover:text-teal"
          >
            {hero.name}
          </Link>
          <StarRating rating={hero.rating} reviewCount={hero.reviewCount} size="lg" />
          {hero.price != null && (
            <div className="text-2xl font-bold">{formatPrice(hero.price)}</div>
          )}
          {hero.description && (
            <p className="text-muted">{hero.description}</p>
          )}
          <BuyButton
            asin={hero.asin}
            amazonUrl={hero.amazonUrl}
            size="lg"
            className="mt-1 w-full sm:w-auto"
          />
        </div>
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">
            More gluten-free {group.name} alternatives
          </h2>
          <ProductGrid products={others} />
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-3xl">
        <h2 className="mb-4 text-xl font-bold">
          Gluten-free {group.name}: questions, answered
        </h2>
        <div className="flex flex-col gap-3">
          {faq.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1.5 text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
