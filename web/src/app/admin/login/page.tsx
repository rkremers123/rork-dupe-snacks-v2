import { loginAction } from "../actions";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

type Search = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-xl font-bold">Admin login</h1>
      <p className="mt-1 text-sm text-muted">
        Enter the admin password to manage the catalog.
      </p>
      {error && (
        <p className="mt-3 rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">
          Incorrect password.
        </p>
      )}
      <form action={loginAction} className="mt-4 flex flex-col gap-3">
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          required
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none focus:border-teal"
        />
        <button className="rounded-lg bg-teal px-4 py-2 font-semibold text-background hover:brightness-110">
          Log in
        </button>
      </form>
    </div>
  );
}
