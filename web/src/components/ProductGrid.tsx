import type { Category, Product } from "@prisma/client";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({
  products,
}: {
  products: (Product & { category: Category })[];
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-muted">
        No products match your filters yet. Try clearing a filter.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
