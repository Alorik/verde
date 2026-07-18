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
    <div>
      {organizations.map((organization) => (
        <div key={organization.id}>
          <h2>{organization.name}</h2>
          <p>{organization.industry}</p>
          <p>{organization.employeeCount}</p>
          <p>{organization.country}</p>
          <p>{organization.city}</p>
        </div>
      ))}
    </div>
  );
}
