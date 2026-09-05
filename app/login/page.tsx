"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <main className="min-h-screen bg-zinc-100 px-5 py-5 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl grid-cols-1 overflow-hidden border border-zinc-200 bg-white lg:grid-cols-2">
        {/* LEFT — IMAGE */}
        <div className="relative hidden min-h-[700px] overflow-hidden border-r border-zinc-200 bg-zinc-950 lg:block">
          {/* 3D depth layer */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-emerald-500" />

          <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-950">
            {/* Repeating ESG background instead of the image */}
            <ESGShapesBackground />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Bottom information */}
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
                  Verde / ESG
                </span>
              </div>

              <h2 className="max-w-md font-serif text-4xl leading-tight tracking-tight text-white">
                Measure what matters.
                <br />
                Build a more sustainable future.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-300">
                Manage sustainability data, assessments, metrics and ESG
                reporting from one place.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — LOGIN */}
        <div className="relative flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Logo / heading */}
            <div className="mb-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="relative">
                  {/* 3D depth */}
                  <div className="absolute inset-0 translate-x-2 translate-y-2 border border-emerald-700/25  " />

                  <div className="relative flex h-12 w-15 items-center justify-center  ">
                    <Image
                      src="/verde.jpg"
                      alt="Verde logo"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-600">
                  01 / Access
                </span>

                <span className="h-px flex-1 bg-zinc-200" />
              </div>

              <h1 className="font-serif text-4xl tracking-tight text-zinc-950 sm:text-5xl">
                Organization login
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                Sign in to access your ESG assessments.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
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
                  className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-950"
                  placeholder="admin@acme.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500"
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
                  className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-950"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* 3D button */}
              <div className="relative">
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-emerald-500" />

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full border border-zinc-950 bg-zinc-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-3">
                    {loading ? "Signing in…" : "Sign in"}

                    {!loading && <span className="text-emerald-400">→</span>}
                  </span>
                </button>
              </div>
            </form>

            {/* Register */}
            <div className="mt-8 border-t border-zinc-200 pt-6">
              <p className="text-sm text-zinc-500">
                Don&apos;t have an organization account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-zinc-950 underline decoration-emerald-500 decoration-2 underline-offset-4 transition hover:text-emerald-600"
                >
                  Register
                </Link>
              </p>
            </div>

            {/* Footer metadata */}
            <div className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                Secure access
              </span>

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                Verde / 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


function ESGShapesBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Single spotlight — soft teal/emerald glow radiating from top-center */}
      <motion.div
        className="absolute left-1/2 top-0 h-[1900px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.35) 2%, rgba(16,185,129,0.18) 45%, rgba(16,185,129,0.05) 80%, transparent 95%)",
        }}
  
      />

      {/* Subtle dot grid so the rest of the panel isn't flat black */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "154px 154px",
        }}
      />
    </div>
  );
}

