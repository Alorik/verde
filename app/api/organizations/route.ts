import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, industry, country, employeeCount, city, foundedAt } = body;

  const organization = await prisma.organization.create({
    data: {
      name,
      industry,
      country,
      employeeCount,
      city,
      foundedAt,
    },
  });

  return NextResponse.json(
    {
      message: "Organization created Successfully",
      organization,
    },
    {
      status: 201,
    },
  );
}
