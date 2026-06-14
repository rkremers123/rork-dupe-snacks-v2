import { getCategories } from "@/lib/queries";
import { requireAuth } from "@/lib/auth";
import { ProductForm } from "@/components/ProductForm";
import { createProductAction } from "../../actions";

export default async function NewProductPage() {
  await requireAuth();
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold">New product</h1>
      <ProductForm action={createProductAction} categories={categories} />
    </div>
  );
}
