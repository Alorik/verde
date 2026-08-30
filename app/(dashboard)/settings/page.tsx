"use client";

import { useEffect, useState } from "react";
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
      <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <p className="text-xs text-zinc-400">retrieving settings…</p>
        </div>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <p className="text-sm text-red-600">
            {error ?? "Organization not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
      <div className="mx-auto max-w-5xl px-8 py-20">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            Account configuration
          </p>

          <h1 className="mt-3 text-4xl tracking-tight text-zinc-900">
            Settings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Manage your organization&apos;s information and account settings.
          </p>
        </div>

        {/* Organization */}
        <section className="mt-12">
          <div className="flex items-end justify-between border-b border-zinc-200 pb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Organization
              </p>

              <h2 className="mt-2 text-2xl tracking-tight text-zinc-900">
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
                className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Edit information
              </button>
            )}
          </div>

          {editing ? (
            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs text-zinc-500">
                  Organization name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500">Industry</label>

                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-zinc-500">Employees</label>

                  <input
                    type="number"
                    min={1}
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Country</label>

                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-zinc-500">City</label>

                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Founded</label>

                  <input
                    type="date"
                    value={foundedAt}
                    onChange={(e) => setFoundedAt(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-sm border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 disabled:opacity-50"
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
                  className="rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
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
          <div className="border-b border-zinc-200 pb-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Account
            </p>

            <h2 className="mt-2 text-2xl tracking-tight text-zinc-900">
              Account & security
            </h2>
          </div>

          <div className="divide-y divide-zinc-100">
            <div className="flex items-center justify-between gap-6 py-5">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  Account email
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {organization.email}
                </p>
              </div>

              <span className="text-xs text-zinc-400">Primary</span>
            </div>

            <div className="flex items-center justify-between gap-6 py-5">
              <div>
                <p className="text-sm font-medium text-zinc-900">Password</p>

                <p className="mt-1 text-sm text-zinc-500">
                  Your organization account password
                </p>
              </div>

              <button
                type="button"
                className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Change password
              </button>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="mt-16">
          <div className="border-b border-zinc-200 pb-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Data
            </p>

            <h2 className="mt-2 text-2xl tracking-tight text-zinc-900">
              Documents & assessments
            </h2>
          </div>

          <div className="divide-y divide-zinc-100">
            <div className="flex items-center justify-between gap-6 py-5">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  Document archive
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  View documents uploaded across your ESG assessments.
                </p>
              </div>

              <a
                href="/documents"
                className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                View documents
              </a>
            </div>

            <div className="flex items-center justify-between gap-6 py-5">
              <div>
                <p className="text-sm font-medium text-zinc-900">Assessments</p>

                <p className="mt-1 text-sm text-zinc-500">
                  Manage your organization&apos;s ESG assessments.
                </p>
              </div>

              <a
                href="/assessments"
                className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                View assessments
              </a>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-16 pb-10">
          <div className="border-b border-red-100 pb-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-red-400">
              Danger zone
            </p>

            <h2 className="mt-2 text-2xl tracking-tight text-zinc-900">
              Delete organization
            </h2>
          </div>

          <div className="mt-5 rounded-xl border border-red-100 bg-red-50/40 p-5">
            <p className="text-sm text-zinc-700">
              Permanently delete your organization and its associated
              assessments, documents, metrics, scores, and recommendations.
            </p>

            <button
              type="button"
              className="mt-4 rounded-sm border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
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
    <div className="flex items-center justify-between gap-8 py-5">
      <span className="text-sm text-zinc-500">{label}</span>

      <span className="text-right text-sm text-zinc-900">{value}</span>
    </div>
  );
}
