import Link from "next/link";
import { logoutAction } from "./actions";
import { isAuthenticated } from "@/lib/auth";

export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  return (
    <div className="min-h-full">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-extrabold">
            <span className="text-teal">Dupe</span>
            <span className="text-magenta">Snacks</span>
            <span className="ml-2 text-sm font-medium text-muted">Admin</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-teal">
              View site ↗
            </Link>
            {authed && (
              <form action={logoutAction}>
                <button className="text-muted hover:text-magenta">Log out</button>
              </form>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
