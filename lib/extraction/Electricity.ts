import { gemini } from "../gemni";
import { electricityExtractionSchema } from "../validations/esgScore";

export async function extractElectricityData(file: File) {
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
- electricity consumption
- the actual unit used for electricity consumption

Return only JSON in this exact structure:

{
  "electricityCost": number | null,
  "unitsConsumed": number | null,
  "unit": string | null
}

If a value cannot be found, return null.

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
    throw new Error("Gemini returned no extraction result");
  }

  const parsedResult = JSON.parse(rawResult);

  return electricityExtractionSchema.parse(parsedResult);
}
