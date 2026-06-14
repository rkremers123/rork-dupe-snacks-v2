// Shared catalog constants and helpers used across public pages and admin.

export const ALLERGENS = [
  { id: "soy", label: "Soy" },
  { id: "dairy", label: "Dairy" },
  { id: "nuts", label: "Nuts" },
  { id: "eggs", label: "Eggs" },
  { id: "corn", label: "Corn" },
] as const;

export type AllergenId = (typeof ALLERGENS)[number]["id"];

export const SORT_OPTIONS = [
  { id: "popular", label: "Popular" },
  { id: "rating", label: "Top Rated" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

/** Parse the comma-separated allergens string into a list of ids. */
export function parseAllergens(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);
}

/** Pretty allergen labels from a raw string. */
export function allergenLabels(value: string | null | undefined): string[] {
  const ids = parseAllergens(value);
  return ids.map((id) => ALLERGENS.find((a) => a.id === id)?.label ?? id);
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "";
  return `$${price.toFixed(2)}`;
}

/** Sorting applied in-memory after a DB fetch (catalog is small at launch). */
export function sortProducts<
  T extends {
    price: number | null;
    rating: number | null;
    popularity: number;
    createdAt: Date;
  },
>(products: T[], sort: SortId): T[] {
  const list = [...products];
  switch (sort) {
    case "rating":
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "price_asc":
      return list.sort(
        (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
      );
    case "price_desc":
      return list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case "newest":
      return list.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    case "popular":
    default:
      return list.sort((a, b) => b.popularity - a.popularity);
  }
}
