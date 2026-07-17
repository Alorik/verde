"use client";

import { useEffect, useState } from "react";

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
      setOrganizations(data.organizations);
    }

    loadOrganizations();
  }, []);

  return <div>{/* Render organizations here */}</div>;
}
