"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            ESG Platform
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-tight text-zinc-900">
            Organization login
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Sign in to access your ESG assessments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-zinc-500"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-zinc-400"
              placeholder="admin@acme.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-zinc-500"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-zinc-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Don&apos;t have an organization account?{" "}
            <Link
              href="/register"
              className="font-medium text-zinc-900 underline underline-offset-4 transition hover:text-zinc-600"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
