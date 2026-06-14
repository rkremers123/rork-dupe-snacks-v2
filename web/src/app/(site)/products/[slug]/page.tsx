import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getProductBySlug } from "@/lib/queries";
import { formatPrice, slugify } from "@/lib/catalog";
import {
  amazonAffiliateUrl,
  productImage,
  hasExactProductLink,
} from "@/lib/affiliate";
import { StarRating } from "@/components/StarRating";
import { BuyButton } from "@/components/BuyButton";
import { ProductCard } from "@/components/ProductCard";
import { AllergenBadges, CertifiedBadge, DupeBadge } from "@/components/Badges";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const dupe = product.dupeOf ? ` — a gluten-free dupe for ${product.dupeOf}` : "";
  return {
    title: `${product.name} by ${product.brand}`,
    description: `${product.name}${dupe}. ${product.description}`.slice(0, 160),
    openGraph: product.imageUrl ? { images: [product.imageUrl] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = productImage(product);
  const exactLink = hasExactProductLink(product);

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    orderBy: { popularity: "desc" },
    take: 5,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: product.imageUrl || undefined,
    ...(product.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount ?? 1,
          },
        }
      : {}),
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            url: amazonAffiliateUrl(product),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <div className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-teal">
          Home
        </Link>{" "}
        /{" "}
        <Link href={`/category/${product.category.slug}`} className="hover:text-teal">
          {product.category.name}
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border bg-white">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              className="aspect-square w-full object-contain p-6"
            />
          ) : (
            <div className="flex aspect-square flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-2 to-surface">
              <span className="text-7xl">{product.category.emoji ?? "🍪"}</span>
              <span className="font-semibold text-foreground/70">
                {product.brand}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-sm font-semibold uppercase tracking-wide text-teal">
            {product.brand}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight">{product.name}</h1>

          {product.dupeOf && (
            <Link
              href={`/dupe/${slugify(product.dupeOf)}`}
              className="block rounded-2xl border border-teal/30 bg-teal/10 p-4 transition hover:border-teal/60 hover:bg-teal/15"
            >
              <p className="text-sm">
                <span className="font-bold text-teal">Gluten-free dupe</span> for{" "}
                <span className="font-semibold">
                  {product.dupeBrand ? `${product.dupeBrand} ` : ""}
                  {product.dupeOf}
                </span>
                . Same craving, celiac-safe.{" "}
                <span className="font-semibold text-teal">
                  See all {product.dupeOf} dupes →
                </span>
              </p>
            </Link>
          )}

          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="lg"
          />

          {product.price != null && (
            <div className="text-3xl font-bold">{formatPrice(product.price)}</div>
          )}

          <div className="flex flex-wrap gap-2">
            {product.glutenFreeCertified && <CertifiedBadge />}
            <DupeBadge dupeOf={product.dupeOf} />
          </div>

          <AllergenBadges allergens={product.allergens} />

          <BuyButton
            asin={product.asin}
            amazonUrl={product.amazonUrl}
            size="lg"
            className="mt-2 w-full sm:w-auto"
          />
          {exactLink ? (
            <p className="text-xs text-teal">
              ✓ Links directly to this exact product on Amazon.
            </p>
          ) : null}
          <p className="text-xs text-muted">
            As an Amazon Associate we earn from qualifying purchases.
          </p>

          {product.description && (
            <div className="mt-2 border-t border-border pt-4">
              <h2 className="mb-2 font-semibold">About this product</h2>
              <p className="leading-relaxed text-muted">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">
            More gluten-free {product.category.name.toLowerCase()}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
