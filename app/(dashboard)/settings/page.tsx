"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Organization = {
  id: string;
  name: string;
  email: string;
  industry: string;
  employeeCount: number;
  country: string;
  city: string | null;
  foundedAt: string | null;
};

export default function SettingsPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [foundedAt, setFoundedAt] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrganization() {
      try {
        const response = await fetch("/api/organizations");

        if (!response.ok) {
          throw new Error("Failed to load organization");
        }

        const data = await response.json();
        const org = data.organization;

        setOrganization(org);

        setName(org.name);
        setIndustry(org.industry);
        setEmployeeCount(org.employeeCount.toString());
        setCountry(org.country);
        setCity(org.city ?? "");
        setFoundedAt(
          org.foundedAt
            ? new Date(org.foundedAt).toISOString().split("T")[0]
            : "",
        );
      } catch (error) {
        console.error("Failed to load organization:", error);
        setError("Failed to load organization settings");
      } finally {
        setLoading(false);
      }
    }

    loadOrganization();
  }, []);

  function cancelEditing() {
    if (!organization) return;

    setName(organization.name);
    setIndustry(organization.industry);
    setEmployeeCount(organization.employeeCount.toString());
    setCountry(organization.country);
    setCity(organization.city ?? "");
    setFoundedAt(
      organization.foundedAt
        ? new Date(organization.foundedAt).toISOString().split("T")[0]
        : "",
    );

    setEditing(false);
    setError(null);
    setMessage(null);
  }

  async function saveOrganization() {
    if (!organization) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/organizations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          industry,
          employeeCount: Number(employeeCount),
          country,
          city: city || null,
          foundedAt: foundedAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to update organization");
      }

      setOrganization(data.organization);

      setName(data.organization.name);
      setIndustry(data.organization.industry);
      setEmployeeCount(data.organization.employeeCount.toString());
      setCountry(data.organization.country);
      setCity(data.organization.city ?? "");
      setFoundedAt(
        data.organization.foundedAt
          ? new Date(data.organization.foundedAt).toISOString().split("T")[0]
          : "",
      );

      setEditing(false);
      setMessage("Organization information updated successfully.");
    } catch (error) {
      console.error("Failed to update organization:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update organization",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="bg-zinc-100 px-12">
        <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10">
          <p className="text-xs font-medium text-zinc-600">retrieving settings…</p>
        </div>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="bg-zinc-100 px-12">
        <div className="mx-12 border-x border-emerald-800/30  bg-white py-10 sm:px-10">
          <p className="text-sm font-medium text-red-700">
            {error ?? "Organization not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-100 px-12">
      <div className="mx-12 border-x border-emerald-800/30  bg-white py-10 sm:px-10">
        {/* Header */}
        <div className="border-b border-emerald-800/30 shadow-[0_3px_6px_rgba(6,95,70,0.18)] sticky top-12 z-20 bg-white pb-8 -mx-10">
          <div className="mx-10">
          <p className="text-[11px] bg-white font-medium uppercase tracking-[0.2em] text-zinc-600">
            Account configuration
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-zinc-950">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-700">
            Manage your organization&apos;s information and account settings.
          </p>        
          </div>

        </div>

        {/* Organization */}
        <section className="mt-12">
          <div className="flex items-end justify-between border-b border-zinc-300 pb-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Organization
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
                Organization information
              </h2>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMessage(null);
                  setError(null);
                }}
                className="border border-zinc-500 bg-white px-4 py-2 text-xs font-medium text-zinc-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
              >
                Edit information
              </button>
            )}
          </div>

          {editing ? (
            <div className="mt-6 border border-zinc-300 bg-zinc-50 p-5 space-y-5">
              <div>
                <label className="text-xs font-medium text-zinc-600">
                  Organization name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border border-zinc-400 px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600">
                  Industry
                </label>

                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-2 w-full border border-zinc-400 px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-zinc-600">
                    Employees
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="mt-2 w-full border border-zinc-400 px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600">
                    Country
                  </label>

                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-2 w-full border border-zinc-400 px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-zinc-600">
                    City
                  </label>

                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full border border-zinc-400 px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-600">
                    Founded
                  </label>

                  <input
                    type="date"
                    value={foundedAt}
                    onChange={(e) => setFoundedAt(e.target.value)}
                    className="mt-2 w-full border border-zinc-400 px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="border border-zinc-500 bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveOrganization}
                  disabled={
                    saving ||
                    !name.trim() ||
                    !industry.trim() ||
                    !employeeCount ||
                    !country.trim()
                  }
                  className="border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-zinc-300 bg-white">
              <SettingRow label="Organization name" value={organization.name} />

              <SettingRow label="Email" value={organization.email} />

              <SettingRow label="Industry" value={organization.industry} />

              <SettingRow
                label="Employees"
                value={organization.employeeCount.toLocaleString()}
              />

              <SettingRow label="Country" value={organization.country} />

              <SettingRow
                label="City"
                value={organization.city ?? "Not on file"}
              />

              <SettingRow
                label="Founded"
                value={
                  organization.foundedAt
                    ? new Date(organization.foundedAt).getFullYear().toString()
                    : "Not on file"
                }
              />
            </div>
          )}
        </section>

        {/* Account */}
        <section className="mt-16">
          <div className="border-b border-zinc-300 pb-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Account
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
              Account & security
            </h2>
          </div>

          <div className="border border-zinc-300 bg-white">
            <div className="flex items-center justify-between gap-6 border-b border-zinc-300 p-5">
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  Account email
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-700">
                  {organization.email}
                </p>
              </div>

              <span className="text-xs font-medium text-zinc-600">Primary</span>
            </div>

            <div className="flex items-center justify-between gap-6 p-5">
              <div>
                <p className="text-sm font-medium text-zinc-950">Password</p>

                <p className="mt-1 text-sm font-medium text-zinc-700">
                  Your organization account password
                </p>
              </div>

              <button
                type="button"
                className="border border-zinc-500 bg-white px-4 py-2 text-xs font-medium text-zinc-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
              >
                Change password
              </button>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="mt-16">
          <div className="border-b border-zinc-300 pb-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Data
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
              Documents & assessments
            </h2>
          </div>

          <div className="border border-zinc-300 bg-white">
            <div className="flex items-center justify-between gap-6 border-b border-zinc-300 p-5">
              <div>
                <p className="text-sm font-medium text-zinc-950">
                  Document archive
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-700">
                  View documents uploaded across your ESG assessments.
                </p>
              </div>

              <Link
                href="/documents"
                className="border border-zinc-500 bg-white px-4 py-2 text-xs font-medium text-zinc-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
              >
                View documents
              </Link>
            </div>

            <div className="flex items-center justify-between gap-6 p-5">
              <div>
                <p className="text-sm font-medium text-zinc-950">Assessments</p>

                <p className="mt-1 text-sm font-medium text-zinc-700">
                  Manage your organization&apos;s ESG assessments.
                </p>
              </div>

              <Link
                href="/assessments"
                className="border border-zinc-500 bg-white px-4 py-2 text-xs font-medium text-zinc-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
              >
                View assessments
              </Link>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-16 pb-10">
          <div className="border-b border-red-300 pb-5 -mx-10">
            <div className="mx-10">
                     <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-red-600 px-1">
              Danger zone
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
              Delete organization
            </h2>     
            </div>

          </div>

          <div className="mt-5 border border-red-300 bg-red-50 p-5">
            <p className="text-sm font-medium text-zinc-800">
              Permanently delete your organization and its associated
              assessments, documents, metrics, scores, and recommendations.
            </p>

            <button
              type="button"
              className="mt-4 border border-red-400 bg-white px-4 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              Delete organization
            </button>
          </div>
        </section>

        {/* Status */}
        {(message || error) && !editing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-xs ${
              error ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {error ?? message}
          </motion.p>
        )}
      </div>
    </main>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-8 border-b border-zinc-300 p-5 last:border-b-0">
      <span className="text-sm font-medium text-zinc-700">{label}</span>

      <span className="text-right text-sm font-medium text-zinc-950">{value}</span>
    </div>
  );
}
