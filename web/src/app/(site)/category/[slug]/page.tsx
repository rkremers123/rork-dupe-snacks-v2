import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryBySlug,
  searchProducts,
  parseFilters,
} from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { FilterSidebar } from "@/components/FilterSidebar";

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
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-6">
        <h1 className="text-2xl font-extrabold md:text-3xl">
          {category.emoji ? `${category.emoji} ` : ""}
          Gluten-Free {category.name}
        </h1>
        {category.blurb && (
          <p className="mt-2 max-w-2xl text-muted">{category.blurb}</p>
        )}
        <p className="mt-2 text-sm text-muted">{products.length} products</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <FilterSidebar
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
    </div>
  );
}
