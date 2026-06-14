import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCategories } from "@/lib/queries";
import { requireAuth } from "@/lib/auth";
import { ProductForm } from "@/components/ProductForm";
import { updateProductAction } from "../../../actions";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({
  params,
}: {
  params: Params;
}) {
  await requireAuth();
  const { id } = await params;
  const productId = Number(id);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    getCategories(),
  ]);
  if (!product) notFound();

  const action = updateProductAction.bind(null, productId);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold">Edit product</h1>
      <ProductForm action={action} categories={categories} product={product} />
    </div>
  );
}
