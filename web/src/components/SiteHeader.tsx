import Link from "next/link";
import { getCategories } from "@/lib/queries";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-teal">Dupe</span>
            <span className="text-magenta">Snacks</span>
          </span>
        </Link>

        <form action="/search" className="mx-auto flex w-full max-w-xl">
          <input
            type="search"
            name="q"
            placeholder="Search gluten-free dupes… (e.g. Goldfish, Oreos)"
            className="w-full rounded-l-xl border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none placeholder:text-muted focus:border-teal"
          />
          <button
            type="submit"
            className="rounded-r-xl bg-teal px-4 text-sm font-semibold text-background hover:brightness-110"
          >
            Search
          </button>
        </form>

        <nav className="hidden shrink-0 items-center gap-4 text-sm font-medium text-muted md:flex">
          <Link href="/dupes" className="hover:text-teal">
            Dupes
          </Link>
          <Link href="/collections" className="hover:text-teal">
            Collections
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap rounded-full px-3 py-1 text-muted transition hover:bg-surface hover:text-teal"
            >
              {c.emoji ? `${c.emoji} ` : ""}
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
