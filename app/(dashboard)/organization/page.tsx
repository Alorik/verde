"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Organization = {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  country: string;
  city: string | null;
};

export default function Organization() {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    async function loadOrganization() {
      try {
        const response = await fetch("/api/organizations");

        if (!response.ok) {
          console.error("Failed to load organization");
          return;
        }

        const data = await response.json();

        console.log("Organization:", data.organization);

        setOrganization(data.organization);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    }

    loadOrganization();
  }, []);

  if (!organization) {
    return (
      <div className="min-h-screen border-x border-gray-200 mx-12 p-8">
        <div className="p-6">Loading organization...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-x border-gray-200 mx-12 p-8">
      <div className="p-6">Organization</div>

      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg">
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
                {organization.city ?? "—"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href={`/organization/${organization.id}`}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
            >
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
