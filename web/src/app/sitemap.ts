import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getDupeGroups } from "@/lib/queries";

const BASE = "https://dupesnacks.com";

// Generated from the live catalog at request time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections, dupeGroups] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.collection.findMany({
      where: { active: true },
      select: { slug: true },
    }),
    getDupeGroups(),
  ]);

  const staticRoutes = ["", "/dupes", "/collections", "/search", "/about"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({
      url: `${BASE}/category/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...collections.map((c) => ({
      url: `${BASE}/collections/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...dupeGroups.map((g) => ({
      url: `${BASE}/dupe/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...products.map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
