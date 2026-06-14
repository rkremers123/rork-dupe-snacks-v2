import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl">🍪</div>
      <h1 className="mt-4 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-muted">
        We couldn&apos;t find that snack. Try browsing the dupes instead.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-magenta px-5 py-2.5 font-semibold text-white hover:brightness-110"
      >
        Back home
      </Link>
    </div>
  );
}
