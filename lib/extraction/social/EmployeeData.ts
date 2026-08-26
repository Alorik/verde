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
Extract the following employee-related information from this document:

- total number of employees
- number of male employees
- number of female employees
- employee turnover
- total training hours

Return only JSON in this exact structure:

{
  "totalEmployees": number | null,
  "male": number | null,
  "female": number | null,
  "employeeTurnover": number | null,
  "trainingHours": number | null
}

Rules:
- Return numbers only, without units or symbols.
- For percentages, return only the numeric value.
  Example: "12.5%" → 12.5
- If a value cannot be found, return null.
- Do not estimate or infer values that are not present in the document.
- Do not include any other fields.
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
