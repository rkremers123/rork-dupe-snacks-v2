import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/catalog";
import { deleteProductAction } from "./actions";

export default async function AdminDashboard() {
  await requireAuth();

  const [products, categoryCount, collectionCount] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.count(),
    prisma.collection.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Catalog</h1>
          <p className="text-sm text-muted">
            {products.length} products · {categoryCount} categories ·{" "}
            {collectionCount} collections
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-magenta px-4 py-2.5 font-semibold text-white hover:brightness-110"
        >
          + New product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Dupe of</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
                        🍪
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-muted">{p.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{p.category.name}</td>
                <td className="px-4 py-3 text-muted">{p.dupeOf ?? "—"}</td>
                <td className="px-4 py-3">{formatPrice(p.price) || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="font-semibold text-teal hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteProductAction.bind(null, p.id)}>
                      <button className="text-danger hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No products yet. Click “New product” to add your first dupe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
