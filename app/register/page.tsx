"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-screen bg-zinc-100 px-6 py-12 sm:px-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* =========================================================
            BRAND / HEADER
        ========================================================= */}

        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* 3D depth */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 border border-emerald-700/25 bg-emerald-100" />

              <div className="relative flex h-12 w-12 items-center justify-center border border-emerald-700/40 bg-emerald-600">
                <Image
                  src="/verde.jpg"
                  alt="Verde logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-emerald-800">
                Verde ESG
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-500">
                Sustainability reporting platform
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-800">
              Organization setup
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl">
              Create your organization
            </h1>

            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-zinc-500">
              Set up your ESG reporting workspace and provide the organization
              details used throughout your assessments.
            </p>
          </div>
        </div>

        {/* =========================================================
            FORM
        ========================================================= */}

        <div className="relative">
          {/* Main 3D extrusion */}
          <div className="absolute inset-0 translate-x-2 translate-y-2 border border-emerald-700/25 bg-emerald-50" />

          <form
            onSubmit={handleSubmit}
            className="relative border border-zinc-300 bg-white shadow-[0_14px_35px_rgba(6,78,59,0.07)]"
          >
            <div className="p-6 sm:p-8">
              <div className="space-y-10">
                {/* =================================================
                    ORGANIZATION
                ================================================= */}

                <section>
                  <div className="flex items-end justify-between border-b border-emerald-700/20 pb-4">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-800">
                        01 / Organization
                      </p>

                      <h2 className="mt-1.5 text-lg font-medium tracking-tight text-zinc-950">
                        Organization details
                      </h2>
                    </div>

                    <span className="hidden text-[9px] font-medium uppercase tracking-widest text-zinc-400 sm:block">
                      Required information
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Organization name */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
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
                        className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                      />
                    </div>

                    {/* Industry / Employees */}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="industry"
                          className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
                        >
                          Industry
                        </label>

                        <select
                          id="industry"
                          name="industry"
                          value={form.industry}
                          onChange={handleChange}
                          className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
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
                          className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
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
                          className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                        />
                      </div>
                    </div>

                    {/* Country / City */}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="country"
                          className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
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
                          className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
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
                          className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                        />
                      </div>
                    </div>

                    {/* Founded */}

                    <div>
                      <label
                        htmlFor="foundedAt"
                        className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
                      >
                        Founded date
                      </label>

                      <input
                        id="foundedAt"
                        name="foundedAt"
                        type="date"
                        value={form.foundedAt}
                        onChange={handleChange}
                        className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                      />
                    </div>
                  </div>
                </section>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="h-px bg-emerald-700/20" />

                {/* =================================================
                    ACCOUNT
                ================================================= */}

                <section>
                  <div className="flex items-end justify-between border-b border-emerald-700/20 pb-4">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-800">
                        02 / Account
                      </p>

                      <h2 className="mt-1.5 text-lg font-medium tracking-tight text-zinc-950">
                        Account details
                      </h2>
                    </div>

                    <span className="hidden text-[9px] font-medium uppercase tracking-widest text-zinc-400 sm:block">
                      Secure access
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Email */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
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
                        className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                      />
                    </div>

                    {/* Password */}

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-zinc-600"
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
                        className="w-full border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-emerald-700/40 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/10"
                      />

                      <p className="mt-2 text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                        Minimum 8 characters
                      </p>
                    </div>
                  </div>
                </section>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                  <div className="border border-rose-500/30 bg-rose-50 px-4 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-rose-700">
                      {error}
                    </p>
                  </div>
                )}

                {/* =================================================
                    ACTION
                ================================================= */}

                <div className="pt-1">
                  <div className="relative">
                    {/* Button 3D layer */}

                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-emerald-700/30 bg-emerald-100" />

                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full border border-zinc-950 bg-zinc-950 px-4 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Creating organization..."
                        : "Create organization"}
                    </button>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500">
                    <span>Already have an account?</span>

                    <Link
                      href="/login"
                      className="text-emerald-800 transition hover:text-emerald-950"
                    >
                      Sign in →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Form footer */}

            <div className="border-t border-emerald-700/20 bg-zinc-50 px-6 py-4 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Verde · ESG workspace
                </p>

                <span className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-wider text-emerald-800">
                  <span className="h-1.5 w-1.5 bg-emerald-500" />
                  Ready to report
                </span>
              </div>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          Organization registration · ESG reporting
        </p>
      </div>
    </main>
  );
}
