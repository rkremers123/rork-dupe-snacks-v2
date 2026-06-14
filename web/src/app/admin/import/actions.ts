"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { parseCsv } from "@/lib/csv";
import { slugify, ALLERGENS } from "@/lib/catalog";
import { extractAsin } from "@/lib/affiliate";

export type ImportResult = {
  ran: boolean;
  created: number;
  updated: number;
  errors: string[];
};

export const emptyImportResult: ImportResult = {
  ran: false,
  created: 0,
  updated: 0,
  errors: [],
};

const ALLERGEN_IDS = new Set<string>(ALLERGENS.map((a) => a.id));

function normHeader(h: string) {
  return h.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function truthy(v: string) {
  return ["1", "true", "yes", "y", "x"].includes(v.trim().toLowerCase());
}

function numOrNull(v: string): number | null {
  const s = v.trim().replace(/[$,]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export async function importProductsAction(
  _prev: ImportResult,
  formData: FormData,
): Promise<ImportResult> {
  await requireAuth();

  const file = formData.get("file");
  let text = "";
  if (file && typeof file !== "string" && file.size > 0) {
    text = await file.text();
  } else {
    text = String(formData.get("csv") ?? "");
  }
  if (!text.trim()) {
    return { ran: true, created: 0, updated: 0, errors: ["No CSV provided."] };
  }

  const rows = parseCsv(text);
  if (rows.length < 2) {
    return {
      ran: true,
      created: 0,
      updated: 0,
      errors: ["CSV needs a header row plus at least one data row."],
    };
  }

  const header = rows[0].map(normHeader);
  const col = (...names: string[]) => {
    for (const n of names) {
      const i = header.indexOf(n);
      if (i !== -1) return i;
    }
    return -1;
  };
  const cells = (row: string[], idx: number) =>
    idx === -1 ? "" : (row[idx] ?? "").trim();

  const idx = {
    name: col("name", "product", "productname"),
    brand: col("brand"),
    category: col("category", "categoryname"),
    amazonUrl: col("amazonurl", "url", "amazonlink", "link"),
    asin: col("asin"),
    price: col("price"),
    rating: col("rating", "stars"),
    reviewCount: col("reviewcount", "reviews", "numreviews"),
    description: col("description", "desc"),
    dupeOf: col("dupeof", "dupe", "alternativeto"),
    dupeBrand: col("dupebrand", "originalbrand"),
    allergens: col("allergens"),
    certified: col("glutenfreecertified", "certified", "gfcertified"),
    featured: col("featured"),
    imageUrl: col("imageurl", "image", "img"),
    popularity: col("popularity"),
    slug: col("slug"),
  };

  if (idx.name === -1 || idx.brand === -1 || idx.category === -1) {
    return {
      ran: true,
      created: 0,
      updated: 0,
      errors: [
        "Missing required column(s). The header must include: name, brand, category.",
      ],
    };
  }

  // Cache categories by slug; create on the fly when a new one appears.
  const categories = await prisma.category.findMany();
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const catByName = new Map(categories.map((c) => [c.name.toLowerCase(), c]));
  let nextSort = categories.reduce((m, c) => Math.max(m, c.sortOrder), 0) + 1;

  async function resolveCategoryId(raw: string): Promise<number> {
    const value = raw.trim();
    const bySlug = catBySlug.get(slugify(value));
    if (bySlug) return bySlug.id;
    const byName = catByName.get(value.toLowerCase());
    if (byName) return byName.id;
    const created = await prisma.category.create({
      data: { slug: slugify(value), name: value, sortOrder: nextSort++ },
    });
    catBySlug.set(created.slug, created);
    catByName.set(created.name.toLowerCase(), created);
    return created.id;
  }

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const lineNo = r + 1;
    try {
      const name = cells(row, idx.name);
      const brand = cells(row, idx.brand);
      const category = cells(row, idx.category);
      if (!name || !brand || !category) {
        errors.push(`Row ${lineNo}: name, brand and category are required — skipped.`);
        continue;
      }

      const slugInput = cells(row, idx.slug);
      const slug = slugInput ? slugify(slugInput) : slugify(name);
      const amazonUrl = cells(row, idx.amazonUrl);
      const asin =
        extractAsin(cells(row, idx.asin)) ?? extractAsin(amazonUrl);

      const allergens = cells(row, idx.allergens)
        .split(/[;,|]/)
        .map((a) => a.trim().toLowerCase())
        .filter((a) => ALLERGEN_IDS.has(a))
        .join(",");

      const categoryId = await resolveCategoryId(category);

      const data = {
        slug,
        name,
        brand,
        description: cells(row, idx.description),
        imageUrl: cells(row, idx.imageUrl),
        amazonUrl,
        asin,
        price: numOrNull(cells(row, idx.price)),
        rating: numOrNull(cells(row, idx.rating)),
        reviewCount: (() => {
          const n = numOrNull(cells(row, idx.reviewCount));
          return n == null ? null : Math.trunc(n);
        })(),
        glutenFreeCertified: truthy(cells(row, idx.certified)),
        allergens,
        dupeOf: cells(row, idx.dupeOf) || null,
        dupeBrand: cells(row, idx.dupeBrand) || null,
        featured: truthy(cells(row, idx.featured)),
        popularity: Math.trunc(numOrNull(cells(row, idx.popularity)) ?? 0),
        categoryId,
      };

      const existing = await prisma.product.findUnique({ where: { slug } });
      await prisma.product.upsert({
        where: { slug },
        update: data,
        create: data,
      });
      if (existing) updated++;
      else created++;
    } catch (e) {
      errors.push(
        `Row ${lineNo}: ${e instanceof Error ? e.message : "unknown error"}`,
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/dupes");
  revalidatePath("/collections");
  revalidatePath("/admin");

  return { ran: true, created, updated, errors };
}
