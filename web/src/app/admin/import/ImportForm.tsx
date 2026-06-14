"use client";

import { useActionState } from "react";
import { importProductsAction, emptyImportResult } from "./actions";

export function ImportForm() {
  const [state, action, pending] = useActionState(
    importProductsAction,
    emptyImportResult,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="font-medium">Upload a .csv file</span>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-teal file:px-3 file:py-1.5 file:font-semibold file:text-background"
        />
      </label>

      <div className="text-center text-xs uppercase tracking-wide text-muted">
        — or paste CSV —
      </div>

      <textarea
        name="csv"
        rows={10}
        placeholder="name,brand,category,amazonUrl,asin,price,rating,reviewCount,description,dupeOf,dupeBrand,allergens,glutenFreeCertified,featured,imageUrl,popularity"
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-teal"
      />

      <button
        disabled={pending}
        className="w-fit rounded-xl bg-magenta px-6 py-2.5 font-semibold text-white hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Importing…" : "Import products"}
      </button>

      {state.ran && (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <span className="text-success">✓ {state.created} created</span>
            <span className="text-teal">↻ {state.updated} updated</span>
            {state.errors.length > 0 && (
              <span className="text-danger">⚠ {state.errors.length} issues</span>
            )}
          </div>
          {state.errors.length > 0 && (
            <ul className="mt-3 max-h-48 list-disc overflow-y-auto pl-5 text-sm text-muted">
              {state.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
          {state.created + state.updated > 0 && (
            <a
              href="/admin"
              className="mt-3 inline-block text-sm font-semibold text-teal hover:underline"
            >
              View catalog →
            </a>
          )}
        </div>
      )}
    </form>
  );
}
