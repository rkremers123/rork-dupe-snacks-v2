import { prisma } from "@/lib/db";
import { parseAllergens, sortProducts, type SortId } from "@/lib/catalog";

export type ProductWithCategory = Awaited<
  ReturnType<typeof getProductBySlug>
>;

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export function getActiveCollections() {
  return prisma.collection.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: { product: { include: { category: true } } },
      },
    },
  });
}

/** Featured products for the home page hero strip. */
export function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { popularity: "desc" },
    take,
  });
}

/** Home page: a few products per category. */
export async function getCategoriesWithProducts(perCategory = 8) {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        include: { category: true },
        orderBy: { popularity: "desc" },
        take: perCategory,
      },
    },
  });
  return categories.filter((c) => c.products.length > 0);
}

/** Products that are dupes of a mainstream snack. */
export function getDupeProducts() {
  return prisma.product.findMany({
    where: { dupeOf: { not: null } },
    include: { category: true },
    orderBy: { popularity: "desc" },
  });
}

/** Normalize Next's searchParams (string | string[] | undefined) into filters. */
export function parseFilters(
  sp: Record<string, string | string[] | undefined>,
): CatalogFilters {
  const one = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const many = (v: string | string[] | undefined) =>
    v == null ? [] : Array.isArray(v) ? v : [v];

  const maxPriceRaw = one(sp.maxPrice);
  const maxPrice =
    maxPriceRaw && !Number.isNaN(Number(maxPriceRaw))
      ? Number(maxPriceRaw)
      : undefined;

  return {
    q: one(sp.q),
    categorySlug: one(sp.category),
    sort: (one(sp.sort) as CatalogFilters["sort"]) ?? "popular",
    allergenFree: many(sp.allergenFree),
    certifiedOnly: one(sp.certifiedOnly) === "1",
    maxPrice,
  };
}

export type CatalogFilters = {
  q?: string;
  categorySlug?: string;
  sort?: SortId;
  allergenFree?: string[]; // allergen ids the product must NOT contain
  certifiedOnly?: boolean;
  maxPrice?: number;
};

/**
 * Core catalog query powering /search and category pages.
 * Text search + category filtering happen in the DB; allergen and price
 * filtering + sorting happen in-memory (the launch catalog is small).
 */
export async function searchProducts(filters: CatalogFilters) {
  const where: Record<string, unknown> = {};

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters.certifiedOnly) {
    where.glutenFreeCertified = true;
  }
  if (filters.q && filters.q.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { dupeOf: { contains: q } },
      { description: { contains: q } },
    ];
  }

  let products = await prisma.product.findMany({
    where,
    include: { category: true },
  });

  if (filters.allergenFree && filters.allergenFree.length > 0) {
    const avoid = new Set(filters.allergenFree);
    products = products.filter((p) => {
      const present = parseAllergens(p.allergens);
      return !present.some((a) => avoid.has(a));
    });
  }

  if (filters.maxPrice != null) {
    products = products.filter(
      (p) => p.price == null || p.price <= filters.maxPrice!,
    );
  }

  return sortProducts(products, filters.sort ?? "popular");
}
