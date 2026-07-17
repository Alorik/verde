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
  const [organizations, setOrganizations] = useState<any[]>([]);

  useEffect(() => {
    async function loadOrganizations() {
      const response = await fetch("/api/organizations");

      if (!response.ok) {
        console.error("Failed to load organizations");
        return;
      }

      const data = await response.json();
      console.log(data);
      setOrganizations(data);
    }

    loadOrganizations();
  }, []);

  return (
    <div>
      {organizations.map((organization) => (
        <div key={organization.id}>
          <h2>{organization.name}</h2>
        </div>
      ))}
    </div>
  );
}
