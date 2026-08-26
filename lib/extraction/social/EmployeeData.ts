import { gemini } from "@/lib/gemni";
import { employeeExtractionSchema } from "@/lib/validations/extractionSchema";

export async function extractEmployeeData(file: File) {
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

- number of employees
- number of male
- number of female
- employee turnover
- traininghours

Return only JSON in this exact structure:

{
  "number of employees": number | null,
  "number of male": number | null,
  "number of female": number | null,
  "employee turnover": number | null,
  "traininghours": number | null,

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

  return employeeExtractionSchema.parse(parsedResult);
}
