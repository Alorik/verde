"use client";

import { useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  country: string;
  city: string | null;
};

export default function OrganizationDetail({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    async function loadOrganization() {
      const { organizationId } = await params;

      const response = await fetch(`/api/organizations/${organizationId}`);

      if (!response.ok) {
        console.error("failed to load organization");
        return;
      }

      const data = await response.json();

      setOrganization(data.organization);
    }

    loadOrganization();
  }, [params]);
    if (!organization) {
      return <div>Loading...</div>;
    }

  return (
    <div className="min-h-screen border-x border-gray-200 bg-transparent p-8 mx-12">
      <h1 className="text-3xl font-semibold">{organization.name}</h1>

      <p className="mt-2 text-zinc-500">{organization.industry}</p>

      <div className="mt-8">
        <p>Employees: {organization.employeeCount}</p>

        <p>Country: {organization.country}</p>

        <p>City: {organization.city ?? "—"}</p>
      </div>
    </div>
  );
}
