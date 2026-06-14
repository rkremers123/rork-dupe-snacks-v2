import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div className="max-w-sm">
            <div className="text-lg font-extrabold">
              <span className="text-teal">Dupe</span>
              <span className="text-magenta">Snacks</span>
            </div>
            <p className="mt-2">
              Gluten-free &ldquo;dupes&rdquo; for the snacks you love. Find a
              celiac-safe version of your favorites and buy them on Amazon.
            </p>
          </div>
          <nav className="flex gap-10">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-foreground">Browse</span>
              <Link href="/dupes" className="hover:text-teal">
                Dupes
              </Link>
              <Link href="/collections" className="hover:text-teal">
                Collections
              </Link>
              <Link href="/search" className="hover:text-teal">
                All products
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-foreground">Company</span>
              <Link href="/about" className="hover:text-teal">
                Our Story
              </Link>
            </div>
          </nav>
        </div>
        <p className="mt-8 text-xs text-muted/80">
          As an Amazon Associate, DupeSnacks earns from qualifying purchases.
          Prices and availability are accurate as of the date/time indicated and
          are subject to change.
        </p>
      </div>
    </footer>
  );
}
