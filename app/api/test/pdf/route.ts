import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/lib/gemni";
import { electricityExtractionSchema } from "@/lib/validations/esgScore";

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

- electricity cost
- electricity consumption in units

Return only JSON:

{
  "electricityCost": number,
  "unitsConsumed": number
}

Do not include any other fields.
          `,
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawResult = response.text;

    if (!rawResult) {
      return NextResponse.json(
        { message: "Gemini returned no result" },
        { status: 500 },
      );
    }

    const parsedResult = JSON.parse(rawResult);

    const validatedResult = electricityExtractionSchema.parse(parsedResult);

    return NextResponse.json({
      result: validatedResult,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "PDF extraction failed" },
      { status: 500 },
    );
  }
}
