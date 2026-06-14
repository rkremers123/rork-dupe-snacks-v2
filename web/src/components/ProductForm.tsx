import type { Category, Product } from "@prisma/client";
import { ALLERGENS, parseAllergens } from "@/lib/catalog";

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  product?: Product;
}) {
  const selected = new Set(parseAllergens(product?.allergens));
  const field =
    "rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none focus:border-teal w-full";
  const label = "flex flex-col gap-1 text-sm";

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          <span className="font-medium">Product name *</span>
          <input name="name" required defaultValue={product?.name} className={field} />
        </label>
        <label className={label}>
          <span className="font-medium">Brand *</span>
          <input name="brand" required defaultValue={product?.brand} className={field} />
        </label>
        <label className={label}>
          <span className="font-medium">Slug</span>
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="auto from name"
            className={field}
          />
        </label>
        <label className={label}>
          <span className="font-medium">Category *</span>
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className={field}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={label}>
        <span className="font-medium">Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description}
          className={field}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          <span className="font-medium">Image URL</span>
          <input name="imageUrl" defaultValue={product?.imageUrl} className={field} />
        </label>
        <label className={label}>
          <span className="font-medium">Amazon product URL</span>
          <input name="amazonUrl" defaultValue={product?.amazonUrl} className={field} />
        </label>
        <label className={label}>
          <span className="font-medium">ASIN (optional)</span>
          <input
            name="asin"
            defaultValue={product?.asin ?? ""}
            placeholder="e.g. B07ABCD123"
            className={field}
          />
        </label>
        <label className={label}>
          <span className="font-medium">Price (USD)</span>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price ?? ""}
            className={field}
          />
        </label>
        <label className={label}>
          <span className="font-medium">Rating (0–5)</span>
          <input
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            defaultValue={product?.rating ?? ""}
            className={field}
          />
        </label>
        <label className={label}>
          <span className="font-medium">Review count</span>
          <input
            name="reviewCount"
            type="number"
            defaultValue={product?.reviewCount ?? ""}
            className={field}
          />
        </label>
      </div>

      <fieldset className="rounded-xl border border-border p-4">
        <legend className="px-2 text-sm font-medium text-teal">
          Dupe details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>
            <span className="font-medium">Dupe of (mainstream snack)</span>
            <input
              name="dupeOf"
              defaultValue={product?.dupeOf ?? ""}
              placeholder="e.g. Goldfish Crackers"
              className={field}
            />
          </label>
          <label className={label}>
            <span className="font-medium">Original brand</span>
            <input
              name="dupeBrand"
              defaultValue={product?.dupeBrand ?? ""}
              placeholder="e.g. Pepperidge Farm"
              className={field}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-border p-4">
        <legend className="px-2 text-sm font-medium text-magenta">Allergens</legend>
        <div className="flex flex-wrap gap-4">
          {ALLERGENS.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="allergens"
                value={a.id}
                defaultChecked={selected.has(a.id)}
                className="h-4 w-4 accent-magenta"
              />
              Contains {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="glutenFreeCertified"
            value="1"
            defaultChecked={product?.glutenFreeCertified}
            className="h-4 w-4 accent-success"
          />
          Gluten-Free Certified
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            value="1"
            defaultChecked={product?.featured}
            className="h-4 w-4 accent-teal"
          />
          Featured on home page
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span>Popularity</span>
          <input
            name="popularity"
            type="number"
            defaultValue={product?.popularity ?? 0}
            className="w-24 rounded-lg border border-border bg-surface-2 px-3 py-1.5"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <button className="rounded-xl bg-magenta px-6 py-2.5 font-semibold text-white hover:brightness-110">
          Save product
        </button>
        <a
          href="/admin"
          className="rounded-xl border border-border px-6 py-2.5 font-semibold text-muted hover:text-foreground"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
