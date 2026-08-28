"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const industries = [
  "TECHNOLOGY",
  "MANUFACTURING",
  "HEALTHCARE",
  "EDUCATION",
  "CONSTRUCTION",
  "ENERGY",
  "FINANCE",
  "OTHER",
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    industry: "TECHNOLOGY",
    employeeCount: "",
    country: "",
    city: "",
    foundedAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          industry: form.industry,
          employeeCount: Number(form.employeeCount),
          country: form.country,
          city: form.city || undefined,
          foundedAt: form.foundedAt || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
            E
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Create your organization
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Set up your ESG reporting workspace.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">
            {/* Organization */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Organization details
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Organization name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Acme Corporation"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="industry"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Industry
                    </label>

                    <select
                      id="industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="employeeCount"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Employees
                    </label>

                    <input
                      id="employeeCount"
                      name="employeeCount"
                      type="number"
                      min="1"
                      required
                      value={form.employeeCount}
                      onChange={handleChange}
                      placeholder="250"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Country
                    </label>

                    <input
                      id="country"
                      name="country"
                      type="text"
                      required
                      value={form.country}
                      onChange={handleChange}
                      placeholder="India"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="New Delhi"
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="foundedAt"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Founded date
                  </label>

                  <input
                    id="foundedAt"
                    name="foundedAt"
                    type="date"
                    value={form.foundedAt}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Account */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Account details
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />

                  <p className="mt-1.5 text-xs text-zinc-400">
                    Minimum 8 characters.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating organization..." : "Create organization"}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
