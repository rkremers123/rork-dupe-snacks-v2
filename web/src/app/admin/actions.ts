"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/catalog";
import {
  checkPassword,
  createSession,
  destroySession,
  requireAuth,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

function num(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function readProductForm(formData: FormData) {
  const name = str(formData.get("name"));
  const slugInput = str(formData.get("slug"));
  const allergens = formData
    .getAll("allergens")
    .map((a) => String(a))
    .join(",");

  return {
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    brand: str(formData.get("brand")),
    description: str(formData.get("description")),
    imageUrl: str(formData.get("imageUrl")),
    amazonUrl: str(formData.get("amazonUrl")),
    asin: str(formData.get("asin")) || null,
    price: num(formData.get("price")),
    rating: num(formData.get("rating")),
    reviewCount: num(formData.get("reviewCount"))
      ? Math.trunc(num(formData.get("reviewCount"))!)
      : null,
    glutenFreeCertified: formData.get("glutenFreeCertified") === "1",
    allergens,
    dupeOf: str(formData.get("dupeOf")) || null,
    dupeBrand: str(formData.get("dupeBrand")) || null,
    featured: formData.get("featured") === "1",
    popularity: Math.trunc(num(formData.get("popularity")) ?? 0),
    categoryId: Math.trunc(num(formData.get("categoryId")) ?? 0),
  };
}

export async function createProductAction(formData: FormData) {
  await requireAuth();
  const data = readProductForm(formData);
  if (!data.name || !data.categoryId) {
    redirect("/admin/products/new?error=missing");
  }
  await prisma.product.create({ data });
  revalidatePath("/");
  revalidatePath("/dupes");
  revalidatePath("/collections");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProductAction(id: number, formData: FormData) {
  await requireAuth();
  const data = readProductForm(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/dupes");
  revalidatePath("/collections");
  revalidatePath("/admin");
  revalidatePath(`/products/${data.slug}`);
  redirect("/admin");
}

export async function deleteProductAction(id: number) {
  await requireAuth();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/dupes");
  revalidatePath("/collections");
  revalidatePath("/admin");
}
