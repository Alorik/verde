"use client";

import { useEffect, useState } from "react";

export default function Organization() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    async function loadOrganizations() {
      const response = await fetch("/api/organizations");

      console.log("Response:", response);

      if (!response.ok) {
        console.error("Failed to load organizations");
        return;
      }

      const data = await response.json();
      console.log("Data:", data);

      setOrganizations(data.organizations);
    }

    loadOrganizations();
  }, []);

  return (
    <div className="min-h-screen bg-transparent border-x  border-gray-200 p-8 mx-12">
      <div className="p-6">Organizations</div>
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {organizations.map((organization) => (
          <div
            key={organization.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {organization.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {organization.industry}
                </p>
              </div>

              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-zinc-600">
                Active
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-zinc-200" />

            {/* Details */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Employees</span>
                <span className="font-medium text-zinc-900">
                  {organization.employeeCount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Country</span>
                <span className="font-medium text-zinc-900">
                  {organization.country}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">City</span>
                <span className="font-medium text-zinc-900">
                  {organization.city ?? " — "}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100">
                View Details <span className="hover:translate-x-4">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
