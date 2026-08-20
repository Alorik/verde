import { gemini } from "@/lib/gemni";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No PDF provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: buffer.toString("base64"),
          },
        },
        {
          text: `
Extract the following information from this electricity bill:

1. Electricity consumption
2. Electricity consumption unit
3. Total electricity cost

Return only JSON in this format:

{
  "electricityConsumption": number,
  "unit": string,
  "electricityCost": number
}

If you cannot find a value, return null for that field.
          `,
        },
      ],
    });

    return NextResponse.json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "PDF extraction failed" },
      { status: 500 },
    );
  }
}
