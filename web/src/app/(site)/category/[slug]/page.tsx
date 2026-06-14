import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  searchProducts,
  parseFilters,
} from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { CatalogControls } from "@/components/CatalogControls";

type Params = Promise<{ slug: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `Gluten-Free ${category.name}`,
    description:
      category.blurb ??
      `Browse gluten-free ${category.name.toLowerCase()} and find dupes for your favorites.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters = parseFilters({ ...sp, category: slug });
  const products = await searchProducts(filters);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold">
          {category.emoji ? `${category.emoji} ` : ""}
          Gluten-Free {category.name}
        </h1>
        {category.blurb && <p className="mt-1 text-muted">{category.blurb}</p>}
        <p className="mt-1 text-sm text-muted">{products.length} products</p>
      </header>

      <CatalogControls
        action={`/category/${slug}`}
        current={{
          sort: filters.sort,
          allergenFree: filters.allergenFree,
          certifiedOnly: filters.certifiedOnly,
          maxPrice: filters.maxPrice?.toString(),
        }}
      />

      <ProductGrid products={products} />
    </div>
  );
}
