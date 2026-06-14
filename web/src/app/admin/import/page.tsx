import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { ImportForm } from "./ImportForm";

export const metadata = { title: "Bulk import" };

export default async function ImportPage() {
  await requireAuth();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-teal">
          ← Back to catalog
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold">Bulk import products</h1>
        <p className="mt-1 text-muted">
          Upload a spreadsheet to add or update many products at once. Existing
          products are matched by slug and updated; new ones are created.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 text-sm">
        <h2 className="font-semibold">CSV format</h2>
        <p className="mt-2 text-muted">
          First row must be a header. Required columns:{" "}
          <code className="text-teal">name</code>,{" "}
          <code className="text-teal">brand</code>,{" "}
          <code className="text-teal">category</code>. Everything else is
          optional:
        </p>
        <ul className="mt-2 list-disc pl-5 text-muted">
          <li>
            <code className="text-foreground">amazonUrl</code> — paste the exact
            product URL; the ASIN is auto-extracted so Buy links are exact (no
            search). Or set <code className="text-foreground">asin</code> directly.
          </li>
          <li>
            <code className="text-foreground">dupeOf</code> — the mainstream snack
            this replaces (e.g. <em>Goldfish Crackers</em>). This builds the
            /dupe SEO pages automatically.
          </li>
          <li>
            <code className="text-foreground">allergens</code> — any of{" "}
            <code className="text-foreground">soy dairy nuts eggs corn</code>,
            separated by <code>;</code> or <code>|</code>.
          </li>
          <li>
            <code className="text-foreground">glutenFreeCertified</code>,{" "}
            <code className="text-foreground">featured</code> — use{" "}
            <code>true</code>/<code>false</code>.
          </li>
          <li>
            <code className="text-foreground">price</code>,{" "}
            <code className="text-foreground">rating</code>,{" "}
            <code className="text-foreground">reviewCount</code>,{" "}
            <code className="text-foreground">description</code>,{" "}
            <code className="text-foreground">imageUrl</code>,{" "}
            <code className="text-foreground">popularity</code>,{" "}
            <code className="text-foreground">dupeBrand</code>.
          </li>
          <li>
            New <code className="text-foreground">category</code> values are
            created automatically.
          </li>
        </ul>
        <a
          href="/dupesnacks-import-template.csv"
          download
          className="mt-3 inline-block font-semibold text-teal hover:underline"
        >
          ⬇ Download template CSV
        </a>
      </div>

      <ImportForm />
    </div>
  );
}
