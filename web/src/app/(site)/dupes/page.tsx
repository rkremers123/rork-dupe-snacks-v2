import type { Metadata } from "next";
import { getDupeProducts } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Gluten-Free Dupes",
  description:
    "Every gluten-free dupe we've found — the celiac-safe version of popular snacks like Goldfish, Oreos, Cheez-Its and more.",
};

export default async function DupesPage() {
  const products = await getDupeProducts();

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold">Gluten-Free Dupes</h1>
        <p className="mt-1 text-muted">
          The snacks you miss, made celiac-safe. Each one is the gluten-free
          twin of a mainstream favorite.
        </p>
        <p className="mt-1 text-sm text-muted">{products.length} dupes</p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
