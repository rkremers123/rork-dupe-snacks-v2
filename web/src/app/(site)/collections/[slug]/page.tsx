import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionBySlug } from "@/lib/queries";
import { ProductGrid } from "@/components/ProductGrid";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description ?? `Gluten-free ${collection.name}.`,
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection || !collection.active) notFound();

  const products = collection.products.map((cp) => cp.product);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-extrabold">
          {collection.emoji ? `${collection.emoji} ` : ""}
          {collection.name}
        </h1>
        {collection.description && (
          <p className="mt-1 text-muted">{collection.description}</p>
        )}
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
