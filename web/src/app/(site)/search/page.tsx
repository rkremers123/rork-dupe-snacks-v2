import type { Metadata } from "next";
import { searchProducts, parseFilters } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";
import { CatalogControls } from "@/components/CatalogControls";

type Search = Promise<Record<string, string | string[] | undefined>>;

export const metadata: Metadata = {
  title: "Search gluten-free snacks",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const products = await searchProducts(filters);

  const hidden: Record<string, string> = {};
  if (filters.q) hidden.q = filters.q;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold">
          {filters.q ? (
            <>
              Results for <span className="text-teal">“{filters.q}”</span>
            </>
          ) : (
            "All gluten-free products"
          )}
        </h1>
        <p className="mt-1 text-sm text-muted">{products.length} products</p>
      </header>

      <CatalogControls
        action="/search"
        hidden={hidden}
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
